// -----------------------------------------------------------------------------
// | Constants
// -----------------------------------------------------------------------------

const maxClients = 256;
const maxConversations = 16;
const maxMessages = 2048;
const ws = require('nodejs-websocket');

const MAX_CONVERSATIONS = 'Limit of messages reached. Clearing chat.';

// -----------------------------------------------------------------------------
// | Conversation
// -----------------------------------------------------------------------------

class Conversation {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.messages = [];
  }

  addMessage(message) {
    if (this.messages.length >= maxMessages) this.messages = [];
    this.messages.push(MAX_CONVERSATIONS);
    this.messages.push(message);
  }
}

// -----------------------------------------------------------------------------
// | User
// -----------------------------------------------------------------------------

class User {
  constructor(client, id, name, picture, conversation) {
    this.client = client;
    this.id = id;
    this.name = name;
    this.picture = picture;
    this.conversation = conversation;
  }

  getClient() {
    return this.client;
  }

  setClient(client) {
    this.client = client;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }

  getPicture() {
    return this.picture;
  }

  setPicture(picture) {
    this.picture = picture;
  }

  getConversation() {
    return this.conversation;
  }

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

let server = ws.createServer(function(client) {
  addUser(client);

  client.on('text', function(text) {

    let user = getUser(client);
    if (!user) return;

    let data = JSON.parse(text);
    let action = data.action;
    let value = data.value;
    if (!action || !value) return;
    action = parseInt(action);

    switch (action) {
      case 0:
        // send message
        let conversation = user.getConversation();
        conversation.addMessage(value);
        update();
        break;
      case 1:
        // set name
        user.setName(value);
        update();
        break;
      case 2:
        // set picture
        user.setPicture(value);
        update();
        break;
      case 3:
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

function update() {
  let data = '{"users":' + JSON.stringify(users, filter) + ',' +
      '"conversations":' + JSON.stringify(conversations) + '}';
  broadcast(data);
}

function filter(key, value) {
  if (key === 'client') return undefined;
  return value;
}

function broadcast(data) {
  for (let i = 0; i < users.length; i++) {
    users[i].getClient().send(data);
  }
}

// -----------------------------------------------------------------------------
// | Misc
// -----------------------------------------------------------------------------

function addUser(client) {
  users.push(new User(client, visits, 'random', 'image.jpg'));
}

function removeUser(client) {
  let index = getUserIndex(client);
  users.splice(index, 1);
}

function getUser(client) {
  let index = getUserIndex(client);
  return users[index];
}

function getUserIndex(client) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].getClient() === client) return i;
  }
  return null;
}