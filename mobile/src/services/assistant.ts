import { API_BASE_URL } from '@/constants/api';
import { RelatedStory } from '@/types/related-story';

export interface AssistantAnswer {
  answer: string;
  relatedStories: RelatedStory[];
}

export async function askAssistant(message: string): Promise<AssistantAnswer> {
  const response = await fetch(`${API_BASE_URL}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get assistant response: ${response.status}`);
  }

  return response.json();
}

export async function transcribeAudio(uri: string): Promise<string> {
  // React Native's FormData accepts a native { uri, name, type } file descriptor,
  // but TypeScript resolves the DOM lib's FormData (needed for react-native-web),
  // whose types only allow a real Blob — cast to match the native runtime behavior.
  const formData = new FormData();
  formData.append('audio', { uri, name: 'recording.m4a', type: 'audio/mp4' } as unknown as Blob);

  const response = await fetch(`${API_BASE_URL}/assistant/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to transcribe audio: ${response.status}`);
  }

  const data: { text: string } = await response.json();
  return data.text;
}
