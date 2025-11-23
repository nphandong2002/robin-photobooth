'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  useLocalParticipant,
} from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BackgroundProcessor } from '@livekit/track-processors';
import { getBackgroundRemovedStream } from 'src/lib/backgroundRemoval';

export default function LiveVideo({ room }: { room: any }) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const outCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    (async () => {
      function loop() {
        const now = performance.now();

        const result: ImageSegmenterResult = segmenter.segmentForVideo(video, now);

        if (result.categoryMask) {
          segmentPersonToCanvas(result.categoryMask, video, outCanvas);
        }

        requestAnimationFrame(loop);
      }
      if (outCanvas.current && videoRef.current) {
        let video = videoRef.current;
        let ctx = outCanvas.current?.getContext('2d');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          loop();
        };
      }
    })();
  }, []);
  return (
    <div>
      <canvas ref={outCanvas} />
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }} />
    </div>
  );
}
