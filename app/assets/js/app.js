/* global posenet */ // to mute eslint warnings

import { loadVideo } from './video.js';
import { drawPoses } from './draw.js';
import { showMsg, hideMsg } from './msg.js';
import { isWristTooClose } from './pose.js';
import { config, mobileNetConfig } from './config.js';
// import { storeJson, getJson } from './storage.js';

window.config = config;

const beep = new Audio('assets/beep-07.mp3');

async function startRecognition() {
  let video;
  try {
    video = await loadVideo('video', config.videoWidth, config.videoHeight);
  } catch (e) {
    showMsg("Couldn't load video, please try a different browser");
    throw e;
  }
  let net;
  try {
    net = await posenet.load(mobileNetConfig);
  } catch (e) {
    showMsg("Couldn't load posenet, please try refreshing the page");
    throw e;
  }
  detectPoseInRealTime(video, net);
}

startRecognition();

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');
  canvas.width = config.videoWidth;
  canvas.height = config.videoHeight;

  async function poseDetectionFrame() {
    // net.dispose(); // Important to purge variables and free up GPU memory

    // since images are being fed from a webcam, we want to feed in the
    // original image and then just flip the keypoints' x coordinates. If instead
    // we flip the image, then correcting left-right keypoint pairs requires a
    // permutation on all the keypoints.
    const flipPoseHorizontal = true;

    const poses = await net.estimatePoses(video, {
      flipHorizontal: flipPoseHorizontal,
      decodingMethod: 'single-person'
    });

    const currentPose = poses[0];

    if (currentPose.score >= config.minPoseConfidence) {
      if (isWristTooClose(currentPose, config.minPartConfidence, config.distanceDelta)) {
        if (config.playSound) {
          hideMsg();
          beep.play();
        }
      }
    }

    // only running pose detection in every few seconds to save CPU
    setTimeout(function(){ requestAnimationFrame(poseDetectionFrame); }, config.detectionDelayMs);

    if (config.debugMode) {
      drawPoses(ctx, poses, config);
    }
  }

  poseDetectionFrame();
}

document.getElementById('mute').onclick = function() {
  toggleAudio();
}

document.onkeypress = function (e) {
    e = e || window.event;
    if (e.keyCode == 77 || e.keyCode == 109) { // pressed M or m
      toggleAudio();
    }
};

function toggleAudio() {
  let muteBtn = document.getElementById('mute');
  if (config.playSound) {
    config.playSound = false;
    muteBtn.innerHTML = "🔇";
  } else {
    config.playSound = true;
    muteBtn.innerHTML = "🔉";
  }
}
