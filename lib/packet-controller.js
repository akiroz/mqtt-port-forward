"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PacketController = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

var _bufferManagement = require("./buffer-management");

var _promise_helpers = require("./promise_helpers");

var _asPromise = require("mqtt-extras/as-promise");

var _pipeline = require("./async_iter/pipeline");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug2.default)('mqtt:pf');
const info = (0, _debug2.default)('mqtt:pf:info');
const mqttTimeout = 60000 * 2; // Period to close socket if no mqtt packets received

const resentPeriod = 1000; // Period to wait to resent unacknowledged

const backlogCount = 4; // Maximum number of packets to allow resending...

function removeSocket(openedSockets, socket) {
  socket.end();
  socket.destroy();
  clearTimeout(socket.timeoutHandler);
  openedSockets.delete(socket.id);
  if (socket.packetsWaitingAck) for (const x of socket.packetsWaitingAck.values()) clearTimeout(x);
}

function withSocketId(fn) {
  return msg => {
    try {
      return { ...msg,
        socketId: fn(msg.incomingTopic)
      };
    } catch {
      return msg;
      /* ignore the error */
    }
  };
}

function withHeader() {
  return msg => {
    return { ...msg,
      ...(0, _bufferManagement.extractHeader)(msg.buffer)
    };
  };
}

function withRequiresAck(openedSockets) {
  return msg => {
    const requiresAck = msg.code !== _bufferManagement.PacketCodes.Ack && (msg.code === _bufferManagement.PacketCodes.Connect || openedSockets.has(msg.socketId));
    return { ...msg,
      requiresAck
    };
  };
}

function withRequiresTerminate(openedSockets) {
  return msg => {
    const requiresTerminate = msg.code !== _bufferManagement.PacketCodes.Ack && msg.code !== _bufferManagement.PacketCodes.Connect && !openedSockets.has(msg.socketId) && msg.packetNumber > backlogCount;
    return { ...msg,
      requiresTerminate
    };
  };
}

class PacketController {
  constructor(mqttClient, topic, direction) {
    this.openedSockets = new Map();
    this.mqttClient = (0, _asPromise.mqttClientAsPromise)(mqttClient);
    this.topic = topic;
    this.direction = direction;
    this.invertDirection = direction === 'down' ? 'up' : 'down';
  }

  replyIfRequired() {
    return ({
      requiresAck,
      requiresTerminate,
      socketId,
      packetNumber
    }) => {
      const publish = (code, pn) => this.mqttClient.publish(`${this.topic}/tunnel/${this.invertDirection}/${socketId}`, (0, _bufferManagement.applyHeader)(Buffer.alloc(0), code, pn), {
        qos: 1
      }).catch(err => debug(`${this.direction} ${socketId}: ${err.message}`));

      if (requiresAck) publish(_bufferManagement.PacketCodes.Ack, packetNumber);else if (requiresTerminate) publish(_bufferManagement.PacketCodes.Terminate, 0);
    };
  }

  async init(extractSocketId, portNumber) {
    var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;

    info(`${this.direction}: subscribing to ${this.topic}/tunnel/${this.direction}/+`);
    await this.mqttClient.subscribe(`${this.topic}/tunnel/${this.direction}/+`, {
      qos: 1
    });
    _ref = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_ref6 = (_ref7 = (_ref8 = (_ref9 = await (0, _pipeline.fromStream)(this.mqttClient, 'message'), (0, _pipeline.map)(([incomingTopic, buffer]) => ({
      incomingTopic,
      buffer
    }))(_ref9)), (0, _pipeline.map)(withSocketId(extractSocketId))(_ref8)), (0, _pipeline.filter)(msg => !!msg.socketId)(_ref7)), (0, _pipeline.map)(withHeader())(_ref6)), (0, _pipeline.map)(withRequiresAck(this.openedSockets))(_ref5)), (0, _pipeline.map)(withRequiresTerminate(this.openedSockets))(_ref4)), (0, _pipeline.tap)(this.replyIfRequired())(_ref3)), (0, _pipeline.filter)(msg => !msg.requiresTerminate)(_ref2)), (0, _pipeline.forEach)(msg => this[msg.code](msg.socketId, msg.data, msg.packetNumber, portNumber))(_ref);
  }

  rescheudleSocketTimeout(socketId) {
    const socket = this.openedSockets.get(socketId);
    if (!socket) return;
    clearTimeout(socket.timeoutHandler);
    socket.timeoutHandler = setTimeout(() => {
      debug(`${this.direction}: Socket closed due to no mqtt traffic recieved`);
      removeSocket(this.openedSockets, socket);
    }, mqttTimeout);
    return socket;
  }

  publishToMqtt(socket, code, data = Buffer.alloc(0)) {
    const packetNumber = socket.nextPacketNumber++;
    const dataWithHeader = (0, _bufferManagement.applyHeader)(data, code, packetNumber);

    const writeToMqtt = () => {
      if (!this.openedSockets.has(socket.id)) throw new Error(`This socket is gone ${socket.id} for ${packetNumber}`);
      debug(`${this.direction} ${socket.id}: Sending data ${packetNumber}, code: ${code} to topic ${socket.dataTopic}`);
      this.mqttClient.publish(socket.dataTopic, dataWithHeader, {
        qos: 1
      }).catch(err => debug(`${this.direction} ${socket.id} ${err.message}`));
      const handle = setTimeout(writeToMqtt, resentPeriod);
      socket.packetsWaitingAck.set(packetNumber, handle);
    };

    if (!socket.packetsWaitingAck) socket.packetsWaitingAck = new Map();
    if (socket.packetsWaitingAck.size >= backlogCount) socket.pause();
    (0, _promise_helpers.retryUntil)(() => socket.packetsWaitingAck.size < 4, mqttTimeout).then(r => {
      if (r && this.openedSockets.has(socket.id)) {
        socket.resume();
        writeToMqtt();
      }
    });
    return packetNumber;
  }

  async syncPackets(socketId, packetNumber, fn) {
    await (0, _promise_helpers.retryUntil)(() => this.openedSockets.has(socketId));
    const socket = this.openedSockets.get(socketId);
    if (!socket || socket.nextIncomingPacket > packetNumber) return; // old packet - ignore must be a repeat

    await (0, _promise_helpers.retryUntil)(() => socket.nextIncomingPacket === packetNumber);
    if (socket.nextIncomingPacket !== packetNumber) throw new Error(`Expected ${socket.nextIncomingPacket} but got ${packetNumber}`);
    socket.nextIncomingPacket++;
    fn(socket);
  }

  manageSocketEvents(socket, socketId) {
    socket.id = socketId;
    this.rescheudleSocketTimeout(socketId);
    socket.on('data', data => {
      debug(`${this.direction} ${socket.id}: received packet ${socket.nextPacketNumber}, containing ${data.length} bytes on socket`);
      this.publishToMqtt(socket, _bufferManagement.PacketCodes.Data, data);
    });
    socket.on('end', () => {
      this.publishToMqtt(socket, _bufferManagement.PacketCodes.End);
      info(`${this.direction} ${socket.id}: session ended.`);
      debug(`${this.direction} ${socket.id}: received end signal.  Forwarding to mqtt.`);
    });
    socket.on('close', () => {
      this.publishToMqtt(socket, _bufferManagement.PacketCodes.Close);
      debug(`${this.direction} ${socket.id}: received close signal.  Forwarding to mqtt.`);
    });
  }

  reset() {
    debug(`${this.direction} Closing all sockets`);

    for (const s of [...this.openedSockets.values()]) removeSocket(this.openedSockets, s);

    this.openedSockets.clear();
  }

  [_bufferManagement.PacketCodes.End](socketId, data, packetNumber) {
    this.rescheudleSocketTimeout(socketId);
    this.syncPackets(socketId, packetNumber, socket => {
      debug(`${this.direction} ${socketId}: socket end`);
      removeSocket(this.openedSockets, socket);
    });
  }

  [_bufferManagement.PacketCodes.Close](socketId, data, packetNumber) {
    this.rescheudleSocketTimeout(socketId);
    this.syncPackets(socketId, packetNumber, socket => {
      debug(`${this.direction} ${socketId}: socket close`);
      info(`${this.direction} ${socket.id}: session ended.`);
      removeSocket(this.openedSockets, socket);
    });
  }

  [_bufferManagement.PacketCodes.Terminate](socketId) {
    const socket = this.openedSockets.get(socketId);
    if (!socket) return;
    debug(`${this.direction} ${socketId}: socket terminated`);
    removeSocket(this.openedSockets, this.openedSockets.get(socketId));
  }

  [_bufferManagement.PacketCodes.Data](socketId, data, packetNumber) {
    this.rescheudleSocketTimeout(socketId);
    debug(`${this.direction} ${socketId}: received data packed ${packetNumber} containing ${data.length} bytes`);
    this.syncPackets(socketId, packetNumber, socket => {
      debug(`${this.direction} ${socketId}: writing data packet ${packetNumber}, containing ${data.length} bytes, to local socket`);
      socket.write(data);
    });
  }

  [_bufferManagement.PacketCodes.Ack](socketId, data, packetNumber) {
    const socket = this.rescheudleSocketTimeout(socketId);
    debug(`${this.direction} ${socketId}: received ack for data packet ${packetNumber}`);

    if (socket) {
      const timerHandler = socket.packetsWaitingAck.get(packetNumber);
      clearTimeout(timerHandler);
      socket.packetsWaitingAck.delete(packetNumber);
    }
  }

}

exports.PacketController = PacketController;
