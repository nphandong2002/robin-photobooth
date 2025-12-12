/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  RoomContext,
  useTracks,
} from '@livekit/components-react';
import { isLocalTrack, isVideoTrack, LocalTrack, Room, RoomEvent, Track } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import selfSeg from '@mediapipe/selfie_segmentation';
import cameraUtils from '@mediapipe/camera_utils';

import '@livekit/components-styles';
import { getSelfieSeg } from 'src/lib/segmentation';

function RoomDetail() {
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [roomInstance] = useState(() => new Room({ adaptiveStream: true, dynacast: true }));

  const [track, settrack] = useState<LocalTrack | undefined>();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${132}&username=${Math.random() * 12000}`);
        const data = await resp.json();
        if (!mounted) return;
        if (data.token) await roomInstance.connect('wss://robin-photobooth-ovql7xey.livekit.cloud', data.token);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      mounted = false;
      roomInstance.disconnect();
    };
  }, [roomInstance]);
  useEffect(() => {
    roomInstance.on(RoomEvent.LocalTrackPublished, (pub) => {
      if (isLocalTrack(pub.track) && isVideoTrack(pub.track)) {
        settrack(pub.track);
      }
    });
  }, [roomInstance, settrack]);

  useEffect(() => {
    if (!track) return;
    const video = track.attachedElements[0] as HTMLVideoElement;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const selfieSeg = getSelfieSeg();
    const running = true;
    selfieSeg.setOptions({
      modelSelection: 1,
    });

    selfieSeg.onResults((results: any) => {
      canvas.width = results.image.width;
      canvas.height = results.image.height;
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.segmentationMask, 0, 0);
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(results.image, 0, 0);
      ctx.restore();
    });
    video.onloadedmetadata = function () {
      let time = video.currentTime;
      const loop = async function () {
        if (!running) return;
        if (!video.paused || video.currentTime === time) {
          time = video.currentTime;
          await selfieSeg.send({ image: video });
          requestAnimationFrame(loop);
        }
      };
      window.requestAnimationFrame(function () {
        loop();
      });
    };

    return () => {};
  }, [track]);

  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: '100dvh' }}>
        <canvas ref={canvasRef} />
        <ControlBar />
        <MyVideoConference /> <RoomAudioRenderer /> <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}
function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      <ParticipantTile />
    </GridLayout>
  );
}
export default RoomDetail;
