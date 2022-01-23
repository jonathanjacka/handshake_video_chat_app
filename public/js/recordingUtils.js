import * as store from './store.js';
import * as webRTCHandler from './webRTCHandler.js';

let mediaRecorder;

const vp9Codec = 'video/webm; codecs=vp9';
const vp9Options = { mimeType: vp9Codec };
const recordedChucks = [];

export const startRecording = () => {
  const remoteStream = store.getState().remoteStream;

  if (MediaRecorder.isTypeSupported(vp9Codec)) {
    mediaRecorder = new MediaRecorder(remoteStream, vp9Options);
  } else {
    mediaRecorder = new MediaRecorder(remoteStream);
  }

  webRTCHandler.sendRecordingMessage(true);

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
};

export const pauseRecording = () => mediaRecorder.pause();
export const resumeRecording = () => mediaRecorder.resume();
export const stopRecording = () => {
  mediaRecorder.stop();
  webRTCHandler.sendRecordingMessage(false);
};

export const togglePeerRecordingMessage = (isRecording) => {
  const recordingMsg = document.getElementById('peer_recording_message');
  isRecording
    ? recordingMsg.classList.remove('display_none')
    : recordingMsg.classList.add('display_none');
};

const downloadRecordedVideo = () => {
  const blob = new Blob(recordedChucks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none;';
  a.href = url;
  a.download = 'recording.webm';
  a.click();
  window.URL.revokeObjectURL(url);
};

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChucks.push(event.data);
    downloadRecordedVideo();
  }
};
