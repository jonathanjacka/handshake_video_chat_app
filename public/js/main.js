import * as store from './store.js';
import * as ui from './ui.js';
import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';
import * as recordingUtils from './recordingUtils.js';

//initialize socket.io connection
wss.registerSocketEvents(socket);

webRTCHandler.getLocalPreview();

//Event for personal code copy button
ui.copyPersonalCode(store);

//register event listeners for connection buttons
const personalCodeChatButton = document.getElementById(
  'personal_code_chat_button'
);
const personalCodeVideoButton = document.getElementById(
  'personal_code_video_button'
);
//Personal Chat
personalCodeChatButton.addEventListener('click', () => {
  const receiverPersonalCode = document.getElementById(
    'personal_code_input'
  ).value;
  const callType = constants.callType.CHAT_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, receiverPersonalCode);
});

//Personal Video
personalCodeVideoButton.addEventListener('click', () => {
  const receiverPersonalCode = document.getElementById(
    'personal_code_input'
  ).value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, receiverPersonalCode);
});

//video call button panel
const micButton = document.getElementById('mic_button');
micButton.addEventListener('click', () => {
  const localStream = store.getState().localStream;
  const micEnabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micEnabled;
  ui.updateMicButton(localStream.getAudioTracks()[0].enabled);
});

const cameraButton = document.getElementById('camera_button');
cameraButton.addEventListener('click', () => {
  const localStream = store.getState().localStream;
  const cameraEnabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !cameraEnabled;
  ui.updateCameraButton(localStream.getVideoTracks()[0].enabled);
});

const screenShareButton = document.getElementById('screen_sharing_button');
screenShareButton.addEventListener('click', () => {
  const screenSharingActive = store.getState().screenSharingActive;
  webRTCHandler.toggleScreenShare(screenSharingActive);
});

//messenger
const newMessageIput = document.getElementById('new_message_input');
newMessageIput.addEventListener('keydown', (event) => {
  console.log('Message updated!');
  const key = event.code;

  if (key === 'Enter') {
    webRTCHandler.sendMessageUsingDataChannel(event.target.value);
    ui.appendMessage(event.target.value, true);
    newMessageIput.value = '';
  }
});

const sendMessageButton = document.getElementById('send_message_button');
sendMessageButton.addEventListener('click', () => {
  const message = newMessageIput.value;
  webRTCHandler.sendMessageUsingDataChannel(message);
  ui.appendMessage(message, true);
  newMessageIput.value = '';
});

//recording
const startRecordingBtn = document.getElementById('start_recording_button');
startRecordingBtn.addEventListener('click', () => {
  recordingUtils.startRecording();
  ui.showRecordingPanel();
});

const stopRecordingBtn = document.getElementById('stop_recording_button');
stopRecordingBtn.addEventListener('click', () => {
  recordingUtils.stopRecording();
  ui.resetRecordingBtns();
});

const pauseRecordingBtn = document.getElementById('pause_recording_button');
pauseRecordingBtn.addEventListener('click', () => {
  recordingUtils.pauseRecording();
  ui.switchRecordingBtns(true);
});

const resumeRecordingBtn = document.getElementById('resume_recording_button');
resumeRecordingBtn.addEventListener('click', () => {
  recordingUtils.resumeRecording();
  ui.switchRecordingBtns(false);
});

//hang up
const hangupCallBtn = document.getElementById('hang_up_button');
hangupCallBtn.addEventListener('click', () => {
  webRTCHandler.handleEndConnection();
});

const endChatBtn = document.getElementById('finish_chat_call_button');
endChatBtn.addEventListener('click', () => {
  webRTCHandler.handleEndConnection();
});
