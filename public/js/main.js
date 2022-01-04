import * as store from './store.js';

socket.on('connect', () => {
  console.log('Successfully connected to socket.io server', socket.id);

  store.setSocketId(socket.id);

  console.log(store.getState().socketId);
});
