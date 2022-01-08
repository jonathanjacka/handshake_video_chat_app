import * as store from './store.js';
import * as ui from './ui.js';
import * as webRTCHandler from './webRTCHandler.js';

let socketIO = null;

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on('connect', () => {
    console.log('Successfully connected to the socket.io server');
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });

  socket.on('pre-offer', (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on('pre-offer-answer', (data) => {
    webRTCHandler.handlePreOfferAnswer(data);
  });
};

export const sendPreOffer = (data) => {
  socketIO.emit('pre-offer', data);
};

export const sendPreOfferAnswer = (data) => {
  socketIO.emit('pre-offer-answer', data);
};
