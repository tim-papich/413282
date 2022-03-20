import React from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

function findOtherUserLastReadMessageId(messages, userId) {
  const messagesCopy = [...messages];
  const index = messagesCopy.reverse().findIndex((msg) => msg.isUnread === false && msg.senderId === userId);
  return messagesCopy[index]?.id
}

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const lastReadId = findOtherUserLastReadMessageId(messages, userId);

  return (
    <Box>
      {messages.map((message, index) => {
        const time = moment(message.createdAt).format('h:mm');
        const lastRead = message.id === lastReadId;

        return message.senderId === userId ? (
          <SenderBubble key={message.id} text={message.text} time={time} lastRead={lastRead} recipientPhotoUrl={otherUser.photoUrl} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
