import ExcelJS from "exceljs";
import en from '../messages/en.json' assert { type: 'json' };
import zh from '../messages/zh.json' assert { type: 'json' };

const data = en;

async function createExcelFile() {
    const excelName ="translations.v5.xlsx";
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Me';
    workbook.created = new Date();
    workbook.modified = new Date();

    function addToSheet(sheetName, entries) {
        const sheet = workbook.addWorksheet(sheetName);
        sheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'EN', key: 'en', width: 10 },
            { header: 'ZH', key: 'zh', width: 10 }
        ];
        if (sheetName==="General"){
        entries.forEach(entry => {
            const zhTranslation = zh[entry[0]]; // Find the corresponding ZH translation using the ID
            sheet.addRow({ id: entry[0], en: entry[1], zh: zhTranslation || '' });
        });
    }
    else {
        entries.forEach(entry => {
            // const zhTranslation = zh[sheetName][entry[0]]; // Find the corresponding ZH translation using the ID
            try {
            const zhTranslation = zh[sheetName][entry[0]];
            if (!zhTranslation) {
                // console.warn(`Missing translation for ID: ${entry[0]} in sheet: ${sheetName}`);
                sheet.addRow({ id: entry[0], en: entry[1], zh:'' });
            }
            if(zhTranslation){
            console.log(zhTranslation);
            sheet.addRow({ id: entry[0], en: entry[1], zh: zhTranslation || '' });
            }
                }catch(err){
                     console.log(err);
                }
            
        });
    }

        sheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                let cellLength = cell.value ? cell.value.toString().length : 0;
                if (cellLength > maxLength) {
                    maxLength = cellLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength + 2;
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

    await workbook.xlsx.writeFile(excelName);
    console.log('Excel file created successfully.');
}

createExcelFile().catch(err => {
   console.error(err)
}
);