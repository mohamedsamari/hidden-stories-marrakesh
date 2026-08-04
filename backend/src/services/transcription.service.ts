import Groq, { toFile } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = 'whisper-large-v3-turbo';

// Guides Whisper toward the local proper nouns it otherwise mishears (e.g. "Jemaa el-Fna" -> "jamelle 2").
const VOCABULARY_PROMPT =
  'Marrakech, Jemaa el-Fna, Koutoubia, Bahia, Badiî, Saadiens, Ben Youssef, Ménara, Majorelle, médina, souk.';

export async function transcribeAudio(
  buffer: Buffer,
  filename: string,
  mimetype: string,
): Promise<string> {
  const file = await toFile(buffer, filename, { type: mimetype });
  const transcription = await groq.audio.transcriptions.create({
    model: MODEL,
    file,
    language: 'fr',
    prompt: VOCABULARY_PROMPT,
  });
  return transcription.text.trim();
}
