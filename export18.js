import fs from 'fs';

import en from './messages/en.json';

let data = en;
console.log(en);

function convertToTableData(buttonTexts) {
  const headers = ['ID', 'English', 'Chinese'];
  const rows = [headers.join('\t')]; // Start with headers, using tab as delimiter for TSV format

  for (const [key, value] of Object.entries(buttonTexts)) {
    rows.push([key, value, ''].join('\t')); // Chinese translations are empty initially
  }

  return rows.join('\n'); // Join all rows with newline character for CSV-like output
}

const tableData = convertToTableData(buttonTexts);

// Write the data to a TSV file
fs.writeFile('buttonTexts.tsv', tableData, (err) => {
  if (err) {
    console.error('Error writing to file:', err);
    return;
  }
  console.log('Successfully wrote data to buttonTexts.tsv');
});
