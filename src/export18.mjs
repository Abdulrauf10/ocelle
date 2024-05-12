import ExcelJS from "exceljs";
import en from '../messages/en.json' assert { type: 'json' };

const data = en;
async function createExcelFile() {
  const workbook = new ExcelJS.Workbook();  // Create a new workbook
  workbook.creator = 'Me';
  workbook.lastModifiedBy = 'Me';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Function to add data to sheets
  function addToSheet(sheetName, entries) {
    const sheet = workbook.addWorksheet(sheetName);
    sheet.columns = [
        { header: 'ID', key: 'id', width: 10 }, // Initial width, will adjust
        { header: 'EN', key: 'en', width: 10 }, // Initial width, will adjust
        { header: 'ZH', key: 'zh', width: 10 }  // Initial width, will adjust
    ];

    entries.forEach(entry => {
        sheet.addRow({ id: entry[0], en: entry[1], zh: '' });
    });

    sheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
            let cellLength = cell.value ? cell.value.toString().length : 0;
            if (cellLength > maxLength) {
                maxLength = cellLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;  // Set column width based on max content length
    });
}

  // Add general data
  const generalEntries = Object.entries(data).filter(([key, value]) => typeof value === 'string');
  addToSheet('General', generalEntries);

  // Add nested data
  Object.entries(data).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
          const entries = Object.entries(value);
          addToSheet(key, entries);
      }
  });

  // Write to a file
  await workbook.xlsx.writeFile('Translations.xlsx');
  console.log('Excel file created successfully.');
}

createExcelFile().catch(err => console.error(err));