/* global Promise */ // to mute eslint warnings

export { loadVideo };

async function loadVideo(videoId, videoWidth, videoHeight) {
  const video = await setupCamera(videoId, videoWidth, videoHeight);
  video.play();

  return video;
}

async function setupCamera(videoId, videoWidth, videoHeight) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
  }

  const video = document.getElementById(videoId);
  video.width = videoWidth;
  video.height = videoHeight;

  const stream = await navigator.mediaDevices.getUserMedia({
  'audio': false,
  'video': {
      facingMode: 'user'
    }
  });
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}
