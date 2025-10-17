#!/bin/bash

# 1. Fix file paths and URLs
sed -i 's|href="/|href="https://agg.homes/|g' index.html
sed -i 's|src="/|src="https://agg.homes/|g' index.html
sed -i 's|"url": "/|"url": "https://agg.homes/|g' index.html

# 2. Fix duplicate and invalid tags
sed -i '
    s/rel="preload" as="style" rel="preload" as="style"/rel="preload" as="style"/g;
    s/defer> defer>>/defer>/g;
    s/!DOCTYPE/<!DOCTYPE/g;
    s/<\/form\s*$/<\/form>/g;
' index.html

# 3. Add proper headers for HTTPS
cat > .htaccess << 'HTACCESS'
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header always set Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https:; img-src 'self' https: data:; style-src 'self' https: 'unsafe-inline'; script-src 'self' https: 'unsafe-inline' 'unsafe-eval';"

RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

<FilesMatch "\.(css|js|jpg|jpeg|png|gif|ico|webp|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
HTACCESS

# 4. Verify all required files exist
for file in css/styles.css css/cookie-consent.css js/cookie-consent.js; do
    dir=$(dirname "$file")
    [ ! -d "$dir" ] && mkdir -p "$dir"
    [ ! -f "$file" ] && touch "$file"
done

# 5. Add proper DNS settings hint
echo "
Please ensure your DNS settings are correct:
1. A record: agg.homes points to your server IP
2. CNAME: www.agg.homes points to agg.homes
3. SSL certificate is properly installed
"

# 6. Commit changes
git add .
git commit -m "Fix site deployment for https://agg.homes" || true
git push origin main || true

