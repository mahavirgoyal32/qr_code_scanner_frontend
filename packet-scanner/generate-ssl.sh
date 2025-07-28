#!/bin/bash

echo "🔒 Generating Self-Signed SSL Certificates for Local Development"
echo "=============================================================="

# Create ssl directory if it doesn't exist
mkdir -p ssl

# Generate private key
openssl genrsa -out ssl/private.key 2048

# Generate certificate signing request
openssl req -new -key ssl/private.key -out ssl/certificate.csr -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Generate self-signed certificate
openssl x509 -req -in ssl/certificate.csr -signkey ssl/private.key -out ssl/certificate.crt -days 365

# Set proper permissions
chmod 600 ssl/private.key
chmod 644 ssl/certificate.crt

echo "✅ SSL certificates generated successfully!"
echo "📁 Files created:"
echo "   - ssl/private.key (Private Key)"
echo "   - ssl/certificate.crt (Certificate)"
echo ""
echo "⚠️  Note: These are self-signed certificates for development only."
echo "   Your browser will show a security warning - click 'Advanced' and 'Proceed to localhost'."
echo ""
echo "🚀 You can now run: npm run pm2:start"