export { isWristTooClose };

function isWristTooClose(currentPose, minPartConfidence, distanceDelta) {
  return compareWristDistance(leftWrist, nose, currentPose, minPartConfidence, distanceDelta) ||
    compareWristDistance(rightWrist, nose, currentPose, minPartConfidence, distanceDelta) ||
    compareWristDistance(leftWrist, leftEye, currentPose, minPartConfidence, distanceDelta) ||
    compareWristDistance(rightWrist, leftEye, currentPose, minPartConfidence, distanceDelta) ||
    compareWristDistance(leftWrist, rightEye, currentPose, minPartConfidence, distanceDelta) ||
    compareWristDistance(rightWrist, rightEye, currentPose, minPartConfidence, distanceDelta);
}

function compareWristDistance(wrist, part, currentPose, minPartConfidence, distanceDelta) {
  let partPos = find(currentPose, part, minPartConfidence);
  let wristPos = find(currentPose, wrist, minPartConfidence);
  if (partPos !== undefined && wristPos !== undefined) {
    if (Math.abs(partPos.position.x - wristPos.position.x) >= distanceDelta) {
      return false;
    }
    if (Math.abs(partPos.position.y - wristPos.position.y) >= distanceDelta) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

function find(pose, partName, minPartConfidence) {
  return pose.keypoints.find(({ part, score }) => part === partName && score >= minPartConfidence);
}

const nose = "nose";
const leftEye = "leftEye";
const rightEye = "rightEye";
// const leftEar = "leftEar";
// const rightEar = "rightEar";
// const leftShoulder = "leftShoulder";
// const rightShoulder = "rightShoulder";
const leftWrist = "leftWrist";
const rightWrist = "rightWrist";
// const leftElbow = "leftElbow";
// const rightElbow = "rightElbow";
// const leftHip = "leftHip";
// const rightHip = "rightHip";
// const leftKnee = "leftKnee";
// const rightKnee = "rightKnee";
// const leftAnkle = "leftAnkle";
// const rightAnkle = "rightAnkle";
