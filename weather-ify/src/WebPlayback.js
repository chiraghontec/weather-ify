import React, { useEffect } from 'react';

function WebPlayback({ token, playlist }) {
  useEffect(() => {
    if (playlist) {
      console.log("Playing playlist:", playlist.name);
    }
  }, [playlist]);

  return (
    <div>
      {playlist ? (
        <div>
          <h2>Now Playing: {playlist.name}</h2>
          <p>{playlist.description}</p>
        </div>
      ) : (
        <p>Loading playlist...</p>
      )}
    </div>
  );
}

export default WebPlayback;