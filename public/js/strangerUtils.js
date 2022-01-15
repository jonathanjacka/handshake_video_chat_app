import * as wss from './wss.js';

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
  console.log('Stranger ID:', data.randomStrangerSocketId);
};
