export const getIncomingCallDialogue = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler
) => {
  console.log('Getting incoming call dialogue');

  const dialogue = document.createElement('div');
  dialogue.classList.add('dialogue_wrapper');

  const dialogueContent = document.createElement('div');
  dialogueContent.classList.add('dialogue_content');
  dialogue.appendChild(dialogueContent);

  const title = document.createElement('p');
  title.classList.add('dialogue_title');
  title.innerText = `Incoming ${callTypeInfo} Request`;

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('dialogue_image_container');
  const image = document.createElement('img');
  const avatarImagePath = 'public/utils/images/dialogAvatar.png';
  image.src = avatarImagePath;
  imageContainer.appendChild(image);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('dialogue_button_container');

  const acceptCallButton = document.createElement('button');
  acceptCallButton.classList.add('dialogue_accept_call_button');
  acceptCallButton.innerHTML =
    callTypeInfo === 'Video'
      ? '<i class="fas fa-phone"></i> Accept Call'
      : '<i class="fas fa-comment"></i> Accept Chat';
  buttonContainer.appendChild(acceptCallButton);
  acceptCallButton.addEventListener('click', () => acceptCallHandler());

  const rejectCallButton = document.createElement('button');
  rejectCallButton.classList.add('dialogue_reject_call_button');
  rejectCallButton.innerHTML =
    callTypeInfo === 'Video'
      ? '<i class="fas fa-phone-slash"></i> Reject Call'
      : '<i class="fas fa-comment-slash"></i> Reject Chat';
  buttonContainer.appendChild(rejectCallButton);
  rejectCallButton.addEventListener('click', () => rejectCallHandler());

  dialogueContent.appendChild(title);
  dialogueContent.appendChild(imageContainer);
  dialogueContent.appendChild(buttonContainer);

  return dialogue;
};

export const getOutgoingConnectionDialogue = (
  callTypeInfo,
  callingDialogueRejectHandler
) => {
  console.log('Pushing outgoing connection dialogue:');

  const dialogue = document.createElement('div');
  dialogue.classList.add('dialogue_wrapper');

  const dialogueContent = document.createElement('div');
  dialogueContent.classList.add('dialogue_content');
  dialogue.appendChild(dialogueContent);

  const title = document.createElement('p');
  title.classList.add('dialogue_title');
  title.innerText = `Sending ${callTypeInfo} Request`;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('dialogue_button_container');

  const rejectConnectionButton = document.createElement('button');
  rejectConnectionButton.classList.add('dialogue_reject_call_button');
  rejectConnectionButton.innerHTML =
    callTypeInfo === 'Video'
      ? '<i class="fas fa-phone-slash"></i> End Call Request'
      : '<i class="fas fa-comment-slash"></i> End Chat Request';
  buttonContainer.appendChild(rejectConnectionButton);
  rejectConnectionButton.addEventListener('click', () =>
    callingDialogueRejectHandler()
  );

  dialogueContent.appendChild(title);
  dialogueContent.appendChild(buttonContainer);

  return dialogue;
};
