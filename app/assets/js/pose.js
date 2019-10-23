export { isPoseCorrect };

function isPoseCorrect(currentPose, correctPose, minPartConfidence, distanceDelta) {
  return compare(nose, currentPose, correctPose, minPartConfidence, distanceDelta) &&
    compare(leftEye, currentPose, correctPose, minPartConfidence, distanceDelta) &&
    compare(rightEye, currentPose, correctPose, minPartConfidence, distanceDelta) &&
    compare(leftEar, currentPose, correctPose, minPartConfidence, distanceDelta) &&
    compare(rightEar, currentPose, correctPose, minPartConfidence, distanceDelta) &&
    compare(leftShoulder, currentPose, correctPose, minPartConfidence, distanceDelta) &&
    compare(rightShoulder, currentPose, correctPose, minPartConfidence, distanceDelta);
}

function compare(partName, currentPose, correctPose, minPartConfidence, distanceDelta) {
  let currentPart = find(currentPose, partName, minPartConfidence);
  let correctPart = find(correctPose, partName, minPartConfidence);
  if (currentPart !== undefined && correctPart !== undefined) {
    if (Math.abs(currentPart.position.x - correctPart.position.x) >= distanceDelta) {
      return false;
    }
    if (Math.abs(currentPart.position.y - correctPart.position.y) >= distanceDelta) {
      return false;
    }
  }
  return true;
}

function find(pose, partName, minPartConfidence) {
  return pose.keypoints.find(({ part, score }) => part === partName && score >= minPartConfidence);
}

const nose = "nose";
const leftEye = "leftEye";
const rightEye = "rightEye";
const leftEar = "leftEar";
const rightEar = "rightEar";
const leftShoulder = "leftShoulder";
const rightShoulder = "rightShoulder";
// const leftElbow = "leftElbow";
// const rightElbow = "rightElbow";
// const leftWrist = "leftWrist";
// const rightWrist = "rightWrist";
// const leftHip = "leftHip";
// const rightHip = "rightHip";
// const leftKnee = "leftKnee";
// const rightKnee = "rightKnee";
// const leftAnkle = "leftAnkle";
// const rightAnkle = "rightAnkle";
