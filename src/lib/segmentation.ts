import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';

export async function useSegmentation(videoRef: HTMLVideoElement) {
  // load model
  const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm');

  const segmenter = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite',
    },
    outputCategoryMask: true,
    runningMode: 'VIDEO',
  });

  // canvas output
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const loop = async () => {
    const w = videoRef.videoWidth || 640;
    const h = videoRef.videoHeight || 480;

    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;

    try {
      const result = await segmenter.segmentForVideo(videoRef, Date.now());
      const mask = (result as any).categoryMask;

      ctx.clearRect(0, 0, w, h);

      if (mask) ctx.drawImage(mask, 0, 0, w, h);

      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(videoRef, 0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    } catch {}

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
  return canvas;
}
