import { useState, useRef } from 'react';
import axios from 'axios';

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

function Issue() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('issuer', issuer || 'Unknown');

      const res = await axios.post('http://localhost:3000/issue', formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to issue document');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const shortenHash = (hash) => {
    return hash.slice(0, 10) + '...' + hash.slice(-8);
  };

  return (
    <div className="card">
      <h2>Issue Document</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Document File</label>
          <div 
            className="drop-zone"
            onClick={handleDropZoneClick}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="drop-zone-content">
              {fileName ? (
                <span className="file-name">{fileName}</span>
              ) : (
                <>
                  <span className="drop-zone-text">Click to select file</span>
                  <span className="drop-zone-hint">or drag and drop</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Issuer Name</label>
          <input 
            type="text" 
            placeholder="Enter issuer name"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Issue Document'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      {result && (
        <div className="result">
          <h3>Document Issued</h3>
          
          <div className="result-row">
            <span className="result-label">Document ID:</span>
            <span className="result-value">{result.documentId}</span>
            <button 
              className="icon-btn"
              onClick={() => copyToClipboard(result.documentId, 'id')}
              title="Copy"
            >
              <CopyIcon />
            </button>
            {copied === 'id' && <span className="copied-feedback">Copied!</span>}
          </div>
          
          <div className="result-row">
            <span className="result-label">Transaction:</span>
            <a 
              href={`https://explorer.apothem.network/tx/${result.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="result-link"
            >
              {shortenHash(result.txHash)}
            </a>
            <button 
              className="icon-btn"
              onClick={() => copyToClipboard(result.txHash, 'tx')}
              title="Copy"
            >
              <CopyIcon />
            </button>
            {copied === 'tx' && <span className="copied-feedback">Copied!</span>}
          </div>
          
          <p className="result-hint">
            Save this Document ID for verification
          </p>
        </div>
      )}
    </div>
  );
}

export default Issue;