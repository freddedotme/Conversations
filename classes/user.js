/** User */
class User {
  /**
   * Create a user.
   * @param {object} client Client, used as identifier.
   * @param {number} id Id of the user.
   * @param {string} name Name of the user.
   * @param {number} conversation Id of active conversation.
   * @constructor
   */
  constructor(client, id, name, conversation) {
    this.client = client;
    this.id = id;
    this.name = name;
    this.conversation = conversation;
  }

  /**
   * @return {object} The client.
   */
  getClient() {
    return this.client;
  }

  /**
   * @param {object} client Set client.
   */
  setClient(client) {
    this.client = client;
  }

  /**
   * @return {number} The user id.
   */
  getId() {
    return this.id;
  }

  /**
   * @param {number} id Set id.
   */
  setId(id) {
    this.id = id;
  }

  /**
   * @return {string} The name.
   */
  getName() {
    return this.name;
  }

  /**
   * @param {string} name Set name.
   */
  setName(name) {
    this.name = name;
  }

  /**
   * @return {id} The conversation.
   */
  getConversation() {
    return this.conversation;
  }

  /**
   * @param {number} conversation Set conversation.
   */
  setConversation(conversation) {
    this.conversation = conversation;
  }
}

module.exports = User;
