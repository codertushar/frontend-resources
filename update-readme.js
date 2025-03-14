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
    console.log(`Inspecting: ${file}`); // Add this for debugging
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file)); // Recurse into subfolders
    } else {
      results.push(file);
    }
  });
  console.log(`Files found: ${results.join(', ')}`); // Log found files
  return results;
}

function generateLinks() {
  let links = '';
  folders.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    const files = getFiles(folderPath);

    // Add folder header (e.g., "Polyfills")
    if (folder === 'polyfills') {
      links += `## ${folder.charAt(0).toUpperCase() + folder.slice(1)}\n\n`;
    } else {
      // For 'utils', add it as a list item instead of a section header
      links += `- ${folder}\n`;
    }

    // Group files by their folder (subdirectories)
    const folderHierarchy = {};
    files.forEach(file => {
      const relativePath = path.relative(__dirname, file).replace(/\\/g, '/');
      const hierarchy = path.dirname(relativePath).replace(/\\/g, '/');
      if (!folderHierarchy[hierarchy]) {
        folderHierarchy[hierarchy] = [];
      }
      folderHierarchy[hierarchy].push({ name: path.basename(file), path: relativePath });
    });

    // Process the folder hierarchy and files
    Object.keys(folderHierarchy).forEach(hierarchy => {
      const hierarchyParts = hierarchy.split('/');
      const indentLevel = hierarchyParts.length - 1;

      // Check if it's a root-level folder (like 'array' in 'polyfills/array')
      if (indentLevel === 1) {
        links += `- ${hierarchyParts[1]}\n`; // Folder name like 'array' under 'polyfills'
      }

      // Add files under the correct folder with indentation
      folderHierarchy[hierarchy].forEach(file => {
        links += `${' '.repeat((indentLevel + 1) * 4)}- [${file.name}](${file.path})\n`;
      });

      links += '\n'; // Add a newline after each folder's files
    });
    links += '\n'; // Add a blank line after each folder
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
