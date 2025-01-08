const express = require('express');
const request = require('request');
const dotenv = require('dotenv');

const port = 5001;

dotenv.config();

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var spotify_redirect_uri = 'http://localhost:3000/auth/callback';

let access_token = '';

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.get('/login', (req, res) => {
    var authUrl = 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + spotify_client_id +
      '&scope=user-library-read' + // Add your desired scope(s)
      '&redirect_uri=' + encodeURIComponent(spotify_redirect_uri);
      
    console.log("Redirecting to Spotify login: ", authUrl); // Log the URL for debugging
    res.redirect(authUrl);
  });

app.get('/auth/callback', (req, res) => {

    var code = req.query.code;
  
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: spotify_redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token;
        res.redirect('/')
      }
    });
  
  })
  
app.get('/auth/token', (req, res) => {
  res.json({ access_token: access_token }); // Send the access token
});

app.get('/', (req, res) => {
  if (!access_token) {
    res.send('No access token available');
  } else {
    res.send('Access Token is available');
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});