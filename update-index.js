/**
 * Update Index Script
 * 
 * This script automatically discovers applet folders and updates index.html
 * Run this script after adding a new applet folder to update the main index page
 */

const fs = require('fs');
const path = require('path');

// Configuration
const baseDir = __dirname;
const indexFile = path.join(baseDir, 'index.html');

// Function to extract title from applet's index.html
function extractAppletTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1] : null;
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
}

// Function to discover applet folders
function discoverApplets() {
  const applets = [];
  
  // Read all items in the directory
  const items = fs.readdirSync(baseDir);
  
  // Filter for directories only
  items.forEach(item => {
    const itemPath = path.join(baseDir, item);
    
    // Skip if it's not a directory or if it's a hidden directory (starts with .)
    if (!fs.statSync(itemPath).isDirectory() || item.startsWith('.')) {
      return;
    }
    
    // Check if the directory contains an index.html file
    const indexPath = path.join(itemPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      // Extract title from the index.html file
      const title = extractAppletTitle(indexPath) || item;
      
      applets.push({
        name: item,
        title: title
      });
    }
  });
  
  return applets;
}

// Function to update the index.html file
function updateIndexHtml(applets) {
  // Read the index.html file
  let content = fs.readFileSync(indexFile, 'utf8');
  
  // Create HTML for all applet cards
  const appletCardsHtml = applets.map(applet => `
    <div class="card">
        <div class="card-content">
            <h2 class="card-title">${applet.title.replace(' Challenge', '')}</h2>
            <p class="card-description">Interactive visualization for ${applet.title.toLowerCase()}</p>
        </div>
        <a href="./${encodeURIComponent(applet.name)}/" class="card-button">Open Applet</a>
    </div>
  `).join('\n');
  
  // Replace the applet container content
  const startMarker = '<div class="cards-container">';
  const endMarker = '</div><!-- end cards -->';
  
  // Find the position of the markers
  const startPos = content.indexOf(startMarker);
  const endPos = content.indexOf(endMarker, startPos + startMarker.length) + endMarker.length;
  
  if (startPos === -1 || endPos === -1) {
    throw new Error('Could not find the applet container in index.html');
  }
  
  // Replace the content between the markers
  const newContent = content.substring(0, startPos + startMarker.length) + 
    `\n      <!-- Applet cards dynamically generated -->\n${appletCardsHtml}\n    ` + 
    content.substring(endPos);
  
  // Write the updated content back to the file
  fs.writeFileSync(indexFile, newContent, 'utf8');
  
  console.log(`Updated index.html with ${applets.length} applets`);
}

// Main execution
try {
  const applets = discoverApplets();
  console.log(`Discovered ${applets.length} applet(s):`, applets.map(a => a.name).join(', '));
  
  if (applets.length > 0) {
    updateIndexHtml(applets);
    console.log(`Index updated successfully with ${applets.length} applets`);
    console.log('Cards added for:');
    applets.forEach(applet => {
      console.log(`  - ${applet.title} (${applet.name})`);
    });
  } else {
    console.log('No applets found, index not updated');
  }
} catch (error) {
  console.error('Error updating index:', error);
}
