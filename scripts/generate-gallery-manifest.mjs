import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const photoDirectory = path.join(projectRoot, 'public', 'picture');
const manifestPath = path.join(projectRoot, 'src', 'gallery-photos.js');
const supportedImage = /\.(avif|gif|jpe?g|png|webp)$/i;

const entries = await fs.readdir(photoDirectory, { withFileTypes: true });
const photoFiles = entries
  .filter((entry) => entry.isFile() && supportedImage.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

if (photoFiles.length === 0) {
  throw new Error(`No gallery photos found in ${photoDirectory}`);
}

await fs.writeFile(manifestPath, `export default ${JSON.stringify(photoFiles, null, 2)};\n`);
console.log(`Found ${photoFiles.length} gallery photo(s) in public/picture.`);
