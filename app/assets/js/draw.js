
export { drawPoses, drawHistory };

function drawPoses(ctx, poses, config) {
  let videoWidth = config.videoWidth;
  let videoHeight = config.videoHeight;
  ctx.clearRect(0, 0, videoWidth, videoHeight);

  poses.forEach(({score, keypoints}) => drawPose(ctx, score, keypoints, config, "#ff2626", false));
}

function drawPose(ctx, score, keypoints, config, color, showDistance = true) {
  if (score >= config.minPoseConfidence) {
    drawKeypoints(keypoints, config, ctx, color, showDistance);
  }
}

function drawKeypoints(keypoints, config, ctx, color, showDistance, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < config.minPartConfidence) {
      continue;
    }

    const {y, x} = keypoint.position;
    const text = '';
    // const text = keypoint.part + ' ' + keypoint.score.toFixed(4) + ' x: ' + x.toFixed(2) + ' y: ' + y.toFixed(2);
    if (showDistance) {
      drawDistance(ctx, y * scale, x * scale, config.distanceDelta, color);
    } else {
      drawPoint(ctx, y * scale, x * scale, 3, color, text);
    }
  }
}

function drawDistance(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawPoint(ctx, y, x, r, color, text) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fillText(text, x + 5, y);
  ctx.fill();
}

const debugCanvas = document.getElementById('debugcanvas');
const debugCtx = debugCanvas.getContext('2d');
let radius = 100;
debugCanvas.width = 2*radius;
debugCanvas.height = 2*radius;
let drawIndex = 0;

function drawHistory(poseHistory, historySize) {
  if (poseHistory.length != 0) {
    let sliceSize = 2 * Math.PI / historySize;
    let lastPose = poseHistory[poseHistory.length - 1];
    debugCtx.beginPath();
    debugCtx.moveTo(radius, radius);
    if (lastPose == "CORRECT") {
      debugCtx.fillStyle = 'green';
    } else if (lastPose == "INCORRECT") {
      debugCtx.fillStyle = 'red';
    } else {
      debugCtx.fillStyle = 'yellow';
    }
    debugCtx.arc(radius, radius, radius, drawIndex * sliceSize, (drawIndex+1) * sliceSize);
    debugCtx.fill();
    drawIndex = (drawIndex + 1) % historySize;
  }
}
