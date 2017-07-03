// -----------------------------------------------------------------------------
// | Default settings
// ----------------------------------------------------------------------------

const User = require('./classes/user.js');
const Conversation = require('./classes/conversation.js');

const config = require('./config.json');
const ws = require('nodejs-websocket');

let port = 8001;
let maxClients = 256;
let maxConversations = 16;
let maxMessages = 2048;

if (config.port != null && !isNaN(config.port)) port = config.port;
if (config.maxClients != null &&
    !isNaN(config.maxMessages)) maxClients = config.maxClients;
if (config.maxConversations != null &&
    !isNaN(config.maxConversations)) maxConversations = config.maxConversations;
if (config.maxMessages != null &&
    !isNaN(config.maxMessages)) maxMessages = config.maxMessages;

exports.port = port;
exports.maxClients = maxClients;
exports.maxConversations = maxConversations;
exports.maxMessages = maxMessages;

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
}).listen(port);

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
