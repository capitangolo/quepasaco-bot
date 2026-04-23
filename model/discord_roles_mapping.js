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
    console.log("[RolesMapping] Saving DiscordRolesMapping to storage.");
    if (!this.#storage) {
      console.log(" - No storage available.");
      return;
    }
    this.#storage.save(this.toJSON(), true);
    console.log(" - Saved.");
  }

  #load() {
    console.log("[RolesMapping] Loading DiscordRolesMapping from storage.");
    if (!this.#storage) {
      console.log(" - No storage available.");
      return;
    }
    const object = this.#storage.load();
    if (!object) {
      console.log(" - Could not load.");
      return;
    }
    this.fromJSON(object);
    console.log(" - Loaded successfully.");
  }
}

module.exports = DiscordRolesMapping;
