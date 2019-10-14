
export { drawKeypoints };

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
