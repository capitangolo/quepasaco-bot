const { Events, MessageType } = require('discord.js');

module.exports = function (m, u) {

  const tracker = m.otn.linkTracker;

  return {
    name: Events.MessageReactionAdd,
    async execute(messageReaction, user) {
      console.log("[OTN Tracker] Reaction Add detected");

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

      // Register only if we aren't already tracking
      if (tracker.hasMessage(messageReaction.message.id)) {
        return;
      }

      // Grab all the message's content before proceeding
      messageReaction.message.fetch().then( message =>
      {
        // Only react to regular messages
        if (message.type != MessageType.Default) {
          return;
        }

        // Parse the message and output Markdown text
        const md = u.discord.otnParseMessage(message);

        // Register the message
        var message = tracker.addMessage(message.id, message.author.username, "Discord", md);
        console.log(`[OTN Tracker] Tracked Message: ${messageReaction.message.id}`);
      });
    }
  };
};
