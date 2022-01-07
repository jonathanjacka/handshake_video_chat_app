import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';

let connectedUserDetails;

export const sendPreOffer = (callType, caller2PersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: caller2PersonalCode,
  };

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callType,
      caller2PersonalCode,
    };

    ui.showCallingDialogue(callType, callingDialogueRejectHandler);
    wss.sendPreOffer(data);
  } else {
    console.error('error in webRTCHandler.sendPreOffer');
  }
};

export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data;

  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialogue(callType, acceptCallHandler, rejectCallHandler);
  }
};

const acceptCallHandler = () => {
  console.log('Receiver accepted!');
};

const rejectCallHandler = () => {
  console.log('Receiver rejected!');
};

const callingDialogueRejectHandler = () => {
  console.log('Caller cancelled connection!');
};
