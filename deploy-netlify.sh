#!/bin/bash

# Deploy to Netlify using GitHub integration
echo "Deploying ad-viewer to Netlify..."

# Add netlify config to git
git add netlify.toml .gitignore
git commit -m "Add Netlify configuration"
git push origin main

echo ""
echo "========================================="
echo "Deployment Instructions:"
echo "========================================="
echo ""
echo "1. Go to: https://app.netlify.com/start"
echo "2. Click 'Import from Git'"
echo "3. Connect to GitHub and select: TheEthanDing/ad-viewer"
echo "4. Build settings should auto-detect:"
echo "   - Build command: npm run build"
echo "   - Publish directory: build"
echo "5. Click 'Deploy site'"
echo ""
echo "Your site will be available at a URL like:"
echo "https://[site-name].netlify.app"
echo ""
echo "GitHub repo: https://github.com/TheEthanDing/ad-viewer"