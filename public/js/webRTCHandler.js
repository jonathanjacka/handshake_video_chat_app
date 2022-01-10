import * as store from './store.js';
import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';

let connectedUserDetails;
let peerConnection;

const defaultContraints = {
  audio: true,
  video: true,
};

const configuration = {
  iceServer: [
    {
      urls: 'stun:stun.1.google.com:13092',
    },
  ],
};

export const getLocalPreview = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(defaultContraints);
    ui.updateLocalVideo(stream);
    store.setLocalStream(stream);
  } catch (error) {
    console.error(
      `An error occured while trying to access camera or video: ${error}`
    );
  }
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);
  peerConnection.onicecandidate = (event) => {
    console.log('Getting ice candidates from stun server');
    if (event.candidate) {
      //send our ice candidates to peer
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate,
      });
    }
  };

  peerConnection.onconnectionstatechange = (event) => {
    if (peerConnection.connectionState === 'connected') {
      console.log('Successfully connected to peer');
    }
  };

  //receiving remote tracks for streaming
  const remoteStream = new MediaStream();
  store.setRemoteStream(remoteStream);
  ui.updateRemoteVideo(remoteStream);

  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  //add our tracks to stream
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    const localStream = store.getState().localStream;
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

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
  createPeerConnection();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
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
    if (!(preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED)) {
      ui.showInfoDialogue(preOfferAnswer);
    } else {
      ui.showCallElements(connectedUserDetails.callType);
      createPeerConnection();
      sendWebRTCOffer();
    }
  }
};

const sendWebRTCOffer = async () => {
  console.log('Sending webRTC offer');
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer,
  });
};

export const handleWebRTCOffer = async (data) => {
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.ANSWER,
    answer: answer,
  });
};

export const handleWebRTCAnswer = async (data) => {
  console.log('Handling web RTC answer!');
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async (data) => {
  console.log('handling webRTC candidates');
  try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (error) {
    console.error('Error with adding ICE candidate: ', error);
  }
};
