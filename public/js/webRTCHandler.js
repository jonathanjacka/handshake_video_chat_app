import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';

let connectedUserDetails;

export const sendPreOffer = (callType, receiverPersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: receiverPersonalCode,
  };

  console.log(connectedUserDetails);
  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const data = {
      callType,
      receiverPersonalCode,
    };

    ui.showCallingDialogue(callType, callingDialogueRejectHandler);
    wss.sendPreOffer(data);
  } else {
    console.error('error in webRTCHandler.sendPreOffer');
  }
};

export const handlePreOffer = (data) => {
  console.log('PreOffer Data: ', data);
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
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
};

const rejectCallHandler = () => {
  console.log('Receiver rejected!');
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const callingDialogueRejectHandler = () => {
  console.log('Caller cancelled connection!');
};

const sendPreOfferAnswer = (preOfferAnswer) => {
  const data = {
    callerSocketId: connectedUserDetails.socketId,
    preOfferAnswer,
  };
  ui.removeAllDialogues();
  wss.sendPreOfferAnswer(data);
};

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;
  console.log('PreOffer Answer handled: ', preOfferAnswer);

  ui.removeAllDialogues();

  if (!preOfferAnswer) {
    console.error(`Preoffer answer error: ${preOfferAnswer}`);
  } else {
    preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED
      ? console.log('show dialogue that caller 2 accepts - send webRTC Offer')
      : ui.showInfoDialogue(preOfferAnswer);
  }
};
