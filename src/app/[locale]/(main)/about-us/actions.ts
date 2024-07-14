'use server';

import textToSpeech from '@google-cloud/text-to-speech';
import { GoogleAuth, grpc } from 'google-gax';
import invariant from 'ts-invariant';

import redisService from '@/services/redis';

function getApiKeyCredentials() {
  invariant(process.env.GOOGLE_API_KEY, 'Missing GOOGLE_API_KEY env variable');

  const sslCreds = grpc.credentials.createSsl();
  const googleAuth = new GoogleAuth();
  const authClient = googleAuth.fromAPIKey(process.env.GOOGLE_API_KEY);
  const credentials = grpc.credentials.combineChannelCredentials(
    sslCreds,
    grpc.credentials.createFromGoogleCredential(authClient)
  );
  return credentials;
}

export async function getSpeech() {
  const cache = await redisService.getOcelleTextToSpeech();
  if (cache) {
    return cache;
  }

  const client = new textToSpeech.TextToSpeechClient({
    sslCreds: getApiKeyCredentials(),
  });

  const [response] = await client.synthesizeSpeech({
    input: { text: 'ocelle' },
    voice: { languageCode: 'en-GB', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  });

  if (!response.audioContent || typeof response.audioContent === 'string') {
    throw new Error('failed to request the speech');
  }

  await redisService.setOcelleTextToSpeech(response.audioContent);

  return response.audioContent;
}
