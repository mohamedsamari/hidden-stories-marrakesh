import { createClient, SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'story-images';

// Créé au premier usage réel plutôt qu'au chargement du module, pour ne pas
// dépendre de l'ordre d'exécution de dotenv.config() vs des imports (les
// imports sont hoistés par TypeScript, donc lire process.env au niveau module
// s'exécute avant tout dotenv.config() écrit plus bas dans le script appelant).
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error(
        'SUPABASE_URL et SUPABASE_SERVICE_KEY doivent être définis (vérifie que dotenv.config() a bien été appelé avant).'
      );
    }
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  }
  return client;
}

export async function uploadImageToSupabase(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const { error } = await getSupabase()
    .storage.from(BUCKET)
    .upload(fileName, fileBuffer, {
      contentType,
      upsert: true, // écrase si le fichier existe déjà (utile pour la migration)
    });

  if (error) {
    throw new Error(`Échec de l'upload vers Supabase Storage: ${error.message}`);
  }

  const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}