import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const { messages, otherUser, userId, postRead, lastReadId } = props;

  useEffect(() => {
    if (messages.length > 0) {
      postRead({conversationId: messages[0].conversationId, recipientId: otherUser.id});
    }
  }, [messages, otherUser.id, postRead]);

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
