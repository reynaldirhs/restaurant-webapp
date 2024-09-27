// public/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // Fixed URL for concatenation
    const fixedUrl = 'https://feedback.gurih7.com/GUR7/';
  
    // Elements for manual entry
    const salesNumberInput = document.getElementById('sales-number');
    const printerSelect = document.getElementById('printer-select');
    const printButton = document.getElementById('print-button');
  
    // Elements for POS integration
    const sectionsContainer = document.getElementById('sections-container');
  
    // Function to fetch active tables and render buttons
    function fetchAndRenderActiveTables() {
      fetch('/active-tables')
        .then((response) => response.json())
        .then((data) => {
          const activeTables = data.activeTables;
  
          // Function to get active tables for a section
          function getActiveTablesForSection(sectionTables) {
            return sectionTables.filter((tableNumber) => activeTables.includes(tableNumber));
          }
  
          // Render the sections and tables
          tableMapping.forEach((section) => {
            const activeTablesInSection = getActiveTablesForSection(section.tables);
  
            if (activeTablesInSection.length > 0) {
              // Create a section container
              const sectionDiv = document.createElement('div');
              sectionDiv.classList.add('section');
  
              // Create a section heading
              const sectionHeading = document.createElement('h3');
              sectionHeading.textContent = section.section;
              sectionDiv.appendChild(sectionHeading);
  
              // Create a container for the table buttons
              const tablesDiv = document.createElement('div');
              tablesDiv.classList.add('tables');
  
              // Create buttons for each active table
              activeTablesInSection.forEach((tableNumber) => {
                const button = document.createElement('button');
                button.textContent = `Table ${tableNumber}`;
                button.addEventListener('click', () => {
                  // Send request to the server to generate and print QR code
                  fetch('/print', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tableNumber }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.success) {
                        // For testing, open a new tab with the print image
                        const newWindow = window.open();
                        newWindow.document.write(`<img src="${data.printImage}" alt="Print Preview" />`);
                        newWindow.document.title = 'Print Preview';
                      } else {
                        alert(data.message || 'An error occurred.');
                      }
                    })
                    .catch((error) => {
                      console.error('Error:', error);
                      alert('An error occurred while processing your request.');
                    });
                });
                tablesDiv.appendChild(button);
              });
  
              // Append the tables to the section container
              sectionDiv.appendChild(tablesDiv);
  
              // Append the section to the main container
              sectionsContainer.appendChild(sectionDiv);
            }
          });
        })
        .catch((error) => {
          console.error('Error fetching active tables:', error);
          sectionsContainer.textContent = 'Error loading active tables.';
        });
    }
  
    // Fetch and render active tables on page load
    fetchAndRenderActiveTables();
  
    // Event listener for manual entry print button
    printButton.addEventListener('click', () => {
      console.log('Print button clicked');
      const salesNumber = salesNumberInput.value.trim();
      const printerIP = printerSelect.value;
  
      console.log('Sales Number:', salesNumber);
      console.log('Printer IP:', printerIP);
  
      if (!salesNumber) {
        alert('Please enter the sales number.');
        return;
      }
  
      if (!printerIP) {
        alert('Please select a printer.');
        return;
      }
  
      // Concatenate the sales number with the fixed URL
      const fullUrl = `${fixedUrl}${salesNumber}`;
      console.log('Full URL:', fullUrl);
  
      // Send the data to the server to generate QR code and print
      fetch('/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullUrl, printerIP }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Open a new tab with the simulated print content for testing
            const newWindow = window.open();
            newWindow.document.write(`<img src="${data.printImage}" alt="Print Preview" />`);
            newWindow.document.title = 'Print Preview';
          } else {
            alert(data.message || 'An error occurred.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('An error occurred while processing your request.');
        });
    });
  });
  