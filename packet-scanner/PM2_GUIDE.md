# PM2 Deployment Guide for QR Code Scanner

## 🚀 Quick Start

### 1. Install PM2 globally
```bash
npm run pm2:install
# or manually: npm install -g pm2
```

### 2. Generate SSL certificates (for HTTPS - required for camera access)
```bash
npm run ssl:generate
```

### 3. Start the application
```bash
npm run pm2:start
```

Your app will be available at:
- **HTTPS**: https://localhost:3443 (Camera access works)
- **HTTP**: http://localhost:3000 (Redirects to HTTPS)

## 📋 Available PM2 Commands

| Command | Description |
|---------|-------------|
| `npm run pm2:start` | Build and start app with PM2 |
| `npm run pm2:stop` | Stop the application |
| `npm run pm2:restart` | Restart the application |
| `npm run pm2:delete` | Delete the PM2 process |
| `npm run pm2:logs` | View application logs |
| `npm run pm2:monit` | Monitor application metrics |
| `npm run production:start` | Start in production mode |

## 🔧 Manual PM2 Commands

```bash
# Start with custom environment
pm2 start ecosystem.config.js --env development
pm2 start ecosystem.config.js --env production

# View all processes
pm2 list

# View logs
pm2 logs qr-scanner-frontend

# Monitor resources
pm2 monit

# Restart process
pm2 restart qr-scanner-frontend

# Stop process
pm2 stop qr-scanner-frontend

# Delete process
pm2 delete qr-scanner-frontend

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

## 🌐 Production Deployment

### Option 1: With Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Update ecosystem.config.js production environment:
env_production: {
  NODE_ENV: 'production',
  PORT: 80,
  HTTPS_PORT: 443,
  SSL_KEY: '/etc/letsencrypt/live/yourdomain.com/privkey.pem',
  SSL_CERT: '/etc/letsencrypt/live/yourdomain.com/fullchain.pem'
}

# Start in production
npm run production:start
```

### Option 2: Behind Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Troubleshooting

### Camera Access Issues
- **Problem**: "Can't enumerate devices"
- **Solution**: Ensure you're accessing via HTTPS, not HTTP

### SSL Certificate Issues
- **Problem**: Browser security warning
- **Solution**: For self-signed certificates, click "Advanced" → "Proceed to localhost"

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3443

# Kill process using port
sudo kill -9 <PID>
```

### View Application Logs
```bash
# Real-time logs
pm2 logs qr-scanner-frontend --lines 100

# Error logs only
pm2 logs qr-scanner-frontend --err

# Output logs only
pm2 logs qr-scanner-frontend --out
```

## 📊 Monitoring

### PM2 Built-in Monitoring
```bash
pm2 monit
```

### Process Information
```bash
pm2 show qr-scanner-frontend
```

### System Startup
```bash
# Save current PM2 processes
pm2 save

# Generate startup script
pm2 startup

# After running the generated command, save again
pm2 save
```

## 🔄 Auto-restart on File Changes (Development)
```bash
pm2 start ecosystem.config.js --watch
```

## 🏠 Environment Variables

You can customize these in `ecosystem.config.js`:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | HTTP port | `3000` |
| `HTTPS_PORT` | HTTPS port | `3443` |
| `SSL_KEY` | Path to SSL private key | `./ssl/private.key` |
| `SSL_CERT` | Path to SSL certificate | `./ssl/certificate.crt` |

## 🎯 Quick Commands Summary

```bash
# One-time setup
npm run pm2:install
npm run ssl:generate

# Daily operations
npm run pm2:start      # Start app
npm run pm2:logs       # View logs
npm run pm2:restart    # Restart app
npm run pm2:stop       # Stop app
```

🚀 Your QR Code Scanner is now ready for production with PM2!