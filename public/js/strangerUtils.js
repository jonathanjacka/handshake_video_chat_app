import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as ui from './ui.js';

let strangerCallType;

export const toggleStrangerConnectionStatus = (status) => {
  const data = {
    status,
  };
  wss.toggleStrangerConnectionStatus(data);
};

export const getStrangerSocketIdAndConnect = (callType) => {
  strangerCallType = callType;
  wss.getStrangerSocketId();
};

export const connectWithStranger = (data) => {
  if (data.randomStrangerSocketId) {
    webRTCHandler.sendPreOffer(strangerCallType, data.randomStrangerSocketId);
    console.log('Connecting with stranger: ', data.randomStrangerSocketId);
  } else {
    console.log('No stranger is available for connection!');
    ui.noStrangerAvailableDialogue();
  }
};
