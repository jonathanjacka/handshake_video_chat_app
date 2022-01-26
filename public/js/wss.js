import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';
import * as strangerUtils from './strangerUtils.js';
import * as recordingUtils from './recordingUtils.js';

let socketIO = null;

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on('connect', () => {
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });

  socket.on('pre-offer', (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on('pre-offer-answer', (data) => {
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on('user-ended-connection', () => {
    webRTCHandler.handleUserTerminateConnection();
  });

  socket.on('webRTC-signaling', (data) => {
    switch (data.type) {
      case constants.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data);
        break;
      case constants.webRTCSignaling.ANSWER:
        webRTCHandler.handleWebRTCAnswer(data);
        break;
      case constants.webRTCSignaling.ICE_CANDIDATE:
        webRTCHandler.handleWebRTCCandidate(data);
        break;
      default:
        return;
    }
  });

  socket.on('stranger-socket-id', (data) => {
    strangerUtils.connectWithStranger(data);
  });

  socket.on('user-recording', (isRecording) => {
    recordingUtils.togglePeerRecordingMessage(isRecording);
  });
};

export const sendPreOffer = (data) => {
  socketIO.emit('pre-offer', data);
};

export const sendPreOfferAnswer = (data) => {
  socketIO.emit('pre-offer-answer', data);
};

export const sendDataUsingWebRTCSignaling = (data) => {
  socketIO.emit('webRTC-signaling', data);
};

export const sendUserEndConnection = (data) => {
  socketIO.emit('user-ended-connection', data);
};

export const toggleStrangerConnectionStatus = (data) => {
  socketIO.emit('toggle-stranger-connection-status', data);
};

export const getStrangerSocketId = () => {
  socketIO.emit('get-stranger-socket-id');
};

export const sendRecordingMessage = (data) => {
  socketIO.emit('user-recording', data);
};
