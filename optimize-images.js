const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  const inputDir = 'images';
  const outputDir = 'images/optimized';

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const files = await imagemin([`${inputDir}/**/*.{jpg,jpeg,png,gif,svg}`], {
      destination: outputDir,
      plugins: [
        imageminMozjpeg({
          quality: 80,
          progressive: true
        }),
        imageminPngquant({
          quality: [0.6, 0.8],
          speed: 1
        }),
        imageminGifsicle({
          optimizationLevel: 2
        }),
        imageminSvgo({
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                  addAttributesToSVGElement: {
                    attributes: [
                      { 'aria-hidden': 'true' },
                      { focusable: 'false' }
                    ]
                  }
                }
              }
            }
          ]
        })
      ]
    });

    console.log(`✅ Optimized ${files.length} images`);

    // Generate WebP versions for better performance
    const webpFiles = await imagemin([`${inputDir}/**/*.{jpg,jpeg,png}`], {
      destination: outputDir,
      plugins: [
        imageminWebp({
          quality: 80,
          method: 6
        })
      ]
    });

    console.log(`✅ Generated ${webpFiles.length} WebP images`);

    // Create a mapping file for WebP fallbacks
    const imageMap = {};
    files.forEach(file => {
      const relativePath = path.relative(outputDir, file.destinationPath);
      const webpPath = relativePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      if (fs.existsSync(path.join(outputDir, webpPath))) {
        imageMap[relativePath] = webpPath;
      }
    });

    fs.writeFileSync('images/image-map.json', JSON.stringify(imageMap, null, 2));
    console.log('✅ Created image mapping file');

  } catch (error) {
    console.error('❌ Error optimizing images:', error);
  }
}

// Generate responsive image markup
function generateResponsiveImage(src, alt, sizes = '100vw') {
  const baseName = path.basename(src, path.extname(src));
  const dir = path.dirname(src);
  const webpSrc = `${dir}/${baseName}.webp`;
  const fallbackSrc = src;

  return `
    <picture>
      <source srcset="${webpSrc}" type="image/webp">
      <img src="${fallbackSrc}" alt="${alt}" loading="lazy" decoding="async" sizes="${sizes}">
    </picture>
  `;
}

module.exports = { optimizeImages, generateResponsiveImage };

if (require.main === module) {
  optimizeImages();
}