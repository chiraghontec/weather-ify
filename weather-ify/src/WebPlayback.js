import React, { useEffect, useState } from 'react';

function WebPlayback({ token }) {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Weather Music Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener('ready', ({ device_id }) => {
        console.log('Device ready with ID:', device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device has gone offline:', device_id);
      });

      player.connect();
    };
  }, [token]);

  return <div>Spotify Web Playback is ready!</div>;
}

export default WebPlayback;