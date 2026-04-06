const { Events } = require('discord.js');

module.exports = function (m) {
  return {
    name: Events.MessageReactionRemove,
    async execute(messageReaction, user) {
      console.log("MessageReactionRemove detected");
      if (messageReaction.message.id === m.c.discordRolesMapping.getMessageID()) {
        const emoji = messageReaction.emoji.name;

        if (m.c.discordRolesMapping.hasRoleFor(emoji)) {
          const roleName = m.c.discordRolesMapping.getRoleFor(emoji);
          var member = messageReaction.message.guild.members.cache.find(member => member.user === user);
          var role = messageReaction.message.guild.roles.cache.find(role => role.name === roleName);

          member.roles.remove(role);
          console.log(`Removed role: ${roleName} from ${user.tag}`);
        }
      }
	  },
  };
};
