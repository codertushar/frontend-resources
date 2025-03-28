const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');

// Get all top-level folders in the directory
function getFolders(dir) {
  return fs.readdirSync(dir).filter(file => {
    return fs.statSync(path.join(dir, file)).isDirectory() && !file.startsWith('.');
  });
}

// Get all files recursively in a directory
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

// Convert the nested structure to markdown with proper indentation
function generateMarkdown(folderPath, level = 1) {
  let markdown = '';
  const indent = ' '.repeat(level * 4);
  
  // Get direct files in this directory
  const directFiles = fs.readdirSync(folderPath)
    .filter(file => fs.statSync(path.join(folderPath, file)).isFile())
    .sort();
  
  // Add the direct files with links
  directFiles.forEach(file => {
    const relativePath = path.relative(__dirname, path.join(folderPath, file)).replace(/\\/g, '/');
    markdown += `${indent}- [${file}](${relativePath})\n`;
  });
  
  // Get subdirectories
  const subdirs = fs.readdirSync(folderPath)
    .filter(file => fs.statSync(path.join(folderPath, file)).isDirectory())
    .sort();
  
  // Add subdirectories and their content recursively
  subdirs.forEach(subdir => {
    markdown += `${indent}- ${subdir}\n`;
    markdown += generateMarkdown(path.join(folderPath, subdir), level + 1);
  });
  
  return markdown;
}

function generateLinks() {
  let links = '';
  const folders = getFolders(__dirname);
  
  // Process each top-level folder
  folders.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    links += `- ${folder.toLowerCase()}\n`;
    
    // Generate markdown for this folder's contents
    links += generateMarkdown(folderPath);
    links += '\n';
  });
  
  return links;
}

function updateReadme() {
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const newLinks = generateLinks();
  const updatedContent = readmeContent.replace(
    /(<!-- Links will be automatically generated below this line -->)[\s\S]*/,
    `$1\n\n${newLinks}`
  );
  fs.writeFileSync(readmePath, updatedContent, 'utf-8');
  console.log('README.md has been updated successfully!');
}

updateReadme();
