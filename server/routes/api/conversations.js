const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.contains]: userId 
      },
      attributes: ["id"],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "users",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        }
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUsers" so that frontend will have easier access
      if (convoJSON.users) {
        convoJSON.users.forEach((user) => {
          if (onlineUsers.includes(user.id)) {
            user.online = true;
          } else {
            user.online = false;
          }
          convoJSON.otherUsers.push(user);
          delete user;
        });
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
      conversations[i].updatedAt = convoJSON.messages[convoJSON.messages.length - 1].createdAt;

      // set properties for unreadCount
      conversations[i].unreadCount = convoJSON.messages.filter((msg) => msg.isUnread && msg.senderId !== userId).length;

      // set property for last read message
      const messagesCopy = [...convoJSON.messages];
      const index = messagesCopy.reverse().findIndex((msg) => msg.isUnread === false && msg.senderId === userId);
      conversations[i].lastReadId = index > 0 ? messagesCopy[index]?.id : -1;
    }

    res.json(conversations.sort((a,b) => b.updatedAt - a.updatedAt));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
