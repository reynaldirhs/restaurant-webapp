// printerTest.js

const escpos = require('escpos');
escpos.Network = require('escpos-network');

const printerIP = '192.168.192.168'; // Replace with your printer's IP address

const device = new escpos.Network(printerIP);
const printer = new escpos.Printer(device);

device.open((error) => {
  if (error) {
    console.error('Error connecting to printer:', error);
    return;
  }

  printer
    .text('Test print')
    .cut()
    .close();
});
