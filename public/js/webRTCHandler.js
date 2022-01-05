import * as wss from './wss.js';

export const sendPreOffer = (callType, caller2PersonalCode) => {
  const data = {
    callType,
    caller2PersonalCode,
  };

  wss.sendPreOffer(data);
};
