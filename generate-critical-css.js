const critical = require('critical');
const fs = require('fs');
const path = require('path');

async function generateCriticalCSS() {
  try {
    // Generate critical CSS for main page
    await critical.generate({
      base: './',
      src: 'index.html',
      dest: 'css/critical.css',
      inline: false,
      minify: true,
      dimensions: [
        { width: 375, height: 667 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ],
      ignore: ['@font-face', /url\(/],
    });

    console.log('✅ Critical CSS generated successfully');

    // Generate for other pages
    const pages = [
      'property-matching.html',
      'admin-login.html',
      'admin-dashboard.html',
      'en/index.html',
      'es/index.html',
      'nl/index.html'
    ];

    for (const page of pages) {
      if (fs.existsSync(page)) {
        const outputFile = `css/critical-${path.basename(page, '.html')}.css`;
        await critical.generate({
          base: './',
          src: page,
          dest: outputFile,
          inline: false,
          minify: true,
          dimensions: [{ width: 1920, height: 1080 }],
          ignore: ['@font-face', /url\(/],
        });
        console.log(`✅ Critical CSS generated for ${page}`);
      }
    }

  } catch (error) {
    console.error('❌ Error generating critical CSS:', error);
  }
}

generateCriticalCSS();