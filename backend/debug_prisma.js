const { execSync } = require('child_process');
const fs = require('fs');

try {
  const out = execSync('npx prisma generate', { 
    cwd: 'C:\\Users\\Georg\\Desktop\\Portfolio\\Frontistirio Tracking APP\\backend'
  });
  fs.writeFileSync('prisma_debug.log', out.toString());
  console.log('SUCCESS');
} catch (e) {
  fs.writeFileSync('prisma_debug.log', e.stdout?.toString() + '\n' + e.stderr?.toString());
  console.log('FAILED');
}
