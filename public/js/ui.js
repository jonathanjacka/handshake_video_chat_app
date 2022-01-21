import * as constants from './constants.js';
import * as elements from './elements.js';

export const updatePersonalCode = (personalCode) => {
  const personalCodeParagraph = document.getElementById(
    'personal_code_paragraph'
  );
  personalCodeParagraph.innerHTML = personalCode;
};

//Event for personal code copy button
export const copyPersonalCode = (store) => {
  const personalCodeCopyButton = document.getElementById(
    'personal_code_copy_button'
  );

  personalCodeCopyButton.addEventListener('click', () => {
    personalCodeCopyButton.innerHTML = '<i class="fas fa-check"></i>';
    personalCodeCopyButton.style.background = '#8bf79d';

    const personalCode = store.getState().socketId;
    navigator.clipboard && navigator.clipboard.writeText(personalCode);

    setTimeout(() => {
      personalCodeCopyButton.innerHTML = '<i class="far fa-copy"></i>';
      personalCodeCopyButton.style.background = '#757ae2';
    }, 1500);
  });
};

export const uncheckStrangerConnectForStart = () => {
  const checkbox = document.getElementById('allow_strangers_checkbox_input');
  checkbox.checked = false;
  toggleStrangerConnectionBtns(false);
};

export const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById('local_video');
  localVideo.srcObject = stream;

  localVideo.addEventListener('loadeddata', () => localVideo.play());
};

export const updateRemoteVideo = (stream) => {
  const remoteVideo = document.getElementById('remote_video');
  remoteVideo.srcObject = stream;
};

export const showIncomingCallDialogue = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.CHAT_STRANGER
      ? 'Chat'
      : 'Video';

  const incomingCallDialogue = elements.getIncomingCallDialogue(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );

  removeAllDialogues();
  dialogue.appendChild(incomingCallDialogue);
  //play incoming sound
};

export const showCallingDialogue = (callType, callingDialogueRejectHandler) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.CHAT_STRANGER
      ? 'Chat'
      : 'Video';

  const connectingDialogue = elements.getOutgoingConnectionDialogue(
    callTypeInfo,
    callingDialogueRejectHandler
  );

  removeAllDialogues();
  dialogue.appendChild(connectingDialogue);
  //play incoming sound
};

export const noStrangerAvailableDialogue = () => {
  const infoDialogue = elements.getInfoDialogue(
    'Connection rejected',
    'There are no strangers available to connect with you!'
  );
  dialogue.appendChild(infoDialogue);
};

export const showInfoDialogue = (preOfferAnswer) => {
  let infoDialogue = null;

  if (preOfferAnswer === constants.preOfferAnswer.RECEIVER_NOT_FOUND) {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      'Receiver was not found - check your personal codes are correct'
    );
  } else if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      'Receiver rejected your connection'
    );
  } else if (preOfferAnswer === constants.preOfferAnswer.RECEIVER_NO_VIDEO) {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      "There was an error with the receiver's video - try to chat instead"
    );
  } else {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      'Receiver is unavailable or busy'
    );
  }

  dialogue.appendChild(infoDialogue);
};

export const showCallElements = (callType) => {
  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.CHAT_STRANGER
  ) {
    showChatCallElements();
  } else if (
    callType === constants.callType.VIDEO_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    showVideoCallElements();
  }
};

const showChatCallElements = () => {
  const finishConnectionChatButtonContainer = document.getElementById(
    'finish_chat_button_container'
  );
  showElement(finishConnectionChatButtonContainer);

  const newMessageInput = document.getElementById('new_message');
  showElement(newMessageInput);

  disableDashboard();
};

const showVideoCallElements = () => {
  const callButtons = document.getElementById('call_buttons');
  showElement(callButtons);

  const localVideo = document.getElementById('local_video');
  showElement(localVideo);

  const videoPlaceholder = document.getElementById('video_placeholder');
  hideElement(videoPlaceholder);

  const remoteVideo = document.getElementById('remote_video');
  showElement(remoteVideo);

  const newMessageInput = document.getElementById('new_message');
  showElement(newMessageInput);

  disableDashboard();
};

//ui video call buttons
export const updateMicButton = (micActive) => {
  const micOn = '<i class="fas fa-microphone fa-2x" id="mic_button_image"></i>';
  const micOff =
    '<i class="fas fa-microphone-slash fa-2x" id="mic_button_image" style="color: #ee5d94;"></i>';
  const micButton = document.getElementById('mic_button');
  micButton.innerHTML = micActive ? micOn : micOff;
};

export const updateCameraButton = (cameraActive) => {
  const camOn = '<i class="fas fa-video fa-2x" id="camera_button_image"></i>';
  const camOff =
    '<i class="fas fa-video-slash fa-2x" id="camera_button_image" style="color: #ee5d94;"></i>';
  const cameraButton = document.getElementById('camera_button');
  cameraButton.innerHTML = cameraActive ? camOn : camOff;
};

export const updateScreenShareButton = (screenSharingActive) => {
  const screenShareButton = document.getElementById('screen_sharing_button');
  screenShareButton.style.color = screenSharingActive ? '#fff' : '#89E0AF';
};

export const disableVideoCallButton = () => {
  const videoBtn = document.getElementById('personal_code_video_button');
  const strangerVideoBtn = document.getElementById('stranger_video_button');
  videoBtn.disabled = true;
  strangerVideoBtn.disabled = true;
  videoBtn.style.opacity = 0.5;
  strangerVideoBtn.style.opacity = 0.5;
};

export const enableVideoCallButton = () => {
  const videoBtn = document.getElementById('personal_code_video_button');
  const strangerVideoBtn = document.getElementById('stranger_video_button');
  videoBtn.disabled = false;
  strangerVideoBtn.disabled = false;
  videoBtn.style.opacity = 1;
  strangerVideoBtn.style.opacity = 1;
};

export const toggleStrangerConnectionBtns = (checkboxState) => {
  const strangerVideoBtn = document.getElementById('stranger_video_button');
  const strangerChatBtn = document.getElementById('stranger_chat_button');

  strangerChatBtn.disabled = !checkboxState;
  strangerVideoBtn.disabled = !checkboxState;
  strangerChatBtn.style.cursor = !checkboxState ? 'not-allowed' : 'pointer';
  strangerVideoBtn.style.cursor = !checkboxState ? 'not-allowed' : 'pointer';
  strangerChatBtn.style.opacity = !checkboxState ? 0.5 : 1;
  strangerVideoBtn.style.opacity = !checkboxState ? 0.5 : 1;
};

//ui messages
export const appendMessage = (message, messageRight = false) => {
  const messagesContainer = document.getElementById('messages_container');
  const messageElement = messageRight
    ? elements.getRightMessage(message)
    : elements.getLeftMessage(message);
  messagesContainer.appendChild(messageElement);
};

export const clearMessenger = () => {
  const messagesContainer = document.getElementById('messages_container');
  messagesContainer
    .querySelectorAll('*')
    .forEach((message) => message.remove());
};

//recording
export const showRecordingPanel = () => {
  const recordingButtons = document.getElementById('video_recording_buttons');
  showElement(recordingButtons);

  //hide recording btn if active
  const startRecordingBtn = document.getElementById('start_recording_button');
  hideElement(startRecordingBtn);
};

export const resetRecordingBtns = () => {
  const recordingButtons = document.getElementById('video_recording_buttons');
  const startRecordingBtn = document.getElementById('start_recording_button');
  hideElement(recordingButtons);
  showElement(startRecordingBtn);
};

export const switchRecordingBtns = (switcForResumeBtn = false) => {
  const resumeBtn = document.getElementById('resume_recording_button');
  const pauseBtn = document.getElementById('pause_recording_button');

  if (switcForResumeBtn) {
    hideElement(pauseBtn);
    showElement(resumeBtn);
  } else {
    hideElement(resumeBtn);
    showElement(pauseBtn);
  }
};

//ui after hangup
export const updateUIAfterDisconnect = (callType) => {
  if (
    callType === constants.callType.VIDEO_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    const callBtns = document.getElementById('call_buttons');
    hideElement(callBtns);
  } else {
    const chatBtn = document.getElementById('finish_chat_button_container');
    hideElement(chatBtn);
  }

  const messageInput = document.getElementById('new_message');
  hideElement(messageInput);

  clearMessenger();
  updateMicButton(true);
  updateCameraButton(true);

  const localVideo = document.getElementById('local_video');
  hideElement(localVideo);

  const remoteVideo = document.getElementById('remote_video');
  hideElement(remoteVideo);

  const videoPlaceholder = document.getElementById('video_placeholder');
  showElement(videoPlaceholder);

  removeAllDialogues();

  enableDashboard();

  //play hang up sound
  playDisconnectSound();
};

//ui helper functions

export const removeAllDialogues = () => {
  const dialogue = document.getElementById('dialogue');
  dialogue.querySelectorAll('*').forEach((child) => child.remove());
};

const enableDashboard = () => {
  const dashboardBlocker = document.getElementById('dashboard_blur');
  !dashboardBlocker.classList.contains('display_none') &&
    dashboardBlocker.classList.add('display_none');
};

const disableDashboard = () => {
  const dashboardBlocker = document.getElementById('dashboard_blur');
  dashboardBlocker.classList.contains('display_none') &&
    dashboardBlocker.classList.remove('display_none');
};

export const hideElement = (element) => {
  !element.classList.contains('display_none') &&
    element.classList.add('display_none');
};

const showElement = (element) => {
  element.classList.contains('display_none') &&
    element.classList.remove('display_none');
};

//sounds
const playConnectSound = () => {
  const connectSound = document.getElementById('audio-disconnect');
  connectSound.play();
};

const playDisconnectSound = () => {
  stopAllSounds();
  const disconnectSound = document.getElementById('audio-disconnect');
  disconnectSound.play();
  //setTimeout(stopAllSounds, disconnectSound.duration);
};

const stopAllSounds = () => {
  const sounds = document.querySelectorAll('audio');
  sounds.forEach((sound) => sound.pause());
};
