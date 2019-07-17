import {expect, eventually} from './test_helper'
import {forwardMqttToLocalPort} from '../src/mqtt-to-local-port'
import {forwardLocalPortToMqtt} from '../src/local-port-to-mqtt'
import {recreateAwsAccess, createEchoServer, createClientSocket} from './system_spec_helper'
import debug from 'debug'

const topicName = 'mqttpf-testing'

describe('forward a socket connection over an authorised mqtt tropic', () => {
  let awsAccess
  let echoServer
  let clientSocket
  let capturedData = ''

  before.withTimeout(30000)(async () => {
    if (process.env.DEBUG)
      for (const d of process.env.DEBUG.split(','))
        debug.enable(d)

    debug.enable('mqtt:pf:info')

    capturedData = ''
    awsAccess = await recreateAwsAccess(topicName)

    echoServer = await createEchoServer(9898)
    clientSocket = createClientSocket(d => capturedData += d)

    forwardMqttToLocalPort(awsAccess.clientOut, 9898, topicName)
    inService = forwardLocalPortToMqtt(awsAccess.clientIn, 3456, topicName)
  })

  after.withTimeout(30000)(async () => {
    if (inService)
      inService.then(end => end())

    awsAccess.end()
    echoServer.end()
    clientSocket.end()
  })

  let inService

  it('establishes a port forward over mqtt', async function() {
    this.timeout(10000)
    clientSocket.connect(3456, '127.0.0.1')
    clientSocket.write('alpha')
    return eventually(() => expect(capturedData).to.eq('echo alpha'))
  })
})