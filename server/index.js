const mongoose = require('mongoose');
const Document = require('./models/Document');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { generateHash } = require('./utils/hash');
const { issueOnChain, getHashFromChain } = require('./utils/xdc');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const hash = generateHash(req.file.buffer);
  res.json({ hash });
});

app.post('/issue', upload.single('file'), async (req, res) => {
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
    const storedHash = await getHashFromChain(documentId);
    const doc = await Document.findOne({ documentId });
    
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

app.listen(3000, () => console.log('Server on port 3000'));