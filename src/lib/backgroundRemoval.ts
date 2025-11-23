/**
 * Utility để xoá nền camera sử dụng chroma key (color-based background removal)
 * Không cần package nặng - dùng Canvas API thuần
 */

export interface BackgroundRemovalOptions {
  backgroundColor?: string;
  chromaKeyColor?: string; // Màu nền để xoá (mặc định: xanh lá)
  tolerance?: number; // Độ nhạy (0-255, mặc định: 50)
  blur?: number; // Độ blur nền (0-10)
}

/**
 * Chuyển đổi media stream thành stream với nền bị xoá
 */
export async function getBackgroundRemovedStream(
  stream: MediaStream,
  options: BackgroundRemovalOptions = {},
): Promise<MediaStream> {
  const {
    backgroundColor = 'rgba(0, 0, 0, 0)', // Transparent
    chromaKeyColor = '#00ff00', // Green screen
    tolerance = 50,
    blur = 3,
  } = options;

  // Tạo các canvas element
  const videoElement = document.createElement('video');
  videoElement.srcObject = stream;
  videoElement.play();

  const inputCanvas = document.createElement('canvas');
  const outputCanvas = document.createElement('canvas');
  const maskCanvas = document.createElement('canvas');

  // Chờ video load để lấy dimensions
  await new Promise((resolve) => {
    videoElement.onloadedmetadata = resolve;
  });

  const width = videoElement.videoWidth;
  const height = videoElement.videoHeight;

  inputCanvas.width = width;
  inputCanvas.height = height;
  outputCanvas.width = width;
  outputCanvas.height = height;
  maskCanvas.width = width;
  maskCanvas.height = height;

  const inputCtx = inputCanvas.getContext('2d', { willReadFrequently: true })!;
  const outputCtx = outputCanvas.getContext('2d')!;
  const maskCtx = maskCanvas.getContext('2d')!;

  // Parse chroma key color
  const chromaRGB = hexToRgb(chromaKeyColor);
  if (!chromaRGB) {
    console.error('Invalid chroma key color');
    return stream;
  }

  // Tạo output stream
  const outputStream = outputCanvas.captureStream(30);

  const processFrame = () => {
    // Draw video frame to input canvas
    inputCtx.drawImage(videoElement, 0, 0);

    // Get image data
    const imageData = inputCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Create mask
    const maskImageData = maskCtx.createImageData(width, height);
    const maskData = maskImageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Check if pixel matches chroma key color (with tolerance)
      const diff = Math.abs(r - chromaRGB.r) + Math.abs(g - chromaRGB.g) + Math.abs(b - chromaRGB.b);

      if (diff < tolerance) {
        // Transparent pixel
        data[i + 3] = 0;
      } else {
        // Opaque pixel
        data[i + 3] = a;
      }
    }

    // Draw background
    outputCtx.fillStyle = backgroundColor;
    outputCtx.fillRect(0, 0, width, height);

    // Apply blur if needed
    if (blur > 0) {
      outputCtx.filter = `blur(${blur}px)`;
    }

    // Draw processed image
    outputCtx.putImageData(imageData, 0, 0);

    requestAnimationFrame(processFrame);
  };

  processFrame();

  return outputStream;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Apply green screen effect (Chroma Key) to video element
 */
export async function applyChromaKeyToVideoElement(
  videoElement: HTMLVideoElement,
  canvasElement: HTMLCanvasElement,
  options: BackgroundRemovalOptions = {},
): Promise<void> {
  const { backgroundColor = 'rgba(0, 0, 0, 0)', chromaKeyColor = '#00ff00', tolerance = 50 } = options;

  const ctx = canvasElement.getContext('2d', { willReadFrequently: true })!;

  // Set canvas size
  canvasElement.width = videoElement.videoWidth || 640;
  canvasElement.height = videoElement.videoHeight || 480;

  const chromaRGB = hexToRgb(chromaKeyColor);
  if (!chromaRGB) return;

  const processFrame = () => {
    // Draw video frame
    ctx.drawImage(videoElement, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const data = imageData.data;

    // Process pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Check if pixel matches chroma key
      const diff = Math.abs(r - chromaRGB.r) + Math.abs(g - chromaRGB.g) + Math.abs(b - chromaRGB.b);

      if (diff < tolerance) {
        // Make background transparent
        data[i + 3] = 0;
      }
    }

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Redraw processed image
    ctx.putImageData(imageData, 0, 0);

    requestAnimationFrame(processFrame);
  };

  processFrame();
}
