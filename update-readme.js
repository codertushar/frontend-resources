const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');

// Get all top-level folders in the directory
function getFolders(dir) {
  return fs.readdirSync(dir).filter(file => {
    return fs.statSync(path.join(dir, file)).isDirectory() && !file.startsWith('.');
  });
}

// Get appropriate icon for a folder based on its name
function getFolderIcon(folderName) {
  folderName = folderName.toLowerCase();
  
  // Top level categories
  if (folderName === 'dsa') return '🧮';
  if (folderName === 'js') return '📚';
  if (folderName === 'machine-coding') return '🛠️';
  
  // Sub-categories
  if (folderName === 'general-concepts') return '💡';
  if (folderName === 'polyfills') return '🧩';
  if (folderName === 'arrays') return '📊';
  if (folderName === 'promises') return '⏳';
  if (folderName === 'utils') return '🧰';
  if (folderName === 'general') return '📝';
  
  return '📁';
}

// Get appropriate icon for a file based on its name
function getFileIcon(fileName) {
  fileName = fileName.toLowerCase();
  
  if (fileName.includes('array')) return '📊';
  if (fileName.includes('promise')) return '⏳';
  if (fileName.includes('debounce') || fileName.includes('throttle')) return '⏱️';
  if (fileName.includes('calculator')) return '🧮';
  if (fileName.includes('progress')) return '📈';
  if (fileName.includes('event')) return '🔔';
  if (fileName.includes('clone')) return '🧬';
  if (fileName.includes('emitter')) return '📻';
  if (fileName.includes('prototype')) return '🔄';
  if (fileName.includes('bind') || fileName.includes('apply') || fileName.includes('call')) return '🔗';
  if (fileName.includes('breadcrumb')) return '🔍';
  
  return '📄';
}

// Get directory structure as nested objects
function getDirStructure(rootDir) {
  const structure = {};
  
  function processDir(dir, currentObj) {
    const items = fs.readdirSync(dir);
    
    // Sort by type: directories first, then files
    items.sort((a, b) => {
      const aPath = path.join(dir, a);
      const bPath = path.join(dir, b);
      const aIsDir = fs.statSync(aPath).isDirectory();
      const bIsDir = fs.statSync(bPath).isDirectory();
      
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b); // alphabetical within same type
    });
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory() && !item.startsWith('.')) {
        currentObj[item] = { 
          type: 'dir',
          children: {} 
        };
        processDir(itemPath, currentObj[item].children);
      } else if (stats.isFile()) {
        currentObj[item] = { 
          type: 'file',
          path: path.relative(__dirname, itemPath).replace(/\\/g, '/')
        };
      }
    });
  }
  
  // Get top-level folders
  const topFolders = getFolders(rootDir);
  topFolders.forEach(folder => {
    const folderPath = path.join(rootDir, folder);
    structure[folder] = { 
      type: 'dir',
      children: {} 
    };
    processDir(folderPath, structure[folder].children);
  });
  
  return structure;
}

// Generate GitHub-compatible markdown from directory structure
function generateMarkdown(structure) {
  let result = '';
  const entries = Object.entries(structure);
  
  entries.forEach(([name, item], index) => {
    const isLastItem = index === entries.length - 1;
    
    if (item.type === 'dir') {
      // Add top-level directory
      const icon = getFolderIcon(name);
      result += `### ${icon} ${name}\n\n`;
      
      // Add its contents with proper indentation and HTML preformatting
      const childrenMd = generateDirContents(item.children, 1, [isLastItem]);
      result += `<pre>\n${childrenMd}</pre>\n\n`;
      
      // No need for blank line as the pre tag already adds spacing
    }
  });
  
  return result;
}

// Generate contents of a directory with proper tree structure
function generateDirContents(dirContents, level, isLastItems = []) {
  let result = '';
  const entries = Object.entries(dirContents);
  
  entries.forEach(([name, item], index) => {
    const isLastEntry = index === entries.length - 1;
    const currentIsLastItems = [...isLastItems, isLastEntry];
    const indent = getIndent(level, isLastItems);
    
    if (item.type === 'dir') {
      // It's a directory
      const icon = getFolderIcon(name);
      result += `${indent}${isLastEntry ? '└── ' : '├── '}${icon} <b>${name}</b>\n`;
      
      // Process its contents recursively
      const childrenMd = generateDirContents(
        item.children, 
        level + 1, 
        currentIsLastItems
      );
      result += childrenMd;
    } else {
      // It's a file - Use HTML link inside pre tag for GitHub compatibility with target="_blank" to open in new tab
      const icon = getFileIcon(name);
      result += `${indent}${isLastEntry ? '└── ' : '├── '}${icon} <a href="${item.path}" target="_blank">${name}</a>\n`;
    }
  });
  
  return result;
}

// Generate the indentation prefix for tree structure
function getIndent(level, isLastItems) {
  let result = '';
  
  for (let i = 0; i < level - 1; i++) {
    result += isLastItems[i] ? '    ' : '│   ';
  }
  
  return result;
}

function updateReadme() {
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const structure = getDirStructure(__dirname);
  const markdownTree = generateMarkdown(structure);
  
  const updatedContent = readmeContent.replace(
    /(<!-- Links will be automatically generated below this line -->)[\s\S]*/,
    `$1\n\n${markdownTree}`
  );
  
  fs.writeFileSync(readmePath, updatedContent);
  console.log('README.md has been updated successfully with HTML-based tree structure and working links!');
}

updateReadme();
