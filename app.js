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
let connectedPeersStrangers = [];

io.on('connection', (socket) => {
  console.log('a user connected to socket.io server: ', socket.id);
  connectedPeers = [...connectedPeers, socket.id];
  console.log('Connected Peers: ', connectedPeers);
  console.log('Connected Peers STRANGERS: ', connectedPeersStrangers);

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

  socket.on('user-ended-connection', (data) => {
    const connectedPeer = connectedPeers.find(
      (socketID) => socketID === data.connectedUserSocketId
    );

    if (connectedPeer) {
      io.to(data.connectedUserSocketId).emit('user-ended-connection');
    }
  });

  socket.on('toggle-stranger-connection-status', (data) => {
    const { status } = data;

    if (!status) {
      connectedPeersStrangers = connectedPeersStrangers.filter(
        (id) => id !== socket.id
      );
    } else {
      connectedPeersStrangers = [...connectedPeersStrangers, socket.id];
    }
    console.log('Connected Peers Strangers: ', connectedPeersStrangers);
  });

  socket.on('get-stranger-socket-id', () => {
    let randomStrangerSocketId;
    const filteredconnectedPeersStrangers = connectedPeersStrangers.filter(
      (id) => id !== socket.id
    );

    if (filteredconnectedPeersStrangers.length <= 0) {
      randomStrangerSocketId = null;
    } else {
      randomStrangerSocketId =
        filteredconnectedPeersStrangers[
          Math.floor(Math.random() * filteredconnectedPeersStrangers.length)
        ];
    }

    const data = {
      randomStrangerSocketId,
    };

    io.to(socket.id).emit('stranger-socket-id', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected!');
    connectedPeers = connectedPeers.filter((peerId) => peerId !== socket.id);
    connectedPeersStrangers = connectedPeersStrangers.filter(
      (id) => id !== socket.id
    );
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
