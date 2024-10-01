const AdmZip = require('adm-zip');

async function zipToDeploy() {
  const zip = new AdmZip();

  zip.addLocalFolder('.next', '.next');
  zip.addLocalFolder('src', 'src');
  zip.addLocalFile('package-lock.json');
  zip.addLocalFile('package.json');

  for (const argv of process.argv) {
    if (argv === 'full') {
      zip.addLocalFolder('public', 'public');
      break;
    }
  }

  await zip.writeZipPromise('Archive.zip');
}

zipToDeploy();
