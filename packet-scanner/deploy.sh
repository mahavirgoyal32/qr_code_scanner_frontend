#!/bin/bash

echo "🚀 QR Code Scanner Deployment Script"
echo "===================================="

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "📦 Building application..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Please fix errors and try again."
        exit 1
    fi
    echo "✅ Build completed successfully!"
else
    echo "📦 Build directory found. Using existing build."
fi

echo ""
echo "🌐 Deployment Options:"
echo "1. Deploy to Netlify (drag & drop build folder to https://netlify.com/drop)"
echo "2. Deploy to Vercel (run: npx vercel --prod)"
echo "3. Test locally with HTTPS (requires SSL certificate)"
echo ""
echo "⚠️  IMPORTANT: Camera access requires HTTPS when deployed!"
echo "   - Use HTTPS hosting (Netlify, Vercel, etc.)"
echo "   - Or test on localhost (npm start)"
echo ""
echo "📁 Build files are ready in the 'build' directory"
echo "📖 See DEPLOYMENT.md for detailed instructions"