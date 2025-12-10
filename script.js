// REPLACE THIS WITH YOUR ACTUAL GOOGLE APPS SCRIPT WEB APP URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbysXcqeFC3J1PgkpMaDy34uVVeJsA_DLdankJh5CxsEyQXLothB4ZuCfyxnbwkLdbsK4A/exec'; 

let chemicalData = []; // Stores the master copy of the data
const tableBody = document.getElementById('chemicalTableBody');
const statusMessage = document.getElementById('statusMessage');

// --- 1. Fetch Data Function ---
async function fetchChemicals() {
    statusMessage.textContent = "Fetching data from Google Sheet...";
    try {
        const response = await fetch(APPS_SCRIPT_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        chemicalData = await response.json();
        
        // Initial display of all chemicals once loaded
        renderTable(chemicalData);
        statusMessage.textContent = `Database loaded successfully. Total chemicals: ${chemicalData.length}`;
        statusMessage.style.color = 'green';
        
    } catch (error) {
        console.error("Could not fetch data:", error);
        statusMessage.textContent = "Error loading data. Check console for details.";
        statusMessage.style.color = 'red';
    }
}

// ... (start of script.js file remains the same, including fetchChemicals function)

// --- 2. Render Results Function (UPDATED) ---
function renderTable(data) {
    // Clear the existing table rows
    tableBody.innerHTML = ''; 

    if (data.length === 0) {
        // Updated colspan to 8 for all 8 columns
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No chemicals found matching your criteria.</td></tr>';
        return;
    }

    data.forEach(chemical => {
        const row = tableBody.insertRow();
        
        // **CRITICAL: The insertion order below MUST match your HTML header order.**
        
        // 1. Bottle No. (Using your Google Sheet key: 'Bottle number')
        row.insertCell().textContent = chemical['Bottle No.'];
        
        // 2. SDS Link (Using your Google Sheet key: 'SDS Link')
        const sdsCell = row.insertCell();
        const sdsLinkValue = chemical['SDS Link'];
        if (sdsLinkValue) {
            const sdsLink = document.createElement('a');
            sdsLink.href = sdsLinkValue;
            sdsLink.textContent = 'View SDS';
            sdsLink.target = '_blank';
            sdsCell.appendChild(sdsLink);
        } else {
            sdsCell.textContent = 'N/A';
        }
        
        // 3. Chemical Name (Assuming your Google Sheet key is 'Product Name')
        // *If your Sheet key is 'Chemical Name', change 'Product Name' below.*
        row.insertCell().textContent = chemical['Chemical Name'];

        // 4. CAS No. (Using your Google Sheet key: 'CAS NO.')
        row.insertCell().textContent = chemical['CAS No.']; 
        
        // 5. Chemical Form (Using your Google Sheet key: 'Chemical Form')
        row.insertCell().textContent = chemical['Chemical Form'];
        
        // 6. Location (Using your Google Sheet key: 'Location')
        row.insertCell().textContent = chemical['Location'];
        
        // 7. Owner (Using your Google Sheet key: 'Owner')
        row.insertCell().textContent = chemical['Owner'];
        
        // 8. Status (Using your Google Sheet key: 'Status')
        row.insertCell().textContent = chemical['Status'];
    });
}

// ... (the rest of script.js remains the same, including filterChemicals function)