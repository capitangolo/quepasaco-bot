const { Events } = require('discord.js');

module.exports = function (m) {
  return {
    name: Events.MessageReactionAdd,
    async execute(messageReaction, user) {
      console.log("MessageReactionAdd detected");
      if (messageReaction.message.id === m.c.DISCORD_ROLES_MESSAGE_ID) {
        const emoji = messageReaction.emoji.name;

        if (m.c.DISCORD_ROLES_MAPPING.has(emoji)) {
          const roleName = m.c.DISCORD_ROLES_MAPPING.get(emoji);
          var member = messageReaction.message.guild.members.cache.find(member => member.user === user);
          var role = messageReaction.message.guild.roles.cache.find(role => role.name === roleName);

          member.roles.add(role);
          console.log(`Added role: ${roleName} to ${user.tag}`);
        }
      }
	  },
  };
};
