// index.js

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Create an instance of Express
const app = express();

// Define the port number where the server will listen
const port = 3000;

// Middleware to parse incoming JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
// Add this route below the existing routes

// Test route to handle POST requests
app.post('/test', (req, res) => {
    console.log(req.body); // Log the parsed request body
    res.send('Data received');
  });
  