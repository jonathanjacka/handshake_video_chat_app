import * as store from './store.js';
import * as wss from './wss.js';
import * as constants from './constants.js';
import * as ui from './ui.js';

let connectedUserDetails;
let peerConnection;
let dataChannel;

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
    store.setCallState(constants.callState.CALL_AVAILABLE);
    store.setLocalStream(stream);

    store.setCameraAvailable(true);
  } catch (error) {
    console.error(
      `An error occured while trying to access camera or video: ${error}`
    );
    store.setCameraAvailable(false);
  }
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  dataChannel = peerConnection.createDataChannel('chat');
  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel;
    dataChannel.onopen = () =>
      (dataChannel.onmessage = (event) => {
        const message = JSON.parse(event.data);
        ui.appendMessage(message, false);
      });
  };

  peerConnection.onicecandidate = (event) => {
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
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === constants.callType.VIDEO_STRANGER
  ) {
    const localStream = store.getState().localStream;
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

export const sendMessageUsingDataChannel = (message) => {
  const stringifiedMessage = JSON.stringify(message);
  dataChannel.send(stringifiedMessage);
};

export const sendPreOffer = (callType, receiverPersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: receiverPersonalCode,
  };

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE ||
    callType === constants.callType.CHAT_STRANGER ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    const data = {
      callType,
      receiverPersonalCode,
    };

    ui.showCallingDialogue(callType, callingDialogueRejectHandler);
    store.setCallState(constants.callState.CALL_UNAVAILABLE);
    wss.sendPreOffer(data);
  } else {
    console.error('error in webRTCHandler.sendPreOffer');
  }
};

export const handlePreOffer = async (data) => {
  const { callType, callerSocketId } = data;

  if (
    !store.getState().cameraAvailable &&
    (callType === constants.callType.VIDEO_PERSONAL_CODE ||
      callType === constants.callType.VIDEO_STRANGER)
  ) {
    return sendPreOfferAnswer(
      constants.preOfferAnswer.RECEIVER_NO_VIDEO,
      callerSocketId
    );
  }

  if (!checkCallPossibility(callType)) {
    return sendPreOfferAnswer(
      constants.preOfferAnswer.CALL_UNAVAILABLE,
      callerSocketId
    );
  }

  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  store.setCallState(constants.callState.CALL_UNAVAILABLE);

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    ui.showIncomingCallDialogue(callType, acceptCallHandler, rejectCallHandler);
  } else if (
    callType === constants.callType.CHAT_STRANGER ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    ui.showIncomingCallDialogue(callType, acceptCallHandler, rejectCallHandler);
  }
};

const acceptCallHandler = () => {
  createPeerConnection();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);
  ui.showCallElements(connectedUserDetails.callType);
};

const rejectCallHandler = () => {
  setIncomingCallAvailable();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const callingDialogueRejectHandler = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };
  closePeerConnection();
  wss.sendUserEndConnection(data);
};

const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {
  const data = {
    callerSocketId: callerSocketId
      ? callerSocketId
      : connectedUserDetails.socketId,
    preOfferAnswer,
  };
  ui.removeAllDialogues();
  wss.sendPreOfferAnswer(data);
};

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;

  ui.removeAllDialogues();

  if (!preOfferAnswer) {
    console.error(`Preoffer answer error: ${preOfferAnswer}`);
  } else {
    if (!(preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED)) {
      setIncomingCallAvailable();
      ui.showInfoDialogue(preOfferAnswer);
    } else {
      ui.showCallElements(connectedUserDetails.callType);
      createPeerConnection();
      sendWebRTCOffer();
    }
  }
};

const sendWebRTCOffer = async () => {
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
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async (data) => {
  try {
    await peerConnection.addIceCandidate(data.candidate);
  } catch (error) {
    console.error('Error with adding ICE candidate: ', error);
  }
};

let screenSharingStream;

export const toggleScreenShare = async (screenSharingActive) => {
  if (screenSharingActive) {
    const localStream = store.getState().localStream;
    const senders = peerConnection.getSenders();
    const sender = senders.find(
      (sender) => sender.track.kind === localStream.getVideoTracks()[0].kind
    );

    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }
    //stop browser from sharing
    store
      .getState()
      .screenSharingStream.getTracks()
      .forEach((track) => track.stop());

    store.setScreenSharingActive(!screenSharingActive);
    ui.updateLocalVideo(localStream);
    ui.updateScreenShareButton(screenSharingActive);
  } else {
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      store.setScreenSharingStream(screenSharingStream);
      const senders = peerConnection.getSenders();
      const sender = senders.find(
        (sender) =>
          sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
      );

      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }
      store.setScreenSharingActive(!screenSharingActive);
      ui.updateLocalVideo(screenSharingStream);
      ui.updateScreenShareButton(screenSharingActive);
    } catch (error) {
      console.error('Error sharing screen: ', error);
    }
  }
};

//hang up related
export const handleEndConnection = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };
  wss.sendUserEndConnection(data);
  closePeerConnection();
};

export const handleUserTerminateConnection = () => {
  closePeerConnection();
};

const closePeerConnection = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE ||
    connectedUserDetails.callType === constants.callType.VIDEO_STRANGER
  ) {
    store.getState().localStream.getVideoTracks()[0].enabled = true;
    store.getState().localStream.getAudioTracks()[0].enabled = true;
  }
  ui.updateUIAfterDisconnect(connectedUserDetails.callType);
  setIncomingCallAvailable();
  connectedUserDetails = null;
};

const checkCallPossibility = (callType) => {
  const callState = store.getState().callState;

  if (callState === constants.callState.CALL_AVAILABLE) {
    return true;
  }

  if (
    (callType === constants.callType.CHAT_PERSONAL_CODE ||
      callType === constants.callType.CHAT_STRANGER) &&
    callState === constants.callState.CALL_AVAILABLE_CHAT_ONLY
  ) {
    return true;
  }

  if (
    (callType === constants.callType.VIDEO_PERSONAL_CODE ||
      callType === constants.callType.VIDEO_STRANGER) &&
    callState === constants.callState.CALL_AVAILABLE_CHAT_ONLY
  ) {
    return false;
  }

  return false;
};

const setIncomingCallAvailable = () => {
  const localStream = store.getState().localStream;
  if (localStream) {
    store.setCallState(constants.callState.CALL_AVAILABLE);
  } else {
    store.setCallState(constants.callState.CALL_AVAILABLE_CHAT_ONLY);
  }
};

//recording message
export const sendRecordingMessage = (isRecording) => {
  const data = { connectedUserDetails, isRecording };
  wss.sendRecordingMessage(data);
};
