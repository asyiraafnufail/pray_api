import React, { useState } from 'react';
import axios from 'axios';

const KeyGenerator = () => {
  const [apiKey, setApiKey] = useState('');

  const handleGenerateKey = () => {
    
    axios.post('http://localhost:5555/api/generate-key')
      .then(res => {
        setApiKey(res.data.apiKey);
        alert('Success: API Key has been generated!');
      })
      .catch(err => {
        const msg = err.response ? err.response.data.error : 'Failed to generate key';
        alert(msg);
      });
  };

  return (
    <div className="section">
      <h2>1. Generate API Key</h2>
      <p>Get your free API key. Limit: 3 keys per day.</p>
      <button onClick={handleGenerateKey}>Generate Key</button>

      {apiKey && (
        <div className="result-container">
          <strong>Your Key:</strong>
          <pre>{apiKey}</pre>
        </div>
      )}
    </div>
  );
};

export default KeyGenerator;