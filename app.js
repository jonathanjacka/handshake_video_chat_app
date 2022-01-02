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
  console.log('a user connected to socket.io server', socket.id);
  connectedPeers = [...connectedPeers, socket.id];
  console.log(connectedPeers);

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
