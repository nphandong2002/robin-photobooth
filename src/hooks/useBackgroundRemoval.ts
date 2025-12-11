'use client';

import { useEffect, useRef } from 'react';
import { BackgroundProcessor } from '@livekit/track-processors';

export function useBackgroundRemoval(videoTrack: any, enabled: boolean) {
  const processorRef = useRef<any>(null);

  useEffect(() => {
    if (!videoTrack || !videoTrack.setProcessor) {
      return;
    }

    (async () => {
      try {
        if (enabled) {
          if (!processorRef.current) {
            // Initialize BackgroundProcessor with options
            processorRef.current = new (BackgroundProcessor as any)({
              model: 'TensorFlow',
              blurStrength: 0, // No blur on background
              delegate: 'GPU', // Use GPU if available, fallback to CPU
            });
          }
          await videoTrack.setProcessor(processorRef.current);
        } else {
          await videoTrack.setProcessor(undefined);
          if (processorRef.current) {
            processorRef.current.dispose?.();
            processorRef.current = null;
          }
        }
      } catch (error) {
        console.error('Background removal error:', error);
      }
    })();

    return () => {
      if (processorRef.current && !enabled) {
        processorRef.current.dispose?.();
        processorRef.current = null;
      }
    };
  }, [videoTrack, enabled]);

  return { processorRef };
}
