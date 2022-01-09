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
    callType === constants.callType.CHAT_PERSONAL_CODE ? 'Chat' : 'Video';

  const incomingCallDialogue = elements.getIncomingCallDialogue(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );

  removeAllDialogues();
  dialogue.appendChild(incomingCallDialogue);
};

export const showCallingDialogue = (callType, callingDialogueRejectHandler) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? 'Chat' : 'Video';

  const connectingDialogue = elements.getOutgoingConnectionDialogue(
    callTypeInfo,
    callingDialogueRejectHandler
  );

  removeAllDialogues();
  dialogue.appendChild(connectingDialogue);
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
  } else if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      'Receiver is unavailable or busy'
    );
  } else {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      'There was an error in attempting to connect'
    );
  }
  dialogue.appendChild(infoDialogue);
};

export const showCallElements = (callType) => {
  if (callType === constants.callType.CHAT_PERSONAL_CODE) {
    showChatCallElements();
  } else if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
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

  const videoPlaceholder = document.getElementById('video_placeholder');
  hideElement(videoPlaceholder);

  const remoteVideo = document.getElementById('remote_video');
  showElement(remoteVideo);

  const newMessageInput = document.getElementById('new_message');
  showElement(newMessageInput);

  disableDashboard();
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

const hideElement = (element) => {
  !element.classList.contains('display_none') &&
    element.classList.add('display_none');
};

const showElement = (element) => {
  element.classList.contains('display_none') &&
    element.classList.remove('display_none');
};
