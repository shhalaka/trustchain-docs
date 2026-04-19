import { useState } from 'react';
import axios from 'axios';

function Verify() {
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="card">
      <h2>Verify Document</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Document File</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
          />
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
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Document'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      {result && (
        <div className={`result ${result.status}`}>
          <h3>Result</h3>
          <p style={{fontSize: '1.125rem', fontWeight: 600}}>
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default Verify;