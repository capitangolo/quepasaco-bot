const { Events } = require('discord.js');

module.exports = function (m, u) {
  return {
    name: Events.ClientReady,
    once: true,
    execute(client) {
      console.log(`Discord ready! Logged in as ${client.user.tag}`);
    },
  };
};
