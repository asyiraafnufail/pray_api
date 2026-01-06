import React from 'react';
import './App.css';

// Import Komponen Baru
import Header from './components/Header';
import KeyGenerator from './components/KeyGenerator';
import ApiPlayground from './components/ApiPlayground';

function App() {
  return (
    <div className="container">
      <Header />
      
      {/* Komponen dipanggil di sini */}
      <KeyGenerator />
      <ApiPlayground />
      
    </div>
  );
}

export default App;