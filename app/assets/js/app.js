/* global posenet */ // to mute eslint warnings

import { loadVideo } from './video.js';
import { drawVideo, drawKeypoints } from './draw.js';

const videoWidth = 800;
const videoHeight = 650;

// ResNet (larger, slower, more accurate)
const resNetConfig = {
  architecture: 'ResNet50',
  outputStride: 32,
  inputResolution: 257,
  quantBytes: 2
};

// MobileNet (smaller, faster, less accurate)
const mobileNetConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  inputResolution: 513,
  multiplier: 0.75
};

// Important to purge variables and free up GPU memory
// net.dispose();
posenet.load(mobileNetConfig).then(netLoadedForVideo);

async function netLoadedForVideo(net) {
  let video;
  try {
    video = await loadVideo('video', videoWidth, videoHeight);
  } catch (e) {
    console.log("No video");
    throw e;
  }
  detectPoseInRealTime(video, net);
}

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  async function poseDetectionFrame() {
    const minPoseConfidence = 0.4;
    const minPartConfidence = 0.6;

    // since images are being fed from a webcam, we want to feed in the
    // original image and then just flip the keypoints' x coordinates. If instead
    // we flip the image, then correcting left-right keypoint pairs requires a
    // permutation on all the keypoints.
    const flipPoseHorizontal = true;

    const poses = await net.estimatePoses(video, {
      flipHorizontal: flipPoseHorizontal,
      decodingMethod: 'single-person'
    });

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    drawVideo(ctx, video, videoWidth, videoHeight)

    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        drawKeypoints(keypoints, minPartConfidence, ctx);
      }
    });

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}