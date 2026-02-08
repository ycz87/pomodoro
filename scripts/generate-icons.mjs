/**
 * Generate all app icons from logo-source.png
 * Uses sharp for PNG resizing and ICO generation
 */
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'logo-source.png');

async function generatePng(outputPath, size) {
  await sharp(SOURCE)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outputPath);
  console.log(`  ✓ ${outputPath} (${size}x${size})`);
}

/**
 * Generate ICO file containing multiple sizes
 * ICO format: header + directory entries + image data (PNG encoded)
 */
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = dirEntrySize * count;
  let dataOffset = headerSize + dirSize;

  // ICO header: reserved(2) + type(2) + count(2)
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);     // reserved
  header.writeUInt16LE(1, 2);     // type: 1 = ICO
  header.writeUInt16LE(count, 4); // image count

  const dirEntries = [];
  const sizes = [16, 32, 48, 256];

  for (let i = 0; i < count; i++) {
    const entry = Buffer.alloc(dirEntrySize);
    const size = sizes[i];
    entry.writeUInt8(size < 256 ? size : 0, 0);  // width (0 = 256)
    entry.writeUInt8(size < 256 ? size : 0, 1);  // height
    entry.writeUInt8(0, 2);                        // color palette
    entry.writeUInt8(0, 3);                        // reserved
    entry.writeUInt16LE(1, 4);                     // color planes
    entry.writeUInt16LE(32, 6);                    // bits per pixel
    entry.writeUInt32LE(pngBuffers[i].length, 8);  // image size
    entry.writeUInt32LE(dataOffset, 12);           // data offset
    dirEntries.push(entry);
    dataOffset += pngBuffers[i].length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function main() {
  console.log('Generating icons from logo-source.png...\n');

  // Ensure directories exist
  mkdirSync(join(ROOT, 'public'), { recursive: true });
  mkdirSync(join(ROOT, 'src-tauri', 'icons'), { recursive: true });

  // 1. Favicons (public/)
  console.log('Favicons:');
  await generatePng(join(ROOT, 'public', 'favicon-16x16.png'), 16);
  await generatePng(join(ROOT, 'public', 'favicon-32x32.png'), 32);
  await generatePng(join(ROOT, 'public', 'favicon-48x48.png'), 48);

  // 2. PWA icons (public/)
  console.log('\nPWA icons:');
  await generatePng(join(ROOT, 'public', 'icon-192.png'), 192);
  await generatePng(join(ROOT, 'public', 'icon-512.png'), 512);

  // 3. Apple touch icon (public/)
  console.log('\nApple touch icon:');
  await generatePng(join(ROOT, 'public', 'apple-touch-icon.png'), 180);

  // 4. Tauri icons (src-tauri/icons/)
  console.log('\nTauri icons:');
  await generatePng(join(ROOT, 'src-tauri', 'icons', '32x32.png'), 32);
  await generatePng(join(ROOT, 'src-tauri', 'icons', '128x128.png'), 128);
  await generatePng(join(ROOT, 'src-tauri', 'icons', '128x128@2x.png'), 256);
  await generatePng(join(ROOT, 'src-tauri', 'icons', 'icon.png'), 512);

  // 5. ICO file (multi-size: 16, 32, 48, 256)
  console.log('\nICO file:');
  const icoSizes = [16, 32, 48, 256];
  const pngBuffers = await Promise.all(
    icoSizes.map((size) =>
      sharp(SOURCE)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );
  const icoBuffer = createIco(pngBuffers);
  writeFileSync(join(ROOT, 'src-tauri', 'icons', 'icon.ico'), icoBuffer);
  console.log(`  ✓ src-tauri/icons/icon.ico (16+32+48+256)`);

  // Also put favicon.ico in public/
  writeFileSync(join(ROOT, 'public', 'favicon.ico'), icoBuffer);
  console.log(`  ✓ public/favicon.ico (16+32+48+256)`);

  console.log('\n✅ All icons generated!');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
