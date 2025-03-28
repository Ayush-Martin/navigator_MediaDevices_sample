const shareVideoButton = document.getElementById("shareVideo");
const shareScreenButton = document.getElementById("shareScreen");
const startRecordingButton = document.getElementById("startRecording");
const stopRecordingButton = document.getElementById("stopRecording");
const videoOutput = document.getElementById("videoOutput");
const screenShareOutput = document.getElementById("screenShareOutput");
const recordedVideoOutput = document.getElementById("recordedVideoOutput");
const recordedScreenOutput = document.getElementById("recordedScreenOutput");
const playRecordingButton = document.getElementById("playRecording");
const stopShareVideoButton = document.getElementById("stopShareVideo");
const stopShareScreenButton = document.getElementById("stopShareScreen");

let videoStream;
let screenRecordStream;
let videoRecording;
let screenRecording;
let recordedVideoBlobs = [];
let recordedScreenBlobs = [];

shareVideoButton.addEventListener("click", shareVideo);
shareScreenButton.addEventListener("click", shareScreen);
startRecordingButton.addEventListener("click", startRecording);
stopRecordingButton.addEventListener("click", stopRecording);
playRecordingButton.addEventListener("click", playRecording);

async function shareVideo() {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoOutput.srcObject = videoStream;
    videoOutput.play();
  } catch (err) {
    alert("You denied media access");
    console.log("user denied media access", err);
  }
}

async function shareScreen() {
  try {
    screenRecordStream = await navigator.mediaDevices.getDisplayMedia();
    screenShareOutput.srcObject = screenRecordStream;
    screenShareOutput.play();
  } catch (err) {
    alert("You denied screen sharing access");
  }
}

async function startRecording() {
  try {
    if (!videoStream && !screenRecordStream) {
      alert("Please share video or screen first");
      return;
    }

    if (videoStream) {
      recordedVideoBlobs = [];
      videoRecording = new MediaRecorder(videoStream);
      videoRecording.ondataavailable = (e) => recordedVideoBlobs.push(e.data);
      videoRecording.start();
    }

    if (screenRecordStream) {
      recordedScreenBlobs = [];
      screenRecording = new MediaRecorder(screenRecordStream);
      screenRecording.ondataavailable = (e) => recordedScreenBlobs.push(e.data);
      screenRecording.start();
    }
  } catch (err) {
    console.error("Recording failed", err);
  }
}

async function stopRecording() {
  if (!videoRecording && !screenRecording) {
    alert("Please start recording first");
    return;
  }

  // Stop video recording
  if (videoRecording) {
    videoRecording.stop();
    videoRecording.onstop = () => {
      const videoBlob = new Blob(recordedVideoBlobs, { type: "video/webm" });
      const videoURL = URL.createObjectURL(videoBlob);
      recordedVideoOutput.src = videoURL;
      recordedVideoOutput.play(); // Play the video immediately after stopping
    };
  }

  // Stop screen recording
  if (screenRecording) {
    screenRecording.stop();
    screenRecording.onstop = () => {
      const screenBlob = new Blob(recordedScreenBlobs, { type: "video/webm" });
      const screenURL = URL.createObjectURL(screenBlob);
      recordedScreenOutput.src = screenURL;
      recordedScreenOutput.play(); // Play the screen recording immediately after stopping
    };
  }
}

async function playRecording() {
  if (recordedVideoBlobs.length === 0 && recordedScreenBlobs.length === 0) {
    alert("No recordings available to play");
    return;
  }

  if (recordedVideoBlobs.length > 0) {
    const videoBlob = new Blob(recordedVideoBlobs, { type: "video/webm" });
    const videoURL = URL.createObjectURL(videoBlob);
    recordedVideoOutput.src = videoURL;
    recordedVideoOutput.play();
  }

  if (recordedScreenBlobs.length > 0) {
    const screenBlob = new Blob(recordedScreenBlobs, { type: "video/webm" });
    const screenURL = URL.createObjectURL(screenBlob);
    recordedScreenOutput.src = screenURL;
    recordedScreenOutput.play();
  }
}

async function stopShareVideo() {
  try {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      videoOutput.srcObject = null;
    }
  } catch (err) {}
}

async function stopShareScreen(params) {
  try {
    if (screenRecordStream) {
      screenRecordStream.getTracks().forEach((track) => track.stop());
      screenShareOutput.srcObject = null;
    }
  } catch (err) {}
}
