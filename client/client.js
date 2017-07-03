let socket = new WebSocket('ws://localhost:8001');

socket.addEventListener('open', function(event) {
  debug();
});

socket.addEventListener('message', function(event) {
  const data = JSON.parse(event.data);
  console.log(data);

  let htmlUsers = document.getElementsByClassName('users')[0];
  let htmlConversations = document.getElementsByClassName('conversations')[0];

  let dataUsers = data.users;
  let dataConversations = data.conversations;

  htmlUsers.innerHTML = '';
  htmlConversations = '';

  for (let i = 0; i < dataUsers.length; i++) {
    let li = document.createElement('li');
    let id = document.createElement('p');
    let name = document.createElement('p');

    id.innerHTML = '#' + dataUsers[i].id;
    name.innerHTML = dataUsers[i].name;

    li.appendChild(id);
    li.appendChild(name);
    htmlUsers.appendChild(li);
  }

  for (let i = 0; i < htmlConversations.length; i++) {

  }
});

/**
 * Test case.
 */
function debug() {
  socket.send('{"action":0,"value":"Hey! Are you new?"}');
  socket.send('{"action":1,"value":"Borat"}');
  socket.send(
      '{"action":2,"value":0}');
}
