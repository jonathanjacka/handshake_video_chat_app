import * as wss from './wss.js';

export const toggleStrangerConnectionStatus = (status) => {
  const data = {
    status,
  };
  console.log('May chat with strangers: ', status);
  wss.toggleStrangerConnectionStatus(data);
};
