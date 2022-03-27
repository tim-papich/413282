const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

User.belongsToMany(Conversation, { through: Group });
Conversation.belongsToMany(User, { through: Group });
Conversation.hasMany(Message);
Message.belongsTo(Conversation);

module.exports = {
  User,
  Conversation,
  Message
};

users groups messages
group has many users
users have many groups
a message has one user
a message has one group
a group had many messages