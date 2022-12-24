const { Events } = require('discord.js');

module.exports = function (m) {
  return {
    name: Events.ClientReady,
    once: true,
    execute(client) {
      console.log(`Discord ready! Logged in as ${client.user.tag}`);
    },
  };
};
