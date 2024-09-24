// index.js

// Add at the top
const QRCode = require('qrcode');

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
  // index.js (Add this code below existing routes)

const tableMapping = [
  // Include the same mapping here or import from a separate file
  { tables: [1, 2, 3, 4, 5], section: 'SECTION1', printerIP: '192.168.10.14' },
  // ... (include all sections as before)
];

// Function to get printer IP based on table number
function getPrinterIP(tableNumber) {
  for (const section of tableMapping) {
    if (section.tables.includes(tableNumber)) {
      return section.printerIP;
    }
  }
  return null;
}

// Route to handle print requests
app.post('/print', (req, res) => {
    const tableNumber = req.body.tableNumber;
    const printerIP = getPrinterIP(tableNumber);
  
    if (!printerIP) {
      return res.status(400).send('Invalid table number');
    }
  
    const sessionId = generateSessionId(); // Implement this function to generate unique session IDs
    const surveyUrl = `https://yourrestaurant.com/survey?table=${tableNumber}&session=${sessionId}`;

  // Simulate QR code generation and printing
  // In actual implementation, you would generate the QR code and send it to the printer
  console.log(`Printing QR code for Table ${tableNumber} to printer at ${printerIP}`);

  // Respond to the client
  res.send(`QR code for Table ${tableNumber} is being printed.`);
});
  // Generate QR code
  QRCode.toDataURL(surveyUrl, (err, qrCodeDataURL) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error generating QR code');
    }

    // Send QR code to printer (simulate for now)
    console.log(`Printing QR code for Table ${tableNumber} to printer at ${printerIP}`);
    // You would implement printer communication here

    res.send(`QR code for Table ${tableNumber} is being printed.`);
  });
});

// Function to generate a unique session ID (simple example)
function generateSessionId() {
  return Math.random().toString(36).substr(2, 9);
}
