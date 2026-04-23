const JSONStorage = require('./json_storage');
const DiscordRolesMapping = require('./discord_roles_mapping')
const OTNLinkTracker = require('./otn_link_tracker')

module.exports = function () {
  var m = {};

  // Init configuration
  console.log(" - Loading config…");
  require('dotenv').config();

  m.c = {};
  m.c.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  m.c.DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  m.c.DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
  m.c.PASACOBOT_STORAGE_FOLDER = process.env.PASACOBOT_STORAGE_FOLDER;

  //
  // Discord Mappings
  console.log(" - Loading Discord Mappings…");
  const discordRolesMappingStorage = new JSONStorage(m.c.PASACOBOT_STORAGE_FOLDER, 'discord_roles_mapping.json');
  m.c.discordRolesMapping = new DiscordRolesMapping(discordRolesMappingStorage);

  //
  // OTN News
  console.log(" - Loading OTN Link Tracker…");
  m.otn = {};
  const otnLinkTrackerStorage = new JSONStorage(m.c.PASACOBOT_STORAGE_FOLDER, 'otn_link_tracker.json');
  m.otn.linkTracker = new OTNLinkTracker(otnLinkTrackerStorage);


  //
  return m;
}
