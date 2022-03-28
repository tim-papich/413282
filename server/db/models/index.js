const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

User.belongsToMany(Conversation, { through: 'GroupUser' });
Conversation.belongsToMany(User, { through: 'GroupUser' });
Conversation.hasMany(Message)
Message.belongsTo(Conversation)
User.hasMany(Message);
Message.belongsTo(User, {
  foreignKey: 'senderId'
});

module.exports = {
  User,
  Conversation,
  Message
};