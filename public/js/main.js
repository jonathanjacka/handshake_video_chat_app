import * as store from './store.js';
import * as ui from './ui.js';
import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';
import * as constants from './constants.js';

//initialize socket.io connection
wss.registerSocketEvents(socket);

//Event for personal code copy button
ui.copyPersonalCode(store);

//register event listeners for connection buttons
const personalCodeChatButton = document.getElementById(
  'personal_code_chat_button'
);
const personalCodeVideoButton = document.getElementById(
  'personal_code_video_button'
);
//Personal Chat
personalCodeChatButton.addEventListener('click', () => {
  const receiverPersonalCode = document.getElementById(
    'personal_code_input'
  ).value;
  const callType = constants.callType.CHAT_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, receiverPersonalCode);
});

//Personal Video
personalCodeVideoButton.addEventListener('click', () => {
  const receiverPersonalCode = document.getElementById(
    'personal_code_input'
  ).value;
  const callType = constants.callType.VIDEO_PERSONAL_CODE;
  webRTCHandler.sendPreOffer(callType, receiverPersonalCode);
});
