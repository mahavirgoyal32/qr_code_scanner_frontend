# 🚀 QR Code Scanner - Quick Start with PM2

## ✅ **Your App is NOW RUNNING!**

**Access URLs:**
- **HTTPS (Camera works)**: https://localhost:3443
- **HTTP (Redirects to HTTPS)**: http://localhost:3000

## 📋 **Quick Commands**

| Command | What it does |
|---------|--------------|
| `npm run pm2:start` | Start the app |
| `npm run pm2:stop` | Stop the app |
| `npm run pm2:restart` | Restart the app |
| `npm run pm2:logs` | View logs |
| `npm run pm2:monit` | Monitor performance |
| `pm2 list` | Show all processes |

## 🔒 **SSL Certificate Note**

Your app uses self-signed SSL certificates for HTTPS. When you first visit https://localhost:3443:

1. Browser will show "Not Secure" warning
2. Click **"Advanced"**
3. Click **"Proceed to localhost (unsafe)"**
4. Camera access will now work! ✅

## 🎯 **How to Use the Scanner**

1. Open https://localhost:3443
2. Select field to scan (Packet ID, Start Sequence, End Sequence)
3. Point camera at QR code
4. Submit when all three are scanned

## 🛑 **Stop/Start Commands**

```bash
# Stop the app
npm run pm2:stop

# Start the app
npm run pm2:start

# Restart the app
npm run pm2:restart

# View real-time logs
npm run pm2:logs
```

## 🌐 **Production Deployment**

For production with real SSL certificate:

1. Get SSL certificate (Let's Encrypt recommended)
2. Update `ecosystem.config.js` paths
3. Run: `npm run production:start`

## 📁 **Important Files**

- `server.js` - Express server with HTTPS
- `ecosystem.config.js` - PM2 configuration
- `ssl/` - SSL certificates directory
- `build/` - React production build
- `logs/` - Application logs

## 🔧 **Troubleshooting**

**Port already in use?**
```bash
lsof -i :3443
sudo kill -9 <PID>
```

**Camera not working?**
- Must use HTTPS: https://localhost:3443
- Allow camera permissions in browser

**PM2 commands not working?**
```bash
npm install -g pm2
```

## 📊 **Monitor Your App**

```bash
# Real-time monitoring
pm2 monit

# Process information
pm2 show qr-scanner-frontend

# Save PM2 process for auto-restart
pm2 save
pm2 startup
```

🎉 **Your QR Code Scanner is ready for production!**