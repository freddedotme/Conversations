var socket = new WebSocket('ws://localhost:8001');

socket.addEventListener('open', function(event) {
  debug();
});

socket.addEventListener('message', function(event) {
  let data = JSON.parse(event.data);
  console.log(data);
});

function debug() {
  socket.send('{"action":1,"value":"Borat"}');
  socket.send(
      '{"action":2,"value":"https://s-media-cache-ak0.pinimg.com/736x/92/9d/3d/929d3d9f76f406b5ac6020323d2d32dc--pretty-cats-beautiful-cats.jpg"}');
}