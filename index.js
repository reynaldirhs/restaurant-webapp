// index.js

// index.js

const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const escpos = require('escpos');
escpos.Network = require('escpos-network');
const axios = require('axios');
const { getActiveTables, getSalesNumberByTable } = require('./models/posData'); // Implement this function
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ... [Rest of your existing code]

// Route to handle survey requests
app.get('/survey', async (req, res) => {
    const { table } = req.query;
  
    if (!table) {
      return res.status(400).send('Table number is required.');
    }
  
    try {
      // Retrieve the sales number from the POS database
      const salesNumber = await getSalesNumberByTable(table);
  
      if (!salesNumber) {
        return res.status(404).send('Sales number not found for this table.');
      }
  
      // Construct the survey URL
      const surveyUrl = `https://feedback.gurih7.com/GUR7/${salesNumber}`;
  
      // Redirect the customer to the survey URL
      res.redirect(surveyUrl);
    } catch (error) {
      console.error('Error handling /survey request:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// ... [Rest of your existing code]



// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Table-to-printer mapping
const tableMapping = [
  { tables: [1, 2, 3, 4, 5], section: 'Section 1', printerIP: '192.168.192.168' },
  { tables: [6, 7, 8, 9, 10, 11, 12, 13, 14], section: 'Section 2', printerIP: '192.168.10.83' },
  { tables: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 44, 45], section: 'Section 3', printerIP: '192.168.10.74' },
  { tables: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55], section: 'Section 4', printerIP: '192.168.10.54' },
  { tables: [56, 57, 58, 59, 60, 61, 62], section: 'Section 5', printerIP: '192.168.10.47' },
  { tables: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], section: 'Section 6', printerIP: '192.168.10.82' },
  { tables: [63, 64, 65, 66, 67, 68, 69, 70, 71, 72], section: 'Resto', printerIP: '192.168.10.190' },
];

// Function to get printer IP based on table number
function getPrinterIPByTableNumber(tableNumber) {
  for (const section of tableMapping) {
    if (section.tables.includes(tableNumber)) {
      return section.printerIP;
    }
  }
  return null;
}

// Route to fetch active tables
app.get('/active-tables', async (req, res) => {
  try {
    const activeTables = await getActiveTables(); // Implement based on your POS integration
    res.json({ activeTables });
  } catch (error) {
    console.error('Error fetching active tables:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle print requests
app.post('/print', async (req, res) => {
  console.log('Received POST request to /print');
  console.log('Request Body:', req.body);

  const { tableNumber, fullUrl, printerIP } = req.body;

  let urlToEncode = '';
  let printerIPToUse = '';

  if (tableNumber) {
    // Handle POS integration case
    printerIPToUse = getPrinterIPByTableNumber(tableNumber);

    if (!printerIPToUse) {
      return res.status(400).json({ success: false, message: 'Invalid table number.' });
    }

    // Generate the URL based on table number and session ID
    const sessionId = generateSessionId();
    urlToEncode = `https://yourrestaurant.com/survey?table=${tableNumber}&session=${sessionId}`;
  } else if (fullUrl && printerIP) {
    // Handle manual entry case
    urlToEncode = fullUrl;
    printerIPToUse = printerIP;
  } else {
    return res.status(400).json({ success: false, message: 'Missing required data.' });
  }

  try {
    // Shorten the URL using TinyURL API
    const shortenedUrl = await shortenUrl(urlToEncode);

    // Generate QR code as a data URL for the simulated print image
    const qrCodeDataURL = await QRCode.toDataURL(shortenedUrl);

    // **Send the response back to the client with the simulated print image**
    // Create a canvas to simulate the printed content
    const canvas = createCanvas(380, 500); // Adjust dimensions as needed
    const ctx = canvas.getContext('2d');

    // Center alignment
    ctx.textAlign = 'center';
    const canvasCenterX = canvas.width / 2;

    // Add "Gurih 7 Bogor" text at the top
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Gurih 7 Bogor', canvasCenterX, 50); // Adjust position as needed

    // Add "Scan untuk Customer Survey" text
    ctx.font = '20px Arial';
    ctx.fillText('Scan untuk Customer Survey', canvasCenterX, 90);

    // Draw the QR code
    ctx.drawImage(await loadImage(qrCodeDataURL), (canvas.width - 200) / 2, 110, 200, 200); // Adjust position and size

    // Add the shortened URL below the QR code
    ctx.font = '16px Arial';
    ctx.fillText(shortenedUrl, canvasCenterX, 330); // Adjust position as needed

    // Convert the canvas to a data URL
    const printImage = canvas.toDataURL();

    // Send the response back to the client with the simulated print image
    res.json({ success: true, printImage });

    // Proceed to connect to the printer and print
    const device = new escpos.Network(printerIPToUse);
    const options = { encoding: 'GB18030' }; // Adjust encoding if needed
    const printer = new escpos.Printer(device, options);

    device.open((error) => {
      if (error) {
        console.error('Error connecting to printer:', error);
        return;
      }

      // Print content using correct methods
      printer
        .align('ct')
        .font('A')
        .style('B')
        .size(1, 1)
        .text('Gurih 7 Bogor')

        .style('NORMAL')
        .size(0, 0) // Decrease text size
        .text('Scan untuk Customer Survey')

        // Reduce QR code size by setting size parameter
        .qrimage(shortenedUrl, { type: 'png', mode: 'dhdw', size: 3 }, function (err) {
          if (err) {
            console.error('Error printing QR code:', err);
            printer.close();
            return;
          }

          // Decrease text size for URL
          printer
            .size(0, 0) // Smallest text size
            .text(shortenedUrl)
            .feed(1) // Add extra line feeds to increase bottom margin
            .cut()
            .close();
        });
    });
  } catch (error) {
    console.error('Error in /print route:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Function to shorten URLs using TinyURL API
async function shortenUrl(longUrl) {
  try {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    return response.data;
  } catch (error) {
    console.error('Error shortening URL:', error);
    // Fallback to original URL if shortening fails
    return longUrl;
  }
}

// Function to generate a unique session ID
function generateSessionId() {
  return Math.random().toString(36).substr(2, 9);
}

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Optionally, send the current active tables upon connection
  socket.on('request-active-tables', async () => {
    try {
      const activeTables = await getActiveTables();
      socket.emit('update-active-tables', activeTables);
    } catch (error) {
      console.error('Error fetching active tables:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Function to emit active tables when they change
// This should be called whenever a table's status changes in your POS system
async function emitActiveTablesUpdate() {
  try {
    const activeTables = await getActiveTables();
    io.emit('update-active-tables', activeTables);
  } catch (error) {
    console.error('Error fetching active tables:', error);
  }
}

// Example: Periodically emit active table updates (every 5 seconds)
// Adjust the interval or trigger based on your POS system integration
setInterval(emitActiveTablesUpdate, 5000); // Every 5 seconds

// Start the server
const port = 3000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running and accessible on your local network.`);
});
