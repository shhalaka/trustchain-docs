import { useEffect, useState } from 'react';
import axios from 'axios';

function History() {
  const darkMode = document.body.classList.contains('dark') || false;
  const [docs, setDocs] = useState([]);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await axios.get(`${API}/documents`);
        setDocs(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocs();
  }, []);

  return (
    <div className="card">
        <h2>Issued Documents</h2>

        <input
            type="text"
            placeholder="Search by ID or issuer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '16px',
              borderRadius: '8px',
              border: darkMode
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid #e5e7eb',
              background: darkMode
                ? 'rgba(255,255,255,0.05)'
                : '#f9fafb',
              color: darkMode ? '#e5e7eb' : '#111827',
              outline: 'none'
            }}
            />
      {docs.length === 0 ? (
        <p>No documents found</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {docs
            .filter(doc =>
                doc.documentId.toLowerCase().includes(search.toLowerCase()) ||
                doc.issuer.toLowerCase().includes(search.toLowerCase())
            )
            .map((doc) => (
            <div
              key={doc._id}
              className="result valid"
              style={{
                cursor: 'pointer',
                textAlign: 'center'
              }}
                onClick={() => setOpenId(openId === doc._id ? null : doc._id)}
            >
              <span style={{ fontSize: '13px', opacity: 0.8, fontWeight: '500' }}>
              Issued
              </span>
              <span style={{ fontSize: '13px', opacity: 0.7, display: 'block', marginBottom: '8px' }}>
                {openId === doc._id ? 'Click to collapse' : 'Click to expand'}
              </span>
              <p>
                <strong>ID:</strong> {doc.documentId}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(doc.documentId, doc._id);
                  }}
                  style={{
                    marginLeft: '8px',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#4f46e5',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {copiedId === doc._id ? 'Copied!' : 'Copy'}
                </button>
              </p>
              <p style={{ opacity: 0.85 }}>
                  <strong>Issuer:</strong> {doc.issuer}
              </p>
              {openId === doc._id && (
                <>
                  <p><strong>File:</strong> {doc.fileName}</p>
                  <p><strong>Date:</strong> {new Date(doc.createdAt).toLocaleString()}</p>

                  {doc.txHash?.length > 10 && (
                    <p style={{ fontSize: '12px', opacity: 0.7 }}>
                      Tx: {doc.txHash.slice(0, 10)}...{doc.txHash.slice(-6)}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(doc.txHash, doc._id + '-tx');
                        }}
                      style={{
                        marginLeft: '8px',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: 'none',
                        background: '#4f46e5',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedId === doc._id + '-tx' ? 'Copied!' : 'Copy'}
                    </button>
                  </p>
                )}
            </>
          )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;