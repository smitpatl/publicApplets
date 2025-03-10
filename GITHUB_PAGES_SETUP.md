# Setting Up GitHub Pages for Applets

This guide provides instructions for setting up GitHub Pages to host the interactive math applets in this repository.

## Overview

GitHub Pages allows you to host your applets directly from your GitHub repository. When properly configured, each subfolder in the `publicApplets` directory will be accessible as a separate web page.

## Setup Instructions

### 1. Create a GitHub Repository

If you haven't already:

1. Create a new repository on GitHub (or use an existing one)
2. Push your code to this repository

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select the branch you want to deploy from (typically `main`)
5. For the folder, select the `/` (root) option
6. Click "Save"

GitHub will provide you with a URL where your site is published (typically `https://yourusername.github.io/repo-name/`).

### 3. Configuring the GitHub Pages Workflow

A GitHub workflow file has already been created at `.github/workflows/github-pages.yml`. This workflow automatically deploys your content to GitHub Pages whenever changes are pushed to the main branch.

No further configuration should be needed as long as this file is included in your repository.

## How It Works

1. Each folder in the `publicApplets` directory that contains an `index.html` file will be treated as a separate applet
2. These applets will be accessible at URLs like:
   `https://yourusername.github.io/repo-name/publicApplets/Box%20Height/`
3. The main index page at `https://yourusername.github.io/repo-name/publicApplets/` will list all available applets

## Adding New Applets

To add a new applet:

1. Create a new folder in the `publicApplets` directory (e.g., `publicApplets/New Applet/`)
2. Add an `index.html` file with your applet content
3. Ensure any shared resources (like the Zdog library) are properly referenced with relative paths (e.g., `../js/zdog.dist.min.js`)
4. Run the `update-index.js` script to update the main index page:
   ```
   cd simple-applet-generator/publicApplets
   node update-index.js
   ```
5. Commit and push your changes to GitHub, and the new applet will automatically be published

## Automatic Index Update

The `update-index.js` script:
- Automatically detects all folders with an `index.html` file
- Extracts the title from each applet's HTML
- Updates the main index page with links to all applets
- Should be run after adding or removing applets

## Troubleshooting

If your applets don't appear on GitHub Pages:

1. Check that GitHub Pages is properly enabled in your repository settings
2. Ensure the GitHub Pages workflow is running correctly (check the "Actions" tab)
3. Verify that your folder structure matches what's expected (each applet in its own folder with an index.html file)
4. Verify that all file references in your HTML (JS, CSS, images) use relative paths
