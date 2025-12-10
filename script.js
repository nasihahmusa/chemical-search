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

// --- 2. Render Results Function ---
function renderTable(data) {
    // Clear the existing table rows
    tableBody.innerHTML = ''; 

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No chemicals found matching your criteria.</td></tr>';
        return;
    }

    data.forEach(chemical => {
        const row = tableBody.insertRow();
        
        // **CRITICAL: Using your new, exact header keys for display**
        row.insertCell().textContent = chemical['Bottle No.'];
        row.insertCell().textContent = chemical['SDS Link']; 
        row.insertCell().textContent = chemical['Chemical Name'];
        row.insertCell().textContent = chemical['CAS No.'];
        row.insertCell().textContent = chemical['Chemical Form'];
        row.insertCell().textContent = chemical['Location'];
        row.insertCell().textContent = chemical['Owner'];
		row.insertCell().textContent = chemical['Status'];

        // SDS Link (Create a clickable link)
        const sdsCell = row.insertCell();
        const sdsLinkValue = chemical['SDS Link'];
        
        if (sdsLinkValue) {
            const sdsLink = document.createElement('a');
            sdsLink.href = sdsLinkValue;
            sdsLink.textContent = 'View SDS';
            sdsLink.target = '_blank'; // Open in new tab
            sdsCell.appendChild(sdsLink);
        } else {
            sdsCell.textContent = 'N/A';
        }
    });
}


// --- 3. Interactive Search/Filter Function ---
function filterChemicals() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter the master data array based on the search term
    const filteredData = chemicalData.filter(chemical => {
        // **CRITICAL: Using your new, exact header keys for search**
        // Search is performed across Chemical Name, and CAS No.
        const searchableText = `${chemical['Chemical Name']} ${chemical['CAS No.']}`.toLowerCase();
        
        return searchableText.includes(searchTerm);
    });

    // Re-render the table with the filtered results
    renderTable(filteredData);
    
    // Update the status message
    if (searchTerm) {
        statusMessage.textContent = `${filteredData.length} results found for "${searchTerm}".`;
    } else {
        statusMessage.textContent = `Database loaded successfully. Total chemicals: ${chemicalData.length}`;
    }
}

// Start the process when the page loads

fetchChemicals();
