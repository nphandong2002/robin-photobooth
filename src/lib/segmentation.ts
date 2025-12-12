/* eslint-disable @typescript-eslint/no-explicit-any */
// Chỉ load Mediapipe 1 lần duy nhất
import selfSeg from "@mediapipe/selfie_segmentation";

let selfieSegInstance: any = null;

export function getSelfieSeg() {
  if (!selfieSegInstance) {
    selfieSegInstance = new selfSeg.SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
    });
    selfieSegInstance.setOptions({ modelSelection: 1 });
  }
  return selfieSegInstance;
}
