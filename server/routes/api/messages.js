const router = require("express").Router();
const { Op } = require("sequelize");
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientIds, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      [senderId, ...recipientIds]
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        userIds: [senderId, ...recipientIds]
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/read", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const recipientId = req.user.id;
    const { conversationId } = req.body;

    const conversation = await Conversation.findOne({
      where: {
        id: conversationId
      }
    });

    if (conversation.userIds.includes(recipientId)) {
      return res.sendStatus(403);
    }

    const messages = await Message.update({ isUnread: false }, {
      where: {
        [Op.not]: {
          senderId: recipientId
        },
        isUnread: true,
        conversationId: conversationId
      },
      returning: true
    });

    // return the messages that were updated
    res.json({messages: messages[1], conversationId: conversationId});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
