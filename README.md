# Conversations
A websocket-based chat application that's W.I.P. Main purpose is to learn more about websockets and Javascript in general. Any feedback is appreciated.

### Documentation
http://fredde.me/Conversations/

### Installation
1. Clone this repo.
2. `cd Conversations/` 
3. `npm install`
4. `npm start`
5. Open up `client/client.html`.
6. Make an awesome interface and send a pull request.

### How it works
Conversations sends a JSON object from the websocket server to the client whenever someone joins, sends a message, update their name or change conversation (room). The format of the JSON object looks like this:


    {
      "users":[
        {
          "id":0,
          "name":"0",
          "conversation":1
        }
      ],
      "conversations":[
        {
          "id":0,
          "name":"General",
          "messages":[]
        },
        {
          "id":1,
          "name":"Sports",
          "messages":[
            {
              "user":0,"message":"Hey! Are you new?","date":"2017-07-04 00:27"
            }
          ]
        },
        {
          "id":2,
          "name":"Gaming",
          "messages":[]
        }
      ]
    }



