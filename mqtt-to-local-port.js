"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forwardMqttToLocalPort = forwardMqttToLocalPort;

var _net = _interopRequireDefault(require("net"));

var _debug2 = _interopRequireDefault(require("debug"));

var _bufferManagement = require("./lib/buffer-management");

var _packetController = require("./lib/packet-controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const info = (0, _debug2.default)('mqtt:pf:info');

class Controllers extends _packetController.PacketController {
  [_bufferManagement.PacketCodes.Connect](socketId, data, packetNumber, portNumber) {
    const socket = new _net.default.Socket();
    info(`${socketId}: out Establishing connection to local port ${portNumber}`);
    socket.connect(portNumber, '127.0.0.1', () => {
      socket.nextIncomingPacket = packetNumber + 1;
    });
    socket.id = socketId;
    socket.nextPacketNumber = 1;
    socket.nextIncomingPacket = packetNumber;
    this.openedSockets.set(socketId, socket);
    socket.dataTopic = `${this.topic}/tunnel/down/${socketId}`;
    this.manageSocketEvents(socket, socketId);
  }

}

async function forwardMqttToLocalPort(mqttClient, portNumber, topic) {
  const socketIdPattern = new RegExp(`^${topic}/tunnel/up/(.*)$`);

  const extractSocketId = str => socketIdPattern.exec(str)[1];

  const controllers = new Controllers(mqttClient, topic, 'up');
  await controllers.init(extractSocketId, portNumber);
  mqttClient.on('connect', () => {
    info(`Listening on mqtt topics ${topic}/tunnel/* to forward to port ${portNumber}`);
  });
  return () => controllers.reset();
}