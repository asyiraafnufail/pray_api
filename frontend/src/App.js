import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [playgroundKey, setPlaygroundKey] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5555/api/cities')
      .then(res => {
        setCities(res.data);
        if (res.data.length > 0) {
          setSelectedCity(res.data[0].id);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleGenerateKey = () => {
    setApiKey('');
    
    axios.post('http://localhost:5555/api/generate-key')
      .then(res => {
        setApiKey(res.data.apiKey);
        setPlaygroundKey(res.data.apiKey);
        alert('Success: API Key has been generated!');
      })
      .catch(err => {
        const msg = err.response ? err.response.data.error : 'Failed to generate key';
        alert(msg);
      });
  };

  const handleTestApi = () => {
    setApiResponse(null);

    if (!playgroundKey) {
      alert('Error: Please provide an API Key first.');
      return;
    }

    axios.get(`http://localhost:5555/api/schedule?cityId=${selectedCity}&key=${playgroundKey}`)
      .then(res => {
        setApiResponse(res.data);
        alert('Success: Data fetched successfully!');
      })
      .catch(err => {
        let msg = '';
        if (err.response) {
          msg = err.response.data.error || 'Unknown Error';
        } else {
          msg = 'Server is disconnected';
        }
        alert(msg);
      });
  };

  return (
    <div className="container">
      <h1>Prayer Time Open API</h1>

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

      <div className="section">
        <h2>2. API Playground</h2>
        <p>Test the endpoints live.</p>

        <div className="label-group">
          <label>Select City</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>

        <div className="label-group">
          <label>API Key</label>
          <input 
            type="text" 
            placeholder="Paste your API Key here"
            value={playgroundKey}
            onChange={(e) => setPlaygroundKey(e.target.value)}
          />
        </div>

        <button onClick={handleTestApi}>GET Schedule</button>

        {apiResponse && (
          <div className="result-container">
            <h3>JSON Response</h3>
            <pre>
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;