// -----------------------------------------------------------------------------
// | Constants
// -----------------------------------------------------------------------------

// const maxClients = 256;
// const maxConversations = 16;
const maxMessages = 2048;
const ws = require('nodejs-websocket');

const MAX_CONVERSATIONS = 'Limit of messages reached. Clearing chat.';

// -----------------------------------------------------------------------------
// | Conversation
// -----------------------------------------------------------------------------

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
    if (this.messages.length >= maxMessages) {
      this.messages = [];
      this.messages.push(
          new Message(-1, MAX_CONVERSATIONS, getFormattedDate()));
    }
    this.messages.push(
        new Message(user.getId(), message, getFormattedDate()));
  }
}

// -----------------------------------------------------------------------------
// | Message
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// | User
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// | Server
// -----------------------------------------------------------------------------

let conversations = [];
let users = [];
let visits = 0;

conversations.push(new Conversation(0, 'General'));
conversations.push(new Conversation(1, 'Sports'));
conversations.push(new Conversation(2, 'Gaming'));

ws.createServer(function(client) {
  addUser(client);

  client.on('text', function(text) {
    let user = getUser(client);
    if (user == null) return;

    let data = JSON.parse(text);
    let action = data.action;
    let value = data.value;

    if (action == null || value == null) return;
    action = parseInt(action);

    switch (action) {
      case 0:
        // send message
        console.log('runs');
        let index = user.getConversation();
        console.log('runs');
        conversations[index].addMessage(user, value);
        update();
        break;
      case 1:
        // set name
        user.setName(value);
        update();
        break;
      case 2:
        // set conversation
        value = parseInt(value);
        if (value < 0 || value >= conversations.length) return;
        user.setConversation(parseInt(value));
        update();
    }
  });

  client.on('close', function(code, reason) {
    removeUser(client);
  });

  visits++;
}).listen(8001);

// -----------------------------------------------------------------------------
// | Communication
// -----------------------------------------------------------------------------

/**
 * Sends an update with the newest data.
 */
function update() {
  let data = '{"users":' + JSON.stringify(users, filter) + ',' +
      '"conversations":' + JSON.stringify(conversations) + '}';
  broadcast(data);
}

/**
 * Filters JSON from specific keys.
 * @param {string} key The JSON key.
 * @param {*} value The value of JSON key.
 * @return {*} value If the key is allowed it returns it.
 */
function filter(key, value) {
  if (key === 'client') return undefined;
  return value;
}

/**
 * Broadcast data to all users.
 * @param {string} data Data to be broadcast.
 */
function broadcast(data) {
  for (let i = 0; i < users.length; i++) {
    users[i].getClient().send(data);
  }
}

// -----------------------------------------------------------------------------
// | Misc
// -----------------------------------------------------------------------------

/**
 * Add user to users list.
 * @param {object} client Client, used as identifier.
 */
function addUser(client) {
  users.push(new User(client, visits, 'random', 1));
}

/**
 * Remove user from users list.
 * @param {object} client Client, used as identifier.
 */
function removeUser(client) {
  let index = getUserIndex(client);
  if (index == null) return;
  users.splice(index, 1);
}

/**
 * Get a user from users list.
 * @param {object} client Client, used as identifier.
 * @return {object} user The user.
 */
function getUser(client) {
  let index = getUserIndex(client);
  if (index == null) return null;
  return users[index];
}

/**
 * Get user index in users list.
 * @param {object} client Client, used as identifier.
 * @return {number} i The index.
 * @return {null} Returns null if user not found.
 */
function getUserIndex(client) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].getClient() === client) return i;
  }
  return null;
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
