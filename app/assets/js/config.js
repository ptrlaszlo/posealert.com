export { config, mobileNetConfig };

let config = {
  debugMode: true, // draw on canvas if true
  saveNextPose: false, // save the next pose as a correct one
  playSound: true, // play sound for incorrect pose if true
  correctPose: undefined,
  detectionDelayMs: 2000, // how often should posenet run
  historySize: 10, // size of the pose history queue
  distanceDelta: 15, // the maximum allowed distance from correct pose
  minPoseConfidence: 0.3,
  minPartConfidence: 0.6,
  videoWidth: 800,
  videoHeight: 650
}

// ResNet (larger, slower, more accurate)
// const resNetConfig = {
//   architecture: 'ResNet50',
//   outputStride: 32,
//   inputResolution: 257,
//   quantBytes: 2
// };

// MobileNet (smaller, faster, less accurate)
const mobileNetConfig = {
  architecture: 'MobileNetV1',
  outputStride: 16,
  inputResolution: 513,
  multiplier: 0.75
};
