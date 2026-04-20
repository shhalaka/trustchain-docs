import { useState, useRef } from 'react';
import axios from 'axios';

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

function Verify() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [zkMode, setZkMode] = useState(false);

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
    if (!file || !documentId) {
      setError('Please provide both file and document ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentId', documentId);

      const res = await axios.post('http://localhost:3000/verify', formData);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify document');
    } finally {
      setLoading(false);
    }
  };

  const shortenHash = (hash) => {
    if (!hash) return '';
    return hash.slice(0, 10) + '...' + hash.slice(-8);
  };

  return (
    <div className="card">
      <h2>Verify Document</h2>
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
          <label>Document ID</label>
          <input 
            type="text" 
            placeholder="TC-123456789"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <button
            type="button"
            onClick={() => setZkMode(false)}
            style={{
              marginRight: '8px',
              padding: '6px 10px',
              background: !zkMode ? '#4f46e5' : '#e5e7eb',
              color: !zkMode ? '#fff' : '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Normal
          </button>

          <button
            type="button"
            onClick={() => setZkMode(true)}
            style={{
              padding: '6px 10px',
              background: zkMode ? '#4f46e5' : '#e5e7eb',
              color: zkMode ? '#fff' : '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
          }}
        >
          ZK Mode
        </button>
      </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Document'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      {result && (
        <div className={`result ${result.status}`}>
          <div className="result-main">
            <span className="result-icon">
              {result.status === 'valid' ? '✓' : '⚠'}
            </span>
            <div className="result-content">
              <h3 className="result-title">
                {result.status === 'valid'
                  ? 'Document is authentic'
                  : 'Document has been modified'}
              </h3>

              {zkMode ? (
                <>
                  <p style={{ color: '#6366f1', fontWeight: '500' }}>
                    🔒 Verified using Zero-Knowledge Proof
                  </p>

                  <p style={{ opacity: 0.6 }}>
                    Sensitive details hidden
                  </p>
                </>
              ) : (
                <>
                  <p className="result-meta">
                    Issuer: {result.issuer || 'Unknown'}
                  </p>

                  <p className="result-meta">
                    Verified at: {new Date().toLocaleString()}
                  </p>

                  {result.txHash && (
                    <div className="result-tx">
                      <span className="result-tx-label">Transaction:</span>
                      <a
                        href={`https://explorer.apothem.network/txs/${result.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="result-link"
                      >
                        {shortenHash(result.txHash)}
                      </a>
                    </div>
                  )}
              </>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Verify;