module.exports = {
  apps: [
    {
      name: 'qr-scanner-frontend',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HTTPS_PORT: 3443,
        SSL_KEY: './ssl/private.key',
        SSL_CERT: './ssl/certificate.crt'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        HTTPS_PORT: 3443
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 80,
        HTTPS_PORT: 443,
        SSL_KEY: '/etc/ssl/private/your-domain.key',
        SSL_CERT: '/etc/ssl/certs/your-domain.crt'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};