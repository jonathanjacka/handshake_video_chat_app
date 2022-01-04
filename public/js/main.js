import * as store from './store.js';
import * as ui from './ui.js';
import * as wss from './wss.js';
import * as webRTCHandler from './webRTCHandler.js';

//initialize socket.io connection
wss.registerSocketEvents(socket);

//Event for personal code copy button
ui.copyPersonalCode(store);

//register action for Personal Code buttons
ui.registerConnectionButtons(webRTCHandler.sendPreOffer);
