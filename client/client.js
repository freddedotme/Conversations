let socket = new WebSocket('ws://localhost:8001');

socket.addEventListener('open', function(event) {
  test();
});

socket.addEventListener('message', function(event) {
  const data = JSON.parse(event.data);
  console.log(data);
});

/**
 * Test case.
 */
function test() {
  socket.send('{"action":0,"value":"Hey! Are you new?"}');
  socket.send('{"action":1,"value":"Borat"}');
  socket.send(
      '{"action":2,"value":0}');
}
