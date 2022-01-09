import * as constants from './constants.js';
import * as elements from './elements.js';

export const updatePersonalCode = (personalCode) => {
  const personalCodeParagraph = document.getElementById(
    'personal_code_paragraph'
  );
  personalCodeParagraph.innerHTML = personalCode;
};

//Event for personal code copy button
export const copyPersonalCode = (store) => {
  const personalCodeCopyButton = document.getElementById(
    'personal_code_copy_button'
  );

  personalCodeCopyButton.addEventListener('click', () => {
    personalCodeCopyButton.innerHTML = '<i class="fas fa-check"></i>';
    personalCodeCopyButton.style.background = '#8bf79d';

    const personalCode = store.getState().socketId;
    navigator.clipboard && navigator.clipboard.writeText(personalCode);

    setTimeout(() => {
      personalCodeCopyButton.innerHTML = '<i class="far fa-copy"></i>';
      personalCodeCopyButton.style.background = '#757ae2';
    }, 1500);
  });
};

export const showIncomingCallDialogue = (
  callType,
  acceptCallHandler,
  rejectCallHandler
) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? 'Chat' : 'Video';

  const incomingCallDialogue = elements.getIncomingCallDialogue(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler
  );

  removeAllDialogues();
  dialogue.appendChild(incomingCallDialogue);
};

export const showCallingDialogue = (callType, callingDialogueRejectHandler) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? 'Chat' : 'Video';

  const connectingDialogue = elements.getOutgoingConnectionDialogue(
    callTypeInfo,
    callingDialogueRejectHandler
  );

  removeAllDialogues();
  dialogue.appendChild(connectingDialogue);
};

export const showInfoDialogue = (preOfferAnswer) => {
  let infoDialogue = null;

  if (preOfferAnswer === constants.preOfferAnswer.RECEIVER_NOT_FOUND) {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      'Receiver was not found - check your personal codes are correct'
    );
  } else if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      'Receiver rejected your connection'
    );
  } else if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      'Receiver is unavailable or busy'
    );
  } else {
    infoDialogue = elements.getInfoDialogue(
      'Connection rejected',
      'There was an error in attempting to connect'
    );
  }
  dialogue.appendChild(infoDialogue);
};

export const removeAllDialogues = () => {
  const dialogue = document.getElementById('dialogue');
  dialogue.querySelectorAll('*').forEach((child) => child.remove());
};
