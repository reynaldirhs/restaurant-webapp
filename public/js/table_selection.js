// public/js/table_selection.js

document.addEventListener('DOMContentLoaded', () => {
    const tableContainer = document.getElementById('table-container');
  
    // Function to get section and printer IP based on table number
    function getPrinterInfo(tableNumber) {
      for (const section of tableMapping) {
        if (section.tables.includes(tableNumber)) {
          return { section: section.section, printerIP: section.printerIP };
        }
      }
      return null;
    }
  
    // Render active tables
    activeTables.forEach((tableNumber) => {
      const printerInfo = getPrinterInfo(tableNumber);
      if (printerInfo) {
        const button = document.createElement('button');
        button.textContent = `Table ${tableNumber} - ${printerInfo.section}`;
        button.addEventListener('click', () => {
          if (confirm(`Print QR code for Table ${tableNumber}?`)) {
            // Send request to the server to generate and print QR code
            fetch('/print', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ tableNumber })
            })
              .then((response) => response.text())
              .then((data) => {
                alert(data);
              })
              .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while processing your request.');
              });
              
          }
        });
        tableContainer.appendChild(button);
      }
    });
  });
  