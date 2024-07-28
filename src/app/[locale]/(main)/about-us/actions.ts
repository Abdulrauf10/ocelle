'use server';

import redisService from '@/services/redis';
import speechService from '@/services/speech';

export async function getSpeech() {
  const cache = await redisService.getOcelleTextToSpeech();
  if (cache) {
    return cache;
  }

  const audio = await speechService.getSpeech('ocelle');

  await redisService.setOcelleTextToSpeech(audio);

  return audio;
}
