const fs = require('fs');
const path = require('node:path');

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

module.exports = JSONStorage;
