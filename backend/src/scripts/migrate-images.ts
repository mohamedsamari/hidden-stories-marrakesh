import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { uploadImageToSupabase, getSupabase } from '../lib/storage';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

async function migrate() {
  const files = fs.readdirSync(UPLOADS_DIR);
  console.log(`${files.length} fichiers trouvés dans ${UPLOADS_DIR}`);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const contentType = mimeTypes[ext];
    if (!contentType) {
      console.log(`Ignoré (extension non gérée): ${file}`);
      continue;
    }

    const buffer = fs.readFileSync(path.join(UPLOADS_DIR, file));
    const url = await uploadImageToSupabase(buffer, file, contentType);
    console.log(`OK: ${file} -> ${url}`);
  }

  const { data } = getSupabase().storage.from('story-images').getPublicUrl('');
  console.log('\nBase URL du bucket:', data.publicUrl);
  console.log('\nMigration terminée.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Erreur pendant la migration:', err);
  process.exit(1);
});