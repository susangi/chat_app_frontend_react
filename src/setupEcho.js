import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');

export function initializeEcho() {
  const token = localStorage.getItem("token");
  if (token) {
    window.Echo = new Echo({
      broadcaster: 'reverb',
      key: 'sezvbhly9ga5exfy8ikb',
      wsHost: 'localhost',
      wsPort: 8080,
      wssPort: 8080,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: "http://localhost:8000/broadcasting/auth", // Point to backend's auth route
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  } 
  // window.Pusher.logToConsole = true;
   // Listening to a presence channel
  //  window.Echo.join('presence-channel')
  //  .here((users) => {
  //      console.log(users); // List of users currently in the channel
  //  })
  //  .joining((user) => {
  //      console.log(user.name + ' has joined.');
  //  })
  //  .leaving((user) => {
  //      console.log(user.name + ' has left.');
  //  });

}

initializeEcho();
