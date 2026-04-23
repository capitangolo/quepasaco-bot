const { Events } = require('discord.js');

module.exports = function (m, u) {
  return {
    name: Events.MessageReactionRemove,
    async execute(messageReaction, user) {
      // Only process reactions to the choosen Message
      if (messageReaction.message.id !== m.c.discordRolesMapping.getMessageID()) {
        return;
      }

      // Process the reaction
      console.log("[RolesMapping] Reaction Remove detected");
      const emoji = messageReaction.emoji.name;

      // Ignore non-mapped emojis
      if (!m.c.discordRolesMapping.hasRoleFor(emoji)) {
        return;
      }

      const roleName = m.c.discordRolesMapping.getRoleFor(emoji);
      var member = messageReaction.message.guild.members.cache.find(member => member.user === user);
      var role = messageReaction.message.guild.roles.cache.find(role => role.name === roleName);

      member.roles.remove(role);
      console.log(`[RolesMapping] Removed role: ${roleName} from ${user.tag}`);
	  },
  };
};
