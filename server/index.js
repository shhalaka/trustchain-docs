const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { generateHash } = require('./utils/hash');

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

app.post('/issue', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const hash = generateHash(req.file.buffer);
  const documentId = `TC-${Date.now()}`;
  const issuer = req.body.issuer || 'Unknown';
  
  res.json({ documentId, hash, issuer });
});

app.listen(3000, () => console.log('Server on port 3000'));