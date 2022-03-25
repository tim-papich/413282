const { Op } = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {});

// find conversation given array of userIds

Conversation.findConversation = async function (userIds) {
  const conversation = await Conversation.findOne({
    where: {
      userIds: userIds
    }
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
