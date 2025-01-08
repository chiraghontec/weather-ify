import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';  // Import the WebPlayback component
import Login from './Login';  // Import the Login component
import './App.css';

function App() {
  const [token, setToken] = useState('');

  // Check for the token in localStorage or set token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to set token after login
  const handleLogin = (receivedToken) => {
    setToken(receivedToken);
    localStorage.setItem('token', receivedToken); // Save token in localStorage for persistence
  };

  return (
    <>
      {token === '' ? (
        <Login onLogin={handleLogin} />  // Pass the handleLogin function to Login component
      ) : (
        <WebPlayback token={token} />  // Pass the token to WebPlayback
      )}
    </>
  );
}

export default App;