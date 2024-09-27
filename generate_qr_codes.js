// generate_qr_codes.js

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateQRCodes() {
  for (let tableNumber = 1; tableNumber <= 5; tableNumber++) { // Limit to 5 tables for testing
    const url = `http://10.155.1.107:3000/survey?table=${tableNumber}`;
    const qrCodePath = path.join(__dirname, 'qrcodes', `table_${tableNumber}.png`);

    try {
      await QRCode.toFile(qrCodePath, url, {
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      console.log(`Generated QR code for table ${tableNumber}`);
    } catch (error) {
      console.error(`Error generating QR code for table ${tableNumber}:`, error);
    }
  }
}

generateQRCodes();
