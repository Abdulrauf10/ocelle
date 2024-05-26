import ExcelJS from 'exceljs';
import fs from 'fs';

async function readExcelAndGenerateJSON() {
  const workbook = new ExcelJS.Workbook();
  const filename = 'Translations(edited).xlsx'; // Update this with the path to your Excel file
  await workbook.xlsx.readFile(filename);

  const translations = {};

  workbook.eachSheet((sheet, id) => {
    const sheetName = sheet.name;
    translations[sheetName] = {};
    if (sheetName === 'General') {
      sheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) {
          // Assuming the first row is headers
          const id = row.getCell(1).value;
          const zh = row.getCell(3).value;
          translations[id] = zh;
        }
      });
    } else {
      sheet.eachRow((row, rowIndex) => {
        if (rowIndex > 1) {
          // Assuming the first row is headers
          const id = row.getCell(1).value;
          const zh = row.getCell(3).value;
          translations[sheetName][id] = zh;
        }
      });
    }
  });

  fs.writeFileSync('translations.json', JSON.stringify(translations, null, 2), 'utf8');
  console.log('Translation JSON file has been created.');
}

readExcelAndGenerateJSON().catch(console.error);
