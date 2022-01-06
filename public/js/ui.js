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

  const incomingCallDialogue = elements.getIncomingCallDialogue();
};
