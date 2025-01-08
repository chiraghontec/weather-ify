import React, { useEffect, useState } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    if (token) {
      setToken(token);
    }
  }, []);

  // Function to handle the login and set the token
  const handleLogin = (accessToken) => {
    setToken(accessToken);
  };

  return (
    <>
      {token ? <WebPlayback token={token} /> : <Login onLogin={handleLogin} />}
    </>
  );
}

export default App;