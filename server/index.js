const express = require('express');

const mongoose = require('mongoose');
const Document = require('./models/Document');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const { generateHash } = require('./utils/hash');
const { issueOnChain, getHashFromChain } = require('./utils/xdc');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const app = express();
app.use(cors({
  origin: '*', 
}));
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Not allowed' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const hash = generateHash(req.file.buffer);
  res.json({ hash });
});

app.post('/issue', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const hash = generateHash(req.file.buffer);
    const documentId = `TC-${Date.now()}`;
    const issuer = req.body.issuer || 'Unknown';

    const txHash = await issueOnChain(documentId, hash);
    const proof = generateHash(Buffer.from(hash + 'zk-trustchain-secret'));

    await Document.create({
      documentId,
      issuer,
      fileName: req.file.originalname,
      txHash,
      proof
    });

    res.json({ documentId, hash, issuer, txHash, proof });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});  

app.post('/verify', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { documentId } = req.body;
    if (!documentId) {
      return res.status(400).json({ error: 'documentId required' });
    }
    
    const uploadedHash = generateHash(req.file.buffer);
    let storedHash = null;
    try {
      storedHash = await getHashFromChain(documentId);
    } catch (err) {
      console.log("Blockchain fetch failed:", err.message);
    }
    const doc = await Document.findOne({ documentId });

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    const recomputedProof = generateHash(Buffer.from(uploadedHash + 'zk-trustchain-secret'));
    const zkValid = recomputedProof === doc?.proof;
    
    const response = {
      status: uploadedHash === storedHash ? "valid" : "tampered",
      message: uploadedHash === storedHash
        ? "Document is authentic"
        : "Document has been modified",
      issuer: doc?.issuer || "Unknown",
      txHash: doc?.txHash || null,
      zkValid
    };

    res.json(response);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/documents', authMiddleware, async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));