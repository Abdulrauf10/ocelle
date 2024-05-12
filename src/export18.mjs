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
          { header: 'ID', key: 'id', width: 300 },
          { header: 'EN', key: 'en', width: 500 },
          { header: 'ZH', key: 'zh', width: 500 }
      ];

      entries.forEach(entry => {
          sheet.addRow({ id: entry[0], en: entry[1], zh: '' });
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