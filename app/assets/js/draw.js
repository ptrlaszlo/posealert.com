
export { drawPoses };

function drawPoses(ctx, poses, config) {
  let videoWidth = config.videoWidth;
  let videoHeight = config.videoHeight;
  let correctPose = config.correctPose;
  ctx.clearRect(0, 0, videoWidth, videoHeight);

  poses.forEach(({score, keypoints}) => drawPose(ctx, score, keypoints, config, "#ff2626"));

  if (correctPose !== undefined) {
    drawPose(ctx, correctPose.score, correctPose.keypoints, config, "#26ff26", true);
  }
}

function drawPose(ctx, score, keypoints, config, color, showDistance = false) {
  if (score >= config.minPoseConfidence) {
    drawKeypoints(keypoints, config.minPartConfidence, ctx, color, showDistance, config.distanceDelta);
  }
}

function drawKeypoints(keypoints, minConfidence, ctx, color, showDistance, distanceDelta, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const {y, x} = keypoint.position;
    const text = keypoint.part + ' ' + keypoint.score.toFixed(4) + ' x: ' + x.toFixed(2) + ' y: ' + y.toFixed(2);
    if (showDistance) {
      drawDistance(ctx, y * scale, x * scale, distanceDelta, color);
    } else {
      drawPoint(ctx, y * scale, x * scale, 3, color, text);
    }
  }
}

function drawDistance(ctx, y, x, r, color) {
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawPoint(ctx, y, x, r, color, text) {
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  // ctx.fillText(text, x + 5, y);
  ctx.fill();
}
