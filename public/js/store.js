import * as constants from './constants.js';

let state = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingStream: null,
  screenSharingActive: false,
  allowConnectionsFromStrangers: false,
  callState: constants.callState.CALL_AVAILABLE_CHAT_ONLY,
  cameraAvailable: null,
};

export const setSocketId = (socketId) => (state = { ...state, socketId });

export const setLocalStream = (localStream) =>
  (state = { ...state, localStream });

export const setAllowConnectionsFromStrangers = (allowConnection) =>
  (state = { ...state, allowConnectionsFromStrangers: allowConnection });

export const setScreenSharingActive = (screenSharing) =>
  (state = { ...state, screenSharingActive: screenSharing });

export const setScreenSharingStream = (stream) =>
  (state = { ...state, screenSharingStream: stream });

export const setRemoteStream = (remoteStream) =>
  (state = { ...state, remoteStream });

export const setCallState = (callState) => (state = { ...state, callState });

export const setCameraAvailable = (cameraAvailable) =>
  (state = { ...state, cameraAvailable });

export const getState = () => state;
