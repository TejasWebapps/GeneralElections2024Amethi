// Replace with your Google Sheets URL
const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1oqhABLQfm_a8TK_cSLfByiGuSc2zNtPFwswnkyUMxTA/edit?usp=sharing';

// Function to get unique values from a column
function getUniqueValues(data, columnName) {
    return [...new Set(data.map(row => row[columnName]))];
}

// Function to populate dropdown options
function populateDropdown(selectId, options) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = `Select ${selectId}`;
    selectElement.add(defaultOption);

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.text = option;
        selectElement.add(optionElement);
    });
}

// Function to filter data based on selected values
function filterData() {
    const assembly = document.getElementById('assembly').value;
    const ps = document.getElementById('ps').value;
    const boothNo = document.getElementById('boothNo').value;

    // Fetch data from Google Sheets using Google Sheets API
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/1oqhABLQfm_a8TK_cSLfByiGuSc2zNtPFwswnkyUMxTA/values/Sheet1?key=AIzaSyCSHZDbtkaQgjyAMpCO0pAT-0DIyOLbqdE`)
        .then(response => response.json())
        .then(data => {
            const dataTable = data.values;

            // Filter data based on selected values
            const filteredData = dataTable.filter(row => (!assembly || row[1] === assembly) && (!ps || row[3] === ps) && (!boothNo || row[5] === boothNo));

            // Extract the desired columns
            const resultData = filteredData.length > 0 ?
                filteredData.map(row =>
                    `बूथ की लोकेशन: <a href="https://www.google.com/maps/search/?api=1&query=${row[6]}" target="_blank">लोकेशन देखने के लिए क्लिक करें </a><br>
                     बूथ प्रभारी / अधिकारी का नाम: ${row[7]}<br>
                     बूथ प्रभारी / अधिकारी का मोबाइल नंबर: <a href="tel:${row[8]}">${row[8]}</a><br>
                     बूथ कर्मचारी का नाम: ${row[9]}<br>
                     बूथ कर्मचारी का मोबाइल नंबर: <a href="tel:${row[10]}">${row[10]}</a>`
                ).join('<br><br>') : 'No data found';

            // Display the result
            document.getElementById('result').innerHTML = resultData;
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Fetch unique values for Assembly, PS, and Booth No and populate dropdowns
fetch(`https://sheets.googleapis.com/v4/spreadsheets/1oqhABLQfm_a8TK_cSLfByiGuSc2zNtPFwswnkyUMxTA/values/Sheet1?key=AIzaSyCSHZDbtkaQgjyAMpCO0pAT-0DIyOLbqdE`)
    .then(response => response.json())
    .then(data => {
        const dataTable = data.values;

        const assemblyOptions = getUniqueValues(dataTable, 1);
        populateDropdown('assembly', assemblyOptions);

        document.getElementById('assembly').addEventListener('change', function() {
            const selectedAssembly = this.value;

            // Filter PS options based on selected Assembly
            const psOptions = getUniqueValues(dataTable.filter(row => row[1] === selectedAssembly), 3);
            populateDropdown('ps', psOptions);

            // Reset Booth No dropdown
            populateDropdown('boothNo', []);
        });

        document.getElementById('ps').addEventListener('change', function() {
            const selectedAssembly = document.getElementById('assembly').value;
            const selectedPS = this.value;

            // Filter Booth No options based on selected Assembly and PS
            const boothNoOptions = getUniqueValues(dataTable.filter(row => row[1] === selectedAssembly && row[3] === selectedPS), 5);
            populateDropdown('boothNo', boothNoOptions);
        });
    })
    .catch(error => console.error('Error fetching data:', error));
