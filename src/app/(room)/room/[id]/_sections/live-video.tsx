/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import selfSegfrom from '@mediapipe/selfie_segmentation';
// import cameraUtils from '@mediapipe/camera_utils';
// import {
//   ConnectionState,
//   createLocalVideoTrack,
//   isAudioTrack,
//   isLocalTrack,
//   isVideoTrack,
//   LocalParticipant,
//   LocalTrackPublication,
//   LocalVideoTrack,
//   Participant,
//   ParticipantEvent,
//   RemoteParticipant,
//   RemoteTrack,
//   RemoteTrackPublication,
//   Room,
//   RoomEvent,
//   Track,
// } from 'livekit-client';
// import { useSession } from 'next-auth/react';
// import { ControlBar, GridLayout, ParticipantTile, RoomContext, useTracks } from '@livekit/components-react';

// import '@livekit/components-styles';

// export default function LiveVideo({ roomInfo }: { roomInfo: any }) {

//   const runningRef = useRef(false);
//   const segmentationRef = useRef<any | null>(null);
//   const processedTrackRef = useRef<LocalVideoTrack | null>(null);
//   const animationFrameId = useRef<number | null>(null);

//   const [room] = useState(() => new Room({ adaptiveStream: true, dynacast: true }));
//   const { data: session } = useSession();

//   useEffect(() => {
//     const connectToRoom = async () => {
//       const resp = await fetch(`/api/token?room=${roomInfo.id}&username=${session?.user?.name || 'Guest'}`);
//       const data = await resp.json();

//       if (data.token) await room.connect('wss://robin-photobooth-ovql7xey.livekit.cloud', data.token);
//       room.on(RoomEvent.LocalTrackPublished, (pub) => {
//         const track = pub.track;

//         if (isLocalTrack(track) && isVideoTrack(track)) {
//           create
//         }
//       });
//     };
//     connectToRoom();

//     return () => {};
//   }, [room, session?.user?.name, roomInfo.id]);

//   // useEffect(() => {
//   //   const video = videoElementRef.current!;
//   //   const canvas = canvasRef.current!;
//   //   const ctx = canvas.getContext('2d')!;

//   //   const selfieSeg = new selfSeg.SelfieSegmentation({
//   //     locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
//   //   });

//   //   selfieSeg.setOptions({
//   //     modelSelection: 1,
//   //   });

//   //   selfieSeg.onResults((results) => {
//   //     canvas.width = results.image.width;
//   //     canvas.height = results.image.height;

//   //     ctx.save();
//   //     ctx.clearRect(0, 0, canvas.width, canvas.height);

//   //     ctx.drawImage(results.segmentationMask, 0, 0);

//   //     ctx.globalCompositeOperation = 'source-in';
//   //     ctx.drawImage(results.image, 0, 0);

//   //     ctx.restore();
//   //   });

//   //   const camera = new cameraUtils.Camera(video, {
//   //     onFrame: async () => {
//   //       await selfieSeg.send({ image: video });
//   //     },
//   //     width: 640,
//   //     height: 480,
//   //   });

//   //   camera.start();

//   //   return () => {
//   //     camera.stop();
//   //   };
//   // }, []);

//   return (
//     <RoomContext.Provider value={room}>
//       <video ref={videoElementRef} playsInline />
//       <canvas ref={canvasRef} />
//       <ControlBar />
//     </RoomContext.Provider>
//   );

// 'use client';
// import {
//   ControlBar,
//   GridLayout,
//   ParticipantTile,
//   RoomAudioRenderer,
//   useTracks,
//   RoomContext,
//   useEnsureTrackRef,
// } from '@livekit/components-react';
// import { isLocalTrack, isVideoTrack, Room, RoomEvent, Track } from 'livekit-client';
// import '@livekit/components-styles';
// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { BackgroundProcessor } from '@livekit/track-processors';
// export default function LiveVideo({ room }: { room: any }) {
//   const [roomInstance] = useState(() => new Room({ adaptiveStream: true, dynacast: true }));
//   const { data: session } = useSession();
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       try {
//         const resp = await fetch(`/api/token?room=${room.id}&username=${session?.user?.name || 'Guest'}`);
//         const data = await resp.json();
//         if (!mounted) return;
//         if (data.token) await roomInstance.connect('wss://robin-photobooth-ovql7xey.livekit.cloud', data.token);
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//     return () => {
//       mounted = false;
//       roomInstance.disconnect();
//     };
// }, [roomInstance]);

//   useEffect(() => {
//       roomInstance.on(RoomEvent.LocalTrackPublished, (pub) => {
//         const track = pub.track;

//         if (isLocalTrack(track) && isVideoTrack(track)) {
//           track.detach()
//         }
//       });
//       roomInstance.on(RoomEvent.LocalTrackUnpublished, (pup) => {

//       })
//   }, [roomInstance]);
//   return (
//     <RoomContext.Provider value={roomInstance}>
//       <div data-lk-theme="default" style={{ height: '100dvh' }}>
//         <MyVideoConference /> <RoomAudioRenderer /> <ControlBar />
//       </div>
//     </RoomContext.Provider>
//   );
// }
// function MyVideoConference() {
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Camera, withPlaceholder: true },
//       { source: Track.Source.ScreenShare, withPlaceholder: false },
//     ],
//     { onlySubscribed: false },
//   );
//   return (
//     <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
//       <ParticipantTile />
//     </GridLayout>
//   );
// }

'use client';
import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
  useEnsureTrackRef,
} from '@livekit/components-react';
import { isLocalTrack, isVideoTrack, LocalTrack, Room, RoomEvent, Track } from 'livekit-client';
import '@livekit/components-styles';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function LiveVideo({ room }: { room: any }) {
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [roomInstance] = useState(() => new Room({ adaptiveStream: true, dynacast: true }));

  const [track, settrack] = useState<LocalTrack | undefined>();
  const { data: session } = useSession();
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch(`/api/token?room=${room.id}&username=${session?.user?.name || 'Guest'}`);
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
    console.log(track);
  }, [track]);
  return (
    <RoomContext.Provider value={roomInstance}>
      <div data-lk-theme="default" style={{ height: '100dvh' }}>
        <video ref={videoElementRef} playsInline autoPlay muted={true} />
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
