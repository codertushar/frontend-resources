const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');

function getFolders(dir) {
  return fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory() && !file.startsWith('.'));
}

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

function generateLinks() {
  let links = '';
  const folders = getFolders(__dirname);
  folders.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    const files = getFiles(folderPath);
    links += `- ${folder.charAt(0).toUpperCase() + folder.slice(1)}\n`;
    const folderHierarchy = {};
    files.forEach(file => {
      const relativePath = path.relative(__dirname, file).replace(/\\/g, '/');
      const hierarchy = path.relative(__dirname, path.dirname(file)).replace(/\\/g, '/');
      if (!folderHierarchy[hierarchy]) {
        folderHierarchy[hierarchy] = [];
      }
      folderHierarchy[hierarchy].push({ name: path.basename(file), path: relativePath });
    });
    Object.keys(folderHierarchy).forEach(hierarchy => {
      const indentLevel = hierarchy.split('/').length;
      if (indentLevel === 1) {
        links += `${' '.repeat(indentLevel * 4)}- ${hierarchy.split('/').pop()}\n`;
      } else if (indentLevel > 1) {
        links += `${' '.repeat((indentLevel - 1) * 4)}- ${hierarchy.split('/').slice(-2, -1)[0]}\n`;
      }
      folderHierarchy[hierarchy].forEach(file => {
        links += `${' '.repeat((indentLevel + 1) * 4)}- [${file.name}](${file.path})\n`;
      });
    });
    links += '\n';
  });
  return links;
}

function updateReadme() {
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const newLinks = generateLinks();
  const updatedContent = readmeContent.replace(/(<!-- Links will be automatically generated below this line -->)[\s\S]*/, `$1\n\n${newLinks}`);
  fs.writeFileSync(readmePath, updatedContent, 'utf-8');
}

updateReadme();
