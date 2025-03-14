const fs = require('fs');
const path = require('path');

const folders = ['polyfills', 'utils'];
const readmePath = path.join(__dirname, 'README.md');

function getFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.map(file => path.join(dir, file));
}

function generateLinks() {
  let links = '';
  folders.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    const files = getFiles(folderPath);
    links += `## ${folder.charAt(0).toUpperCase() + folder.slice(1)}\n\n`;
    files.forEach(file => {
      const relativePath = path.relative(__dirname, file).replace(/\\/g, '/');
      links += `- [${path.basename(file)}](${relativePath})\n`;
    });
    links += '\n';
  });
  return links;
}

function updateReadme() {
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const newLinks = generateLinks();
  const updatedContent = readmeContent.replace(/(## Files\n\n)[\s\S]*/, `$1${newLinks}`);
  fs.writeFileSync(readmePath, updatedContent, 'utf-8');
}

updateReadme();
