// models/posData.js

const mysql = require('mysql2/promise'); // Or your preferred database library

// Configure your database connection
const dbConfig = {
  host: '192.168.10.4', // POS database IP
  user: 'your_db_username',
  password: 'your_db_password',
  database: 'your_db_name',
};

// For testing at home, use a mock function
async function getSalesNumberByTable(tableId) {
    // Simulate database records
    const mockData = {
      1: 'SGU7172732860983',
      2: 'SGU7172732896268',
      // Add more mock data as needed
    };
  
    return mockData[tableId] || null;
  }
  
  module.exports = {
    getSalesNumberByTable,
    // ... other exported functions
  };
  
