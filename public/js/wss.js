import * as store from './store.js';
import * as ui from './ui.js';

let socketIO = null;

export const registerSocketEvents = (socket) => {
  socket.on('connect', () => {
    console.log('Successfully connected to the socket.io server');
    socketIO = socket;
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
  });
};

export const sendPreOffer = (data) => {
  socketIO.emit('pre-offer', data);
};
