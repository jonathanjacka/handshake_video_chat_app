import * as wss from './wss.js';

export const sendPreOffer = (callType, caller2PersonalCode) => {
  const data = {
    callType,
    caller2PersonalCode,
  };

  wss.sendPreOffer(data);
};

export const handlePreOffer = (data) => console.log('PreOffer received', data);
