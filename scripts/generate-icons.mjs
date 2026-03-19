import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input =
  process.argv[2] ||
  'C:\\\\Users\\\\safuvan.ks\\\\.cursor\\\\projects\\\\d-to-do-app\\\\assets\\\\c__Users_safuvan.ks_AppData_Roaming_Cursor_User_workspaceStorage_836c50b7cae88296f1b2a1ee1f36d44a_images_logo-c0c42802-c6aa-48e2-9a7b-fa7e226d081c.png';

const outDir = path.resolve(__dirname, '..', 'public', 'icons');

await fs.mkdir(outDir, { recursive: true });

const sizes = [
  { size: 192, name: 'app-icon-192.png' },
  { size: 512, name: 'app-icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32.png' },
];

for (const { size, name } of sizes) {
  const outPath = path.join(outDir, name);
  await sharp(input)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

console.log(`Generated icons in: ${outDir}`);

