import React, { createContext, useState, useContext } from 'react';
import { Video } from 'expo-av';

type VideoPlayerContextType = {
  currentVideo: Video | null;
  playVideo: (video: Video) => Promise<void>;
};

const VideoPlayerContext = createContext<VideoPlayerContextType>({
  currentVideo: null,
  playVideo: async () => {},
});

export const VideoPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  const playVideo = async (video: Video) => {
    // If another video is already playing, pause it
    if (currentVideo && currentVideo !== video) {
      try {
        await currentVideo.pauseAsync();
      } catch (error) {
        console.error('Error pausing previous video', error);
      }
    }
    // Set the new video as the current one
    setCurrentVideo(video);
  };

  return (
    <VideoPlayerContext.Provider value={{ currentVideo, playVideo }}>
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => useContext(VideoPlayerContext);
