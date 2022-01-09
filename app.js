const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const morgan = require('morgan');
const colors = require('colors');

dotenv.config();
const app = express();

const server = http.createServer(app);
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/public', express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

//Socket IO
const io = new Server(server);
let connectedPeers = [];

io.on('connection', (socket) => {
  console.log('a user connected to socket.io server: ', socket.id);
  connectedPeers = [...connectedPeers, socket.id];
  console.log(connectedPeers);

  socket.on('pre-offer', (data) => {
    const { receiverPersonalCode, callType } = data;
    const connectedPeer = connectedPeers.find(
      (socketID) => socketID === receiverPersonalCode
    );

    if (connectedPeer) {
      const data = {
        callerSocketId: socket.id,
        callType,
      };
      io.to(receiverPersonalCode).emit('pre-offer', data);
    } else {
      const data = {
        preOfferAnswer: 'RECEIVER_NOT_FOUND',
      };
      io.to(socket.id).emit('pre-offer-answer', data);
    }
  });

  socket.on('pre-offer-answer', (data) => {
    const connectedPeer = connectedPeers.find(
      (socketID) => socketID === data.callerSocketId
    );

    if (connectedPeer) {
      io.to(data.callerSocketId).emit('pre-offer-answer', data);
    }
  });

  socket.on('webRTC-signaling', (data) => {
    const connectedPeer = connectedPeers.find(
      (socketID) => socketID === data.connectedUserSocketId
    );

    if (connectedPeer) {
      io.to(data.connectedUserSocketId).emit('webRTC-signaling', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected!');
    const newConnectedPeers = connectedPeers.filter(
      (peerId) => peerId !== socket.id
    );
    connectedPeers = [...newConnectedPeers];
    console.log(connectedPeers);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}: Hello there...`
      .bgBlue
  )
);
