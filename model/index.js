module.exports = function () {
  var m = {};

  // Init configuration
  console.log("Loading config…");
  require('dotenv').config();

  m.c = {};
  m.c.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  m.c.DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  m.c.DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
  m.c.DISCORD_ROLES_MESSAGE_ID = undefined;
  m.c.DISCORD_ROLES_MAPPING = new Map();

  return m;
}
