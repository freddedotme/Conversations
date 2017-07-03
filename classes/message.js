/** Message */
class Message {
  /**
   * Create a message.
   * @param {number} user User of the conversation.
   * @param {string} message Message.
   * @param {string} date When the message was sent.
   * @constructor
   */
  constructor(user, message, date) {
    this.user = user;
    this.message = message;
    this.date = date;
  }

  /**
   * @return {int} The user id.
   */
  getUser() {
    return this.user;
  }

  /**
   * @return {string} The message.
   */
  getMessage() {
    return this.message;
  }

  /**
   * @return {string} The date of the message.
   */
  getDate() {
    return this.date;
  }
}

module.exports = Message;
