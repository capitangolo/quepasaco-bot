class OTNMessage {
  #discordMessageID = undefined;
  collaborator = undefined;
  source = undefined;
  text = undefined;

  constructor(discordMessageID) {
    this.#discordMessageID = discordMessageID;
  }

  getDiscordMessageID(){
    return this.#discordMessageID;
  }

  //
  toJSON() {
    return {
      discordMessageID: this.#discordMessageID,
      collaborator: this.collaborator,
      source: this.source,
      text: this.text,
    }
  }
}

class OTNLinkTracker {

  #discordAuthUsers = [
    '430026173100326913', // capitangolo
    '475344227405004837', // lasdelpulpo
  ];

  #discordChannelID = undefined;
  #discordMessages = new Map();
  #messagesByCategory = new Map();
  #storage = undefined;

  constructor(storage) {
    this.#storage = storage;
    this.#load();
  }

  setDiscordChannelID(discordChannelID) {
    this.#discordChannelID = discordChannelID;
    this.#save();
  }

  getDiscordChannelID() {
    return this.#discordChannelID;
  }

  forEachCategory(callback) {
    this.#messagesByCategory.forEach(callback);
  }

  forEachDiscordMessage(callback) {
    this.#discordMessages.forEach(callback);
  }

  //
  // Auth Users
  //
  discordUserCanTrack(userID) {
    return this.#discordAuthUsers.indexOf(userID) >= 0;
  }

  //
  // Managing Messages
  //

  clearMessages() {
    this.#discordMessages = new Map();
    this.#messagesByCategory = new Map();
    this.#save();
  }

  hasMessage(discordMessageID) {
    return this.#discordMessages.has(discordMessageID);
  }

  removeMessage(discordMessageID) {
    if (!this.hasMessage(discordMessageID)) {
      return false;
    }

    this.#discordMessages.delete(discordMessageID);
    this.#save();
  }

  addMessage(discordMessageID, collaborator, source, text) {
    var message = new OTNMessage(discordMessageID);
    message.collaborator = collaborator;
    message.source = source;
    message.text = text;

    this.#discordMessages.set(discordMessageID, message);
    this.#save();
  }

/*
  updatedCategoryOn(message, oldCategory) {
    // Delete message from old category
    if (this.#messagesByCategory.has(oldCategory)) {
      var oldCategoryList = this.#messagesByCategory.get(oldCategory);
      var messageIndex = oldCategoryList.indexOf(message);
      if (messageIndex >= 0) {
        oldCategoryList.splice(messageIndex, 1);
      }
    }
    // Add message to new category
    var category = message.category;
    if (!this.#messagesByCategory.has(category)) {
      this.#messagesByCategory.set(category, []);
    }
    var categoryList = this.#messagesByCategory.get(category)
    categoryList.push(message);
    this.#save();
  }
*/
  //
  // Storage
  //

  toJSON() {
    var messagesList = []
    this.#discordMessages.forEach((message, discordMessageID, map) => {
        messagesList.push(message.toJSON());
      });
    return {
      discordChannelID: this.#discordChannelID,
      messages: messagesList
    }
  }

  fromJSON(object) {
    //
    this.#discordChannelID = object.discordChannelID;
    //
    object.messages.forEach((jsonmessage, index) => {
      var message = this.addMessage(
        jsonmessage.discordMessageID,
        jsonmessage.collaborator,
        jsonmessage.source,
        jsonmessage.text
      );
    });
  }

  #save() {
    console.log("[OTN Tracker] Saving OTNLinkTracking to storage.");
    if (!this.#storage) {
      console.log(" - No storage available.");
      return;
    }
    this.#storage.save(this.toJSON(), true);
    console.log(" - Saved.");
  }

  #load() {
    console.log("[OTN Tracker] Loading OTNLinkTracking from storage.");
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

module.exports = OTNLinkTracker;
