const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// CORS middleware for API calls
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Check if SSL certificates exist
const sslKeyPath = process.env.SSL_KEY || './ssl/private.key';
const sslCertPath = process.env.SSL_CERT || './ssl/certificate.crt';

const hasSSL = fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath);

if (hasSSL) {
  // HTTPS Server (required for camera access)
  const privateKey = fs.readFileSync(sslKeyPath, 'utf8');
  const certificate = fs.readFileSync(sslCertPath, 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(HTTPS_PORT, () => {
    console.log(`🚀 HTTPS Server running on port ${HTTPS_PORT}`);
    console.log(`🌐 Access your app at: https://localhost:${HTTPS_PORT}`);
  });

  // HTTP to HTTPS redirect
  const httpApp = express();
  httpApp.all('*', (req, res) => {
    res.redirect(`https://${req.headers.host.split(':')[0]}:${HTTPS_PORT}${req.url}`);
  });
  
  httpApp.listen(PORT, () => {
    console.log(`🔀 HTTP Redirect server running on port ${PORT} (redirects to HTTPS)`);
  });

} else {
  // HTTP Server (for localhost development only)
  console.warn('⚠️  SSL certificates not found. Running HTTP server for development.');
  console.warn('⚠️  Camera access may not work without HTTPS in production!');
  
  app.listen(PORT, () => {
    console.log(`🚀 HTTP Server running on port ${PORT}`);
    console.log(`🌐 Access your app at: http://localhost:${PORT}`);
    console.log('📝 For production with camera access, please configure HTTPS certificates.');
  });
}