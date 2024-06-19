'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { getSpeech } from './actions';

import Sound from '@/components/icons/Sound';

export default function PlayerButton() {
  const audioRef = React.useRef<HTMLAudioElement>();
  const [playable, setPlayable] = React.useState(false);
  const {
    data: buffer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ocelle-audio'],
    queryFn: () => getSpeech(),
  });

  const playSound = React.useCallback(() => {
    if (playable && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [playable]);

  React.useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    if (isLoading) {
      return;
    }
    if (isError || !buffer) {
      console.error('audio fetch failed');
      return;
    }
    const bufferData = new Uint8Array(buffer);
    const blob = new Blob([bufferData], { type: 'audio/mp3' });
    const objectURL = URL.createObjectURL(blob);
    audioRef.current.src = objectURL;
    setPlayable(true);
  }, [isError, isLoading, buffer]);

  return (
    <button className="-mt-2 ml-2 inline-block" onClick={playSound}>
      <Sound className=" w-[.8em]" />
    </button>
  );
}
