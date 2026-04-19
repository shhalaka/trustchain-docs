import { useState } from 'react';
import axios from 'axios';

function Issue() {
  const [file, setFile] = useState(null);
  const [issuer, setIssuer] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="card">
      <h2>Issue Document</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Document File</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
          />
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
          <p><strong>ID:</strong> {result.documentId}</p>
          <p style={{marginTop: '0.5rem'}}><strong>Tx:</strong> {result.txHash.slice(0, 20)}...</p>
          <p style={{marginTop: '0.75rem', fontSize: '0.8125rem', opacity: 0.7}}>
            Save this Document ID for verification
          </p>
        </div>
      )}
    </div>
  );
}

export default Issue;