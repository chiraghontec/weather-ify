import React from 'react';

function Login(props) {

  const handleLoginClick = () => {
    // Logic to handle login and get access token
    const accessToken = 'yourAccessToken';  // This should be received from your backend after successful login
    props.onLogin(accessToken);  // Pass the token to parent component (App.js)
  };

  return (
    <div>
      <button onClick={handleLoginClick}>Login with Spotify</button>
    </div>
  );
}

export default Login;