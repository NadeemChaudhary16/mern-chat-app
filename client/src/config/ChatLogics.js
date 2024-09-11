export const isSameSenderMargin = (messages, m, i, userId) => {
  const len = messages.length;
  const nextMessage = messages[i + 1];
  const currentSenderId = m.sender._id;
  const nextSenderId = nextMessage?.sender?._id;
  const currentIsUser = currentSenderId === userId;

  if (i < len - 1 && nextSenderId === currentSenderId && !currentIsUser) {
    return 800;
  } else if (
    (i < len - 1 && nextSenderId !== currentSenderId && !currentIsUser) ||
    (i === len - 1 && !currentIsUser)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const isSameSender = (messages, m, i, userId) => {
  const nextMessage = messages[i + 1];
  if (!nextMessage || i >= messages.length - 1) return false;

  const nextSenderId = nextMessage.sender?._id;
  return nextSenderId !== m.sender._id && m.sender._id !== userId;
};

export const isLastMessage = (messages, i, userId) => {
  const len = messages.length;
  return (
    i === len - 1 &&
    messages[len - 1].sender._id !== userId &&
    messages[len - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSender = (loggedUser, users) => {
  // console.log("Logged users", loggedUser, users);

  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
