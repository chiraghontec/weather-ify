const express = require('express');
const request = require('request');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 5001;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/auth/callback'; // Same as set in the dashboard

// Generate random string for state
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

// Allow CORS
app.use(cors());

// Step 1: Redirect user to Spotify for authentication
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state streaming';
  
  res.cookie(stateKey, state);
  
  const authUrl = 'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    }).toString();
  
  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for access token
app.get('/auth/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' + new URLSearchParams({ error: 'state_mismatch' }).toString());
  }

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      res.redirect('/#' + new URLSearchParams({
        access_token: access_token,
        refresh_token: refresh_token,
      }).toString());
    } else {
      res.redirect('/#' + new URLSearchParams({ error: 'invalid_token' }).toString());
    }
    res.redirect('http://localhost:3000/#' + 
      new URLSearchParams({ access_token: access_token }).toString()
    );
  });
});

// Step 3: Refresh the access token
app.get('/refresh_token', (req, res) => {
  const refresh_token = req.query.refresh_token;

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.json({ access_token: access_token });
    }
  });
});

app.get('/spotify-search', (req, res) => {
  const { token, query } = req.query;

  const options = {
    url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    json: true,
  };

  request.get(options, (error, response, body) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.send(body);
  });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});