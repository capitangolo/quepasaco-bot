const fs = require('fs');
const path = require('node:path');

module.exports = function () {
  var m = {};

  // Init configuration
  console.log("Loading config…");
  require('dotenv').config();

  m.c = {};
  m.c.DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  m.c.DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  m.c.DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
  m.c.PASACOBOT_STORAGE_FOLDER = process.env.PASACOBOT_STORAGE_FOLDER;

  //
  // Discord Mappings
  const dictorRolesMappingStorage = new JSONStorage(m.c.PASACOBOT_STORAGE_FOLDER, 'discord_roles_mapping.json')
  m.c.discordRolesMapping = new DiscordRolesMapping(dictorRolesMappingStorage);

  return m;
}

class DiscordRolesMapping {

  #messageID = undefined;
  #rolesMapping = new Map();
  #storage = undefined;

  constructor(storage) {
    this.#storage = storage;
    this.#load();
  }

  setMessageID(messageID) {
    this.#messageID = messageID;
    this.#save();
  }

  getMessageID() {
    return this.#messageID;
  }

  hasRoleFor(emoji) {
    return this.#rolesMapping.has(emoji);
  }

  getRoleFor(emoji) {
    return this.#rolesMapping.get(emoji);
  }

  addMapping(emoji, roleName) {
    this.#rolesMapping.set(emoji, roleName);
    this.#save();
  }

  removeMapping(emoji) {
    if (this.#rolesMapping.has(emoji)) {
      const role = this.#rolesMapping.get(emoji);
      this.#rolesMapping.delete(emoji);
      this.#save();
      return role;
    } else {
      return false;
    }
  }

  forEach(callback) {
    this.#rolesMapping.forEach(callback);
  }

  toJSON() {
    var rolesMappingDict = {}
    this.#rolesMapping.forEach((role, emoji, map) => {
        rolesMappingDict[emoji] = role;
      });
    return {
      messageID: this.#messageID,
      rolesMapping: rolesMappingDict
    }
  }

  fromJSON(object) {
    this.#messageID = object.messageID;
    this.#rolesMapping = new Map()
    for (const [emoji, role] of Object.entries(object.rolesMapping)) {
      this.#rolesMapping.set(emoji, role);
    }
  }

  #save() {
    console.log("Saving DiscordRolesMapping to storage.");
    if (!this.#storage) {
      console.log("- No storage available.");
      return;
    }
    this.#storage.save(this.toJSON(), true);
    console.log("- Saved.");
  }

  #load() {
    console.log("Loading DiscordRolesMapping from storage.");
    if (!this.#storage) {
      console.log("- No storage available.");
      return;
    }
    const object = this.#storage.load();
    if (!object) {
      console.log("- Could not load.");
      return;
    }
    this.fromJSON(object);
    console.log("- Loaded successfully.");
  }
}

class JSONStorage {

  #directory = undefined;
  #filename = undefined;

  constructor(directory, filename) {
    this.#directory = directory;
    this.#filename = filename;
  }

  #directoryExists() {
    try {
      var json = JSON.parse(fs.statSync(this.#directory));
    } catch (error) {
      return false;
    }
    return true;
  }

  #fileExists() {
    try {
      fs.statSync(this.#getFilePath());
    } catch (error) {
      return false;
    }
    return true;
  }

  #getFilePath() {
    return path.join(this.#directory, this.#filename);
  }

  save(object, create) {
    const filePath = this.#getFilePath();
    console.log(`Saving to ${filePath}`);
    // Create directory if doesn't exist
    if (!this.#directoryExists()) {
      if (create) {
        console.log(`Creating directory ${this.#directory}`);
        fs.mkdirSync(this.#directory, {recursive: true});
      } else {
        console.log(`Base directory does not exist, skipping: ${this.#directory}`);
        return;
      }
    }
    // Save into json file
    var json = JSON.stringify(object);
    try {
      fs.writeFileSync(filePath, json, {flush: true});
    } catch (error) {
      console.log(`Error while writing to JSON: ${error}`)
    }
  }

  load() {
    const filePath = this.#getFilePath();
    console.log(`Reading from ${filePath}`);
    if (!this.#fileExists()) {
      console.log(`File does not exist, skipping: ${filePath}`);
      return;
    }
    try {
      return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      console.log(`Error while reading from JSON: ${error}`);
      return undefined;
    }
  }

}
