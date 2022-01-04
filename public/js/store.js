let state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingStream: null,
  screenSharingActive: false,
  allowConnectionsFromStrangers: false,
};

export const setSocketId = (socketId) => (state = { ...state, socketId });

export const setLocalStream = (localStream) =>
  (state = { ...state, localStream });

export const setAllowConnectionsFromStrangers = (allowConnection) =>
  (state = { ...state, allowConnectionsFromStrangers: allowConnection });

export const screenSharingActive = (screenSharing) =>
  (state = { ...state, screenSharingActive: screenSharing });

export const screenSharingStream = (stream) =>
  (state = { ...state, screenSharingStream: stream });

export const setRemoteStream = (remoteStream) =>
  (state = { ...state, remoteStream });

export const getState = () => state;
