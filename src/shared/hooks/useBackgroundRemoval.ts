import { useEffect, useRef, useState, useCallback } from 'react';
import { BackgroundRemovalOptions, getBackgroundRemovedStream } from 'src/lib/backgroundRemoval';

interface UseBackgroundRemovalProps {
  enabled?: boolean;
  options?: BackgroundRemovalOptions;
}

export function useBackgroundRemoval({ enabled = false, options = {} }: UseBackgroundRemovalProps = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const processedStreamRef = useRef<MediaStream | null>(null);

  const removeBackground = useCallback(
    async (stream: MediaStream): Promise<MediaStream | null> => {
      if (!enabled || !stream) {
        return stream;
      }

      try {
        setIsProcessing(true);
        setError(null);

        const processedStream = await getBackgroundRemovedStream(stream, options);
        processedStreamRef.current = processedStream;

        setIsProcessing(false);
        return processedStream;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Background removal failed: ${errorMessage}`);
        setIsProcessing(false);
        return stream;
      }
    },
    [enabled, options],
  );

  const cleanup = useCallback(() => {
    if (processedStreamRef.current) {
      processedStreamRef.current.getTracks().forEach((track) => track.stop());
      processedStreamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    removeBackground,
    isProcessing,
    error,
    cleanup,
  };
}
