const App = require('../app.js');
const Message = require('./message.js');

/** Conversation */
class Conversation {
  /**
   * Create a conversation.
   * @param {number} id Id of the conversation.
   * @param {number} name Name of the conversation.
   * @constructor
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.messages = [];
  }

  /**
   * Add a new message to the conversation, clears chat if limit reached.
   * @param {number} user User of the message.
   * @param {string} message Message.
   */
  addMessage(user, message) {
    if (this.messages.length >= App.maxMessages) {
      this.messages = [];
      this.messages.push(
          new Message(-1, MSG_MAX_CONVERSATIONS, getFormattedDate()));
    }
    this.messages.push(
        new Message(user.getId(), message, getFormattedDate()));
  }
}

/**
 * Get date as a formatted string.
 * @return {string} date The formatted date as a string.
 */
function getFormattedDate() {
  let today = new Date();
  let mm = today.getMinutes();
  let hh = today.getHours();
  let dd = today.getDate();
  let MM = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) dd = '0' + dd;
  if (MM < 10) MM = '0' + MM;
  if (hh < 10) hh = '0' + hh;
  if (mm < 10) mm = '0' + mm;

  return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm;
}

module.exports = Conversation;
