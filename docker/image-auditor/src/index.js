const protocol = require('./protocol');
const musician = require('./musician');
const net = require('net');

// We use a standard Node.js module to work with UDP
const dgram = require('dgram');

const TCP_PORT = 2205;

// Maps of active musicians
let musicians = new Map();

// Let's create a datagram socket. We will use it to listen for datagrams published in the
// multicast group by thermometers and containing measures
const s = dgram.createSocket('udp4');
s.bind(protocol.port, () => {
    console.log("Joining multicast group");
    s.addMembership(protocol.address);
});

// TCP server
var tcp_socket = net.createServer();
tcp_socket.listen(TCP_PORT);

tcp_socket.on('connection', (socket) => {
    socket.write(JSON.stringify(Array.from(musicians.keys()), null, 2));
    socket.end();
});

// This call back is invoked when a new datagram has arrived.
s.on('message', (msg, source) => {
  var data = JSON.parse(msg, null, 2);

  let found = false;

  // Update the value
  musicians.forEach((value, key, map) => {
    if (key.uuid == data.uuid) {
      musicians.set(key, Date.now());
      found = true;
    }
  });

  // Insert a new Musician if he's not in the list
  if (!found) {
    let instrument;
    for ([key, val] of Object.entries(protocol.instruments))
    {
      if (val == data.sound) {
        instrument = key;
        break;
      }
    }
    musicians.set(new musician.Musician(data.uuid, instrument, new Date()), Date.now());
  }
});

setInterval(() => {
  musicians.forEach((value, key, map) => {
    if (Date.now() - value > 5000) {
      musicians.delete(key);
    }
  });
}, 100);
