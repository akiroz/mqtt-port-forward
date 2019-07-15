import {when, then, expect, sinon, eventually} from './test_helper'
import {forwardMqttToLocalPort} from '../src'
import EventEmitter from 'events'
import net from 'net'
import {PacketCodes, applyHeader} from '../src/lib/buffer-management'

const resetPacket = Buffer.from([0, 0, 0, PacketCodes.Reset, 0, 0, 0, 0])
const connectPacket = Buffer.from([0, 0, 0, PacketCodes.Connect, 0, 0, 0, 1])

const dataPacket = (content, number) => applyHeader(Buffer.from(content), PacketCodes.Data, number)
const endPacket = number => applyHeader(Buffer.alloc(0), PacketCodes.End, number)
const closePacket = number => applyHeader(Buffer.alloc(0), PacketCodes.Close, number)
const ackPacket = number => applyHeader(Buffer.alloc(0), PacketCodes.Ack, number)

when('forwardMqttToLocalPort is invoked', () => {
  let onSocketData
  let onSocketEnd
  let onSocketClose
  let server
  let mqttClient
  let capturedSockets
  let socketCreated
  let data
  let clock

  beforeEach(() => {
    data = Buffer.alloc(0)
    capturedSockets = []
    onSocketData = sinon.stub()
    onSocketEnd = sinon.stub()
    onSocketClose = sinon.stub()
    socketCreated = sinon.stub()
    mqttClient = new EventEmitter()
    mqttClient.subscribe = sinon.stub()
    mqttClient.publish = sinon.stub()

    clock = sinon.useFakeTimers()

    forwardMqttToLocalPort(mqttClient, 14567, 'testtopic')

    server = net.createServer({allowHalfOpen: true}, socket => {
      socketCreated()
      capturedSockets.push(socket)
      socket.on('data', d => data = Buffer.concat([data, d]))
      socket.on('data', onSocketData)
      socket.on('end', onSocketEnd)
      socket.on('close', onSocketClose)
    })
    server.listen(14567, '127.0.0.1', () => {})

  })

  afterEach(() => {
    clock.restore()
    server.close()
    capturedSockets.forEach(s => s.destroy())
  })

  then('a reset signal is sent to the mqtt topic', () =>
    expect(mqttClient.publish).to.have.been.calledWith('testtopic/tunnel/down/0', resetPacket))

  when('mqtt topic receives a connection message', () => {
    beforeEach(() => mqttClient.emit('message', 'testtopic/tunnel/up/1', connectPacket))

    then('a socket connection has been established', () =>
      eventually(() => expect(socketCreated).to.have.been.calledOnce))

    when('data is received on the topic', () => {
      beforeEach(() => {
        capturedSockets[0].write('some - data')
      })

      then('data is sent to mqtt topic', () =>
        eventually(() => expect(mqttClient.publish).to.have.been.calledWith('testtopic/tunnel/down/1', dataPacket('some - data', 1))))

      when('no ack is recieved after some time', () => {
        then('the packet is resent', () => {
          return eventually(async () => {
            await expect(mqttClient.publish.getCall(2).args).to.be.deep.eq(['testtopic/tunnel/down/1', dataPacket('some - data', 1), {qos: 1}])
            clock.tick(5000)
            await expect(mqttClient.publish.getCall(3).args).to.be.deep.eq(['testtopic/tunnel/down/1', dataPacket('some - data', 1), {qos: 1}])
          })
        })
      })
    })

    when('data is received out of order', () => {
      beforeEach(() => {
        clock.restore()
        mqttClient.emit('message', 'testtopic/tunnel/up/1', dataPacket('blah-3', 3))
        mqttClient.emit('message', 'testtopic/tunnel/up/1', dataPacket('blah-2', 2))
      })

      then('the data is sent to socket in correct order', async () =>
        eventually(() => expect(data.toString()).to.eq('blah-2blah-3')))
    })

    when('mqtt topic receives a data packet', () => {
      beforeEach(() => mqttClient.emit('message', 'testtopic/tunnel/up/1', dataPacket('blah', 2)))

      then('an ack packet is returned', () =>
        eventually(() => expect(mqttClient.publish).to.have.been.calledWith('testtopic/tunnel/down/1', ackPacket(2))))

      then('the data is received on the socket', () =>
        eventually(() => expect(onSocketData).to.have.been.calledWith(Buffer.from('blah'))))

      when('mqtt topic receives an end signal', () => {
        beforeEach(() => mqttClient.emit('message', 'testtopic/tunnel/up/1', endPacket(3)))

        then('the local socket is closed', () =>
          eventually(() => expect(onSocketEnd).to.have.been.calledOnce))
      })

      when('mqtt topic receives an close signal', () => {
        beforeEach(() => mqttClient.emit('message', 'testtopic/tunnel/up/1', closePacket(3)))

        then('the local socket is closed', () =>
          eventually(() => expect(onSocketEnd).to.have.been.calledOnce))
      })
    })
  })
})
