// public/js/app.js

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Get the start button element
    const startButton = document.getElementById('start-button');
  
    // Check if the start button exists
    if (startButton) {
      // Add a click event listener to the start button
      startButton.addEventListener('click', () => {
        // Navigate to the table selection page
        window.location.href = '/table_selection.html';
      });
    }
  });
  // public/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Existing code...
  
    // Display current date and time
    const dateTimeDisplay = document.getElementById('date-time');
    if (dateTimeDisplay) {
      const now = new Date();
      dateTimeDisplay.textContent = now.toLocaleString();
    }
  });
  // public/js/app.js

// Existing code...

// Display a welcome alert
alert('Welcome, please proceed to select a table.');
