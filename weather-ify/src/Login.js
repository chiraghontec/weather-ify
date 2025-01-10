import React from 'react';

function Login() {
  const handleLoginClick = () => {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-read-collaborative',
    ];

    const authUrl = `https://accounts.spotify.com/authorize?client_id=891fc8f02522471b9db2b5974cac49b0&response_type=token&redirect_uri=${encodeURIComponent(
      'http://localhost:3000'
    )}&scope=${encodeURIComponent(scopes.join(' '))}`;

    window.location.href = authUrl; // Redirect the user to Spotify's login page
  };

  return (
    <div>
      <button onClick={handleLoginClick}>Login with Spotify</button>
    </div>
  );
}

export default Login;