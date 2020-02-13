"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forwardLocalPortToMqtt = forwardLocalPortToMqtt;

var _net = _interopRequireDefault(require("net"));

var _debug2 = _interopRequireDefault(require("debug"));

var _bufferManagement = require("./lib/buffer-management");

var _packetController = require("./lib/packet-controller");

var _idGenerator = require("./lib/id-generator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const info = (0, _debug2.default)('mqtt:pf:info');

class Controllers extends _packetController.PacketController {
  connect(socket) {
    const socketId = (0, _idGenerator.generateId)();
    info(`${socketId}: starting new session`);
    socket.id = socketId;
    socket.nextPacketNumber = 1;
    socket.nextIncomingPacket = 1;
    this.openedSockets.set(socketId, socket);
    socket.dataTopic = `${this.topic}/tunnel/up/${socketId}`;
    this.publishToMqtt(socket, _bufferManagement.PacketCodes.Connect);
    this.manageSocketEvents(socket, socketId);
  }

  [_bufferManagement.PacketCodes.Connect]() {
    throw new Error('local-port-to-mqtt should not have recieved connect msg');
  }

}

async function forwardLocalPortToMqtt(mqttClient, portNumber, topic) {
  const socketIdPattern = new RegExp(`^${topic}/tunnel/down/(.*)$`);

  const extractSocketId = str => socketIdPattern.exec(str)[1];

  const controllers = new Controllers(mqttClient, topic, 'down');
  await controllers.init(extractSocketId, portNumber);

  const server = _net.default.createServer({
    allowHalfOpen: true
  }, socket => controllers.connect(socket));

  await new Promise(res => server.listen(portNumber, '127.0.0.1', () => {
    info(`Listening on ${portNumber} to forward to mqtt topics`);
    res();
  }));
  return () => {
    server.close();
    controllers.reset();
  };
}