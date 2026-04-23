const { Events, MessageType } = require('discord.js');

module.exports = function (m, u) {

  const tracker = m.otn.linkTracker;

  return {
    name: Events.MessageReactionRemove,
    async execute(messageReaction, user) {
      console.log("[OTN Tracker] Reaction Remove detected");

      // Listen only to the specified channel
      if (messageReaction.message.channelId !== tracker.getDiscordChannelID()) {
        return;
      }

      // Register only for auth users
      if (!tracker.discordUserCanTrack(user.id)) {
        return;
      }

      // Register only for memo emoji
      const emoji = messageReaction.emoji.name;
      if (emoji.name === "📝") {
        return;
      }

      // Act only if we have registered that message
      if (!tracker.hasMessage(messageReaction.message.id)) {
        return;
      }

      tracker.removeMessage(messageReaction.message.id);
      console.log(`[OTN Tracker] Removed Message: ${messageReaction.message.id}`);
    }
  };
};
