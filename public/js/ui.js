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

//register event listeners for connection buttons
export const registerConnectionButtons = (sendPreOffer) => {
  const personalCodeChatButton = document.getElementById(
    'personal_code_chat_button'
  );
  const personalCodeVideoButton = document.getElementById(
    'personal_code_video_button'
  );

  personalCodeChatButton.addEventListener('click', () => {
    console.log('Chat button clicked!');
    sendPreOffer();
  });
  personalCodeVideoButton.addEventListener('click', () => {
    console.log('Video button clicked!');
    sendPreOffer();
  });
};
