import React, { createContext, useCallback, useContext, useRef } from 'react';
import { Video, Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

type VideoPlayerContextType = {
  playVideo: (video: Video | null) => Promise<void>;
  pauseAllMedia: () => Promise<void>;
  notifyAudioPlaying: (sound: Audio.Sound) => Promise<void>;
  releaseAudio: (sound: Audio.Sound) => void;
  releaseVideo: (video: Video | null) => void;
};

const VideoPlayerContext = createContext<VideoPlayerContextType>({
  playVideo: async () => {},
  pauseAllMedia: async () => {},
  notifyAudioPlaying: async () => {},
  releaseAudio: () => {},
  releaseVideo: () => {},
});

const pauseSoundIfLoaded = async (sound: Audio.Sound) => {
  try {
    const st = await sound.getStatusAsync();
    if (st.isLoaded) await sound.pauseAsync();
  } catch {
    /* ignore */
  }
};

const PLAYBACK_AUDIO_MODE_COOLDOWN_MS = 4000;

export const VideoPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const currentVideoRef = useRef<Video | null>(null);
  const currentSoundRef = useRef<Audio.Sound | null>(null);
  const lastPlaybackAudioModeAt = useRef(0);

  const releaseVideo = useCallback((video: Video | null) => {
    if (video && currentVideoRef.current === video) currentVideoRef.current = null;
  }, []);

  const releaseAudio = useCallback((sound: Audio.Sound) => {
    if (currentSoundRef.current === sound) currentSoundRef.current = null;
  }, []);

  const pauseAllMedia = useCallback(async () => {
    const v = currentVideoRef.current;
    if (v) {
      try {
        await v.pauseAsync();
      } catch {
        /* ignore */
      }
      currentVideoRef.current = null;
    }
    const s = currentSoundRef.current;
    if (s) {
      await pauseSoundIfLoaded(s);
      currentSoundRef.current = null;
    }
  }, []);

  const notifyAudioPlaying = useCallback(async (sound: Audio.Sound) => {
    const v = currentVideoRef.current;
    if (v) {
      try {
        await v.pauseAsync();
      } catch {
        /* ignore */
      }
      currentVideoRef.current = null;
    }
    const prev = currentSoundRef.current;
    if (prev && prev !== sound) await pauseSoundIfLoaded(prev);
    currentSoundRef.current = sound;
  }, []);

  const playVideo = useCallback(async (video: Video | null) => {
    if (!video) return;
    const s = currentSoundRef.current;
    if (s) {
      await pauseSoundIfLoaded(s);
      currentSoundRef.current = null;
    }
    const prev = currentVideoRef.current;
    if (prev && prev !== video) {
      try {
        await prev.pauseAsync();
      } catch {
        /* ignore */
      }
    }
    try {
      const now = Date.now();
      if (now - lastPlaybackAudioModeAt.current >= PLAYBACK_AUDIO_MODE_COOLDOWN_MS) {
        lastPlaybackAudioModeAt.current = now;
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
      }
      await video.setVolumeAsync(1);
      await video.setIsMutedAsync(false);
    } catch {
      /* ignore */
    }
    currentVideoRef.current = video;
  }, []);

  return (
    <VideoPlayerContext.Provider
      value={{ playVideo, pauseAllMedia, notifyAudioPlaying, releaseAudio, releaseVideo }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => useContext(VideoPlayerContext);
