import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';

const weatherToMusic = {
  clear: "Chill Vibes",
  rain: "Rainy Day",
  snow: "Winter Wonderland",
  clouds: "Lo-Fi Beats",
  thunderstorm: "Epic Instrumentals",
  drizzle: "Acoustic Relaxation",
};

function App() {
  const [token, setToken] = useState('');
  const [weather, setWeather] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [playlistQuery, setPlaylistQuery] = useState('Top Hits');
  const [playlistData, setPlaylistData] = useState(null);
  const [accessToken,  setAccessToken] = useState('');

  useEffect(() => {
    if (accessToken) {
      fetch(`http://localhost:5000/spotify-search?token=${accessToken}&query=${playlistQuery}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Playlist Data:', data);
          setPlaylistData(data);
        })
        .catch((err) => console.error('Error fetching playlists:', err));
    }
  }, [accessToken, playlistQuery]);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    const handleSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      const data = await fetchWeatherData(latitude, longitude);
      setWeather(data);

      if (data) {
        const condition = data.weather[0].main.toLowerCase();
        const genre = weatherToMusic[condition] || "Top Hits"; // Default if no match
        const playlistData = await fetchPlaylist(token, genre);
        setPlaylist(playlistData);
      }
    };

    const handleError = (error) => {
      console.error("Error getting location:", error);
    };

    getUserLocation(handleSuccess, handleError);
  }, [token]);

  return (
    <>
      {token ? (
        <WebPlayback token={token} playlist={playlist} />
      ) : (
        <Login onLogin={setToken} />
      )}
      <div>
      <div>
      <input
        type="text"
        value={playlistQuery}
        onChange={(e) => setPlaylistQuery(e.target.value)}
        placeholder="Enter playlist query"
      />
      <button onClick={() => setPlaylistQuery(playlistQuery)}>Search</button>
      </div>
      </div>
    </>
  );
}

export default App;

// Utility functions
const getUserLocation = (onSuccess, onError) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

const fetchWeatherData = async (lat, lon) => {
  const apiKey = "313c890351cf92d21bd169602e05728f"; // Replace with your OpenWeatherMap API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch weather data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchPlaylist = async (token, genre) => {
  const apiUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    genre
  )}&type=playlist&limit=1`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error(
        `Error fetching playlist: ${errorDetails.error.message}`
      );
      return null;
    }

    const data = await response.json();
    console.log('Fetched Playlist:', data.playlists.items[0]);
    return data.playlists.items[0]; // Return the first playlist
  } catch (error) {
    console.error('Error fetching playlist:', error.message);
    return null;
  }
};

