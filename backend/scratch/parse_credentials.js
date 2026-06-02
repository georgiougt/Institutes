const fs = require('fs');
const path = require('path');

const logFilePath = 'C:\\Users\\Georg\\.gemini\\antigravity-ide\\brain\\cee258b9-59dd-4d42-aa3f-0c366eec8ce0\\.system_generated\\tasks\\task-254.log';
const outputJsonPath = path.join(__dirname, '..', 'scripts', 'imported_athens_credentials.json');
const outputCsvPath = path.join(__dirname, '..', 'scripts', 'imported_athens_credentials.csv');

try {
  const content = fs.readFileSync(logFilePath, 'utf8');
  const lines = content.split('\n');
  const results = [];

  for (const line of lines) {
    // Check if the line represents a row in the table
    if (line.includes('│') && !line.includes('index') && !line.includes('───')) {
      const parts = line.split('│').map(p => p.trim());
      if (parts.length >= 6) {
        const indexStr = parts[1];
        const name = parts[2].replace(/^'|'$/g, '').trim();
        const email = parts[3].replace(/^'|'$/g, '').trim();
        const password = parts[4].replace(/^'|'$/g, '').trim();
        const area = parts[5].replace(/^'|'$/g, '').trim();

        if (name && email && password && area) {
          results.push({ name, email, password, area });
        }
      }
    }
  }

  // 1. Write JSON file
  fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Successfully wrote ${results.length} credentials to JSON at: ${outputJsonPath}`);

  // 2. Write CSV file with UTF-8 BOM for Greek characters in Excel
  const csvHeaders = 'Name,Email,Password,Area\n';
  const csvRows = results.map(r => `"${r.name.replace(/"/g, '""')}","${r.email}","${r.password}","${r.area.replace(/"/g, '""')}"`).join('\n');
  
  // \ufeff is the UTF-8 BOM character
  fs.writeFileSync(outputCsvPath, '\ufeff' + csvHeaders + csvRows, 'utf8');
  console.log(`Successfully wrote ${results.length} credentials to CSV at: ${outputCsvPath}`);

} catch (err) {
  console.error("Error parsing credentials log:", err);
}
