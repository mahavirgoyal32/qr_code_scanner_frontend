# QR Code Scanner Deployment Guide

## 🚨 Important: HTTPS Required

This QR code scanner app **requires HTTPS** to work when deployed to a server. Modern browsers block camera access on HTTP connections for security reasons.

## Quick Solutions

### Option 1: Deploy with HTTPS
Deploy your app to any of these platforms that provide HTTPS by default:
- **Netlify** (Recommended - Free HTTPS)
- **Vercel** (Free HTTPS)
- **GitHub Pages** (Free HTTPS)
- **Firebase Hosting** (Free HTTPS)

### Option 2: Local Testing with HTTPS
For local development with HTTPS:
```bash
# Install serve globally
npm install -g serve

# Build the app
npm run build

# Serve with HTTPS (requires certificate)
serve -s build --ssl-cert <path-to-cert> --ssl-key <path-to-key>
```

### Option 3: Use localhost
The app works on `localhost` even with HTTP:
```bash
npm start
# Access at http://localhost:3000
```

## Deployment Steps

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `build` folder
3. Your app will be available at `https://your-app.netlify.app`

### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. Deploy to GitHub Pages
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Troubleshooting

### Error: "Can't enumerate devices, method not supported"
- **Cause**: App is running on HTTP instead of HTTPS
- **Solution**: Deploy with HTTPS or use localhost

### Error: "Permission denied"
- **Cause**: User hasn't granted camera permission
- **Solution**: Click "Allow" when browser asks for camera permission

### Error: "No camera found"
- **Cause**: No camera device detected
- **Solution**: Ensure camera is connected and working

## Server Configuration

If deploying to your own server, ensure:
1. **SSL Certificate**: Use Let's Encrypt or commercial SSL
2. **HTTPS Redirect**: Redirect all HTTP traffic to HTTPS
3. **Camera Permissions**: Serve with proper security headers

### Apache .htaccess
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Testing Checklist

Before deployment, test:
- [ ] Camera permission granted
- [ ] QR codes scan correctly
- [ ] All three fields work (packet_id, start_sequence, end_sequence)
- [ ] Submit button works
- [ ] Error messages display properly
- [ ] Mobile responsiveness

## Browser Compatibility

Supported browsers:
- ✅ Chrome 53+
- ✅ Firefox 36+
- ✅ Safari 11+
- ✅ Edge 79+
- ❌ Internet Explorer (not supported)

## Need Help?

Common issues and solutions:
1. **HTTPS not working**: Contact your hosting provider
2. **Camera not detected**: Try different browser or device
3. **Permission denied**: Clear browser data and try again
4. **Build fails**: Check Node.js version compatibility

For more help, check the browser console for detailed error messages.