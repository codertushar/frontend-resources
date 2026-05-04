'use client';

import { createContext, useContext, useRef, useState, useEffect, useMemo, ReactNode } from 'react';

// Lofi Hip Hop Radio - 24/7 chill beats for studying (via Zeno.FM)
const LOFI_RADIO_URL = 'https://stream.zeno.fm/0r0xa792kwzuv';

interface MusicContextValue {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  togglePlay: () => Promise<void>;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicContext = createContext<MusicContextValue | null>(null);

interface MusicProviderProps {
  readonly children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element and restore state from localStorage (SSR-safe)
  useEffect(() => {
    setIsMounted(true);

    // Create audio element only once
    if (!audioRef.current) {
      audioRef.current = new Audio(LOFI_RADIO_URL);
      audioRef.current.loop = false;
      audioRef.current.preload = 'none';
    }

    // Restore saved preferences
    const savedVolume = localStorage.getItem('musicVolume');
    const savedMuted = localStorage.getItem('musicMuted');
    const savedPlaying = localStorage.getItem('musicPlaying');

    if (savedVolume) {
      const vol = Number.parseFloat(savedVolume);
      setVolumeState(vol);
      audioRef.current.volume = vol;
    }

    if (savedMuted) {
      const muted = savedMuted === 'true';
      setIsMuted(muted);
      audioRef.current.volume = muted ? 0 : Number.parseFloat(savedVolume || '1');
    }

    // Restore playing state if it was playing before
    if (savedPlaying === 'true') {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Auto-play blocked, reset state
        setIsPlaying(false);
        localStorage.setItem('musicPlaying', 'false');
      });
    }

    // Cleanup on unmount (component will never unmount in practice since it's at root level)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Sync volume changes with audio element
  useEffect(() => {
    if (audioRef.current && isMounted) {
      audioRef.current.volume = isMuted ? 0 : volume;
      localStorage.setItem('musicVolume', volume.toString());
    }
  }, [volume, isMuted, isMounted]);

  // Sync mute state
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('musicMuted', isMuted.toString());
    }
  }, [isMuted, isMounted]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        localStorage.setItem('musicPlaying', 'false');
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        localStorage.setItem('musicPlaying', 'true');
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
      localStorage.setItem('musicPlaying', 'false');
    }
  };

  const handleSetVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const value: MusicContextValue = useMemo(() => ({
    isPlaying,
    volume,
    isMuted,
    togglePlay,
    setVolume: handleSetVolume,
    toggleMute,
    audioRef,
  }), [isPlaying, volume, isMuted, audioRef]);

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusicPlayer() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicProvider');
  }
  return context;
}
