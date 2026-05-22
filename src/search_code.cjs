const fs = require('fs');
const path = require('path');

const searchDir = "/Volumes/Kerberos/Pluto's Project/1. HectraHQ/2. Hardware_Hectra_IoT/2. Hectra Backend/backend";
console.log(`Searching for migration code in: ${searchDir}`);

function walk(dir) {
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (err) {
        return;
      }
      
      if (stat.isFile() && file.endsWith('.py')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes('migration') || content.includes('.sql')) {
          console.log(`[MATCH] ${file} contains migration or .sql`);
        }
      }
      
      if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
        walk(fullPath);
      }
    });
  } catch (err) {
  }
}

walk(searchDir);
console.log("Search complete.");
