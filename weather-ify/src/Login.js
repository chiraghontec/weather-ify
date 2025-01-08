import React from 'react';

function Login(props) {

  const handleLoginClick = () => {
    const accessToken = 'access_token';  // Replace this with the actual token from Spotify
    props.onLogin(accessToken);  // Pass the token to parent component (App.js)
  };

  return (
    <div>
      <button onClick={handleLoginClick}>Login with Spotify</button>
    </div>
  );
}

export default Login;