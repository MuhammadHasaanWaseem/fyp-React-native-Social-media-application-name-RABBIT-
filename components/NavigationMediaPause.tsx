import { useEffect, useRef } from 'react';
import { useSegments } from 'expo-router';
import { useVideoPlayer } from '@/providers/VideoPlayerProvider';

/** Pauses in-app video/audio when the route (tabs/stack segments) changes. */
export function NavigationMediaPause() {
  const segments = useSegments();
  const routeKey = segments.join('/');
  const { pauseAllMedia } = useVideoPlayer();
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    void pauseAllMedia();
  }, [routeKey, pauseAllMedia]);

  return null;
}
