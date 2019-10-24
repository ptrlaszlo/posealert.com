/* global posenet */ // to mute eslint warnings

import { loadVideo } from './video.js';
import { drawPoses } from './draw.js';
import { showMsg, hideMsg } from './msg.js';
import { isPoseCorrect } from './pose.js';
import { config, mobileNetConfig } from './config.js';
// import { storeJson, getJson } from './storage.js';

const beep = new Audio('assets/beep-07.mp3');
window.config = config;

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

    if (config.saveNextPose && currentPose.score >= config.minPoseConfidence) {
      config.correctPose = currentPose;
      config.saveNextPose = false;
    }

    if (config.debugMode) {
      drawPoses(ctx, poses, config);
    }

    if (config.correctPose === undefined) {
      requestAnimationFrame(poseDetectionFrame);
    } else {
      if (currentPose.score >= config.minPoseConfidence) {
        if (!isPoseCorrect(currentPose, config.correctPose, config.minPartConfidence, config.distanceDelta)) {
          if (config.playSound) {
            beep.play();
          }
        }
      }
      // only running pose detection in every two seconds to save CPU
      setTimeout(function(){ requestAnimationFrame(poseDetectionFrame); }, 2000);
    }
  }

  poseDetectionFrame();
}

document.getElementById('calibrate').onclick = function() {
  calibrate();
}

document.getElementById('mute').onclick = function() {
  toggleAudio();
}

document.onkeypress = function (e) {
    e = e || window.event;
    if (e.keyCode == 77 || e.keyCode == 109) { // pressed M or m
      toggleAudio();
    } else if (e.keyCode == 67 || e.keyCode == 99) { // pressed C or c
      calibrate();
    }
};

function calibrate() {
  config.saveNextPose = true;
  hideMsg();
}

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
