/* global posenet */ // to mute eslint warnings
/* global Promise */ // to mute eslint warnings

const videoWidth = 800;
const videoHeight = 650;

      //Load the model
posenet.load(
// {
//   architecture: 'MobileNetV1',
//   outputStride: 16,
//   inputResolution: 513,
//   multiplier: 0.75
// }
{
  architecture: 'ResNet50',
  outputStride: 32,
  inputResolution: 257,
  quantBytes: 2
}
).then(netLoadedForVideo);

async function netLoadedForVideo(net) {
  async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video = document.getElementById('video');
    video.width = videoWidth;
    video.height = videoHeight;

    function isAndroid() {
      return /Android/i.test(navigator.userAgent);
    }

    function isiOS() {
      return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    function isMobile() {
      return isAndroid() || isiOS();
    }

    const mobile = isMobile();
    const stream = await navigator.mediaDevices.getUserMedia({
    'audio': false,
    'video': {
        facingMode: 'user',
        width: mobile ? undefined : videoWidth,
        height: mobile ? undefined : videoHeight
      }
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }

  async function loadVideo() {
    const video = await setupCamera();
    video.play();

    return video;
  }


  let video;
  try {
    video = await loadVideo();
  } catch (e) {
    console.log("No video");
    throw e;
  }
  detectPoseInRealTime(video, net);
}

      // MobileNet (smaller, faster, less accurate)
// const net = await posenet.load({
//   architecture: 'MobileNetV1',
//   outputStride: 16,
//   inputResolution: 513,
//   multiplier: 0.75
// });

// ResNet (larger, slower, more accurate) **new!**
// const net = await posenet.load({
//   architecture: 'ResNet50',
//   outputStride: 32,
//   inputResolution: 257,
//   quantBytes: 2
// });

      // Important to purge variables and free up GPU memory
      // guiState.net.dispose();




/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  poseDetectionFrame(video, net, ctx);
}

async function poseDetectionFrame(video, net, ctx) {
  let poses = [];
  let minPoseConfidence;
  let minPartConfidence;

  // since images are being fed from a webcam, we want to feed in the
  // original image and then just flip the keypoints' x coordinates. If instead
  // we flip the image, then correcting left-right keypoint pairs requires a
  // permutation on all the keypoints.
  const flipPoseHorizontal = true;

  const pose = await net.estimatePoses(video, {
    flipHorizontal: flipPoseHorizontal,
    decodingMethod: 'single-person'
  });

  if ( Math.floor((Math.random() * 100) + 1) == 60 ) {
    console.log(pose);
  }
  poses = poses.concat(pose);
  minPoseConfidence = 0.4;
  minPartConfidence = 0.6;

  ctx.clearRect(0, 0, videoWidth, videoHeight);

  // if (guiState.output.showVideo) {
  ctx.save();
  ctx.scale(-1, 1);
  ctx.translate(-videoWidth, 0);
  ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
  ctx.restore();
  // }

  // For each pose (i.e. person) detected in an image, loop through the poses
  // and draw the resulting skeleton and keypoints if over certain confidence
  // scores
  poses.forEach(({score, keypoints}) => {
    if (score >= minPoseConfidence) {
      // if (guiState.output.showPoints) {
        drawKeypoints(keypoints, minPartConfidence, ctx);
      // }
      // if (guiState.output.showSkeleton) {
      //   drawSkeleton(keypoints, minPartConfidence, ctx);
      // }
      // if (guiState.output.showBoundingBox) {
      //   drawBoundingBox(keypoints, ctx);
      // }
    }
  });

  requestAnimationFrame(poseDetectionFrame(video, net, ctx));
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const {y, x} = keypoint.position;
    const color = "#ff2626";
    drawPoint(ctx, y * scale, x * scale, 3, color, keypoint.part + ' ' + keypoint.score.toFixed(4));
  }
}

function drawPoint(ctx, y, x, r, color, text) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;

  ctx.fillText(text, x + 5, y);

  ctx.fill();
}