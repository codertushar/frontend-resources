const fs = require('fs');
const path = require('path');

const folders = ['polyfills', 'utils'];
const readmePath = path.join(__dirname, 'README.md');

function getFiles(dir) {
  console.log(`Reading directory: ${dir}`);
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
  console.log(`Files found: ${results.join(', ')}`);
  return results;
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
  console.log('Reading README.md file...');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  console.log('Generating new links...');
  const newLinks = generateLinks();
  console.log('Updating README.md content...');
  const updatedContent = readmeContent.replace(/(<!-- Links will be automatically generated below this line -->)[\s\S]*/, `$1\n\n${newLinks}`);
  fs.writeFileSync(readmePath, updatedContent, 'utf-8');
  console.log('README.md updated successfully.');
}

updateReadme();
