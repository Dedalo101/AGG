#!/bin/bash
set -euo pipefail

# 1. Clean unnecessary files
find . -name "*.log" -type f -delete
find . -name "*.map" -type f -delete
find . -name ".DS_Store" -type f -delete

# 2. Optimize images
apt-get update && apt-get install -y imagemagick webp
find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -exec sh -c '
    convert "$1" -strip -quality 85 -resize "2000>" "$1"
    cwebp -q 85 "$1" -o "${1%.*}.webp"
' sh {} \;

# 3. Minify CSS
npm install -g clean-css-cli
find . -name "*.css" ! -name "*.min.css" -type f -exec sh -c '
    cleancss -o "${1%.css}.min.css" "$1"
    mv "${1%.css}.min.css" "$1"
' sh {} \;

# 4. Minify JavaScript
npm install -g terser
find . -name "*.js" ! -name "*.min.js" -type f -exec sh -c '
    terser "$1" --compress --mangle --output "$1"
' sh {} \;

# 5. Create optimized .htaccess
cat << 'HTACCESS' > .htaccess
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    
    <FilesMatch "\.(css|js)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    <FilesMatch "\.(jpg|jpeg|png|gif|webp|ico|svg)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css application/javascript text/javascript
</IfModule>

<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
HTACCESS

# 6. Update HTML with optimizations
sed -i '
    /<link/ s/\.css"/\.css" rel="preload" as="style"/g;
    /<script/ s/\.js"/\.js" defer>/g;
    /<img/ s/\.jpg"/\.webp" loading="lazy"/g;
    /<img/ s/\.png"/\.webp" loading="lazy"/g;
    /<head>/a \    <meta name="description" content="Find your dream home with our expert real estate services. Get personalized property recommendations and market insights.">\
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\
    <link rel="preconnect" href="https://images.unsplash.com">' index.html

# 7. Create preload list for critical assets
cat << 'PRELOAD' > preload.txt
<link rel="preload" href="css/styles.css" as="style">
<link rel="preload" href="js/main.js" as="script">
<link rel="preload" href="images/hero.webp" as="image" type="image/webp">
PRELOAD

# 8. Insert preload directives
sed -i "/<head>/r preload.txt" index.html
rm preload.txt

