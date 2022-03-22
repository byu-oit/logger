import DefaultLogger from '../src/logger'
import Pino from 'pino'

const jan1st = new Date(2021, 0, 1)
const dateNowStub = jest.fn(() => jan1st.getTime())
const realDateNow = Date.now.bind(global.Date)
let logged: string = ''
let logger: Pino.Logger

beforeAll(() => {
  process.stdout.write = (buffer: string) => {
    logged += buffer
    return true
  }
})

beforeEach(() => {
  logged = ''
  global.Date.now = dateNowStub
})

afterEach(() => {
  global.Date.now = realDateNow
})

// Pino v7+ implements transports which are problematic in Jest environments.
// Docs: https://github.com/pinojs/pino-pretty#usage-with-jest
// describe('In local env', () => {
//   beforeEach(() => {
//     process.env.NODE_ENV = 'local'
//     logger = DefaultLogger()
//   })
//
//   test('default logger should default to debug level', () => {
//     logger.debug('debug works')
//
//     expect(logger.level).toEqual('debug')
//     expect(logged).toContain('DEBUG') // must contain the debug level
//     expect(logged).toContain('debug works') // must contain the message
//   })
//
//   test('default logger should still display info', () => {
//     logger.info('info works')
//
//     expect(logged).toContain('INFO') // must contain the info level
//     expect(logged).toContain('info works') // must contain the message
//   })
//
//   test('default logger displays logs with iso datetime format', () => {
//     logger.info('iso date works')
//
//     expect(logged).toContain(`[${jan1st.toISOString()}]`)
//   })
//
//   test('default logger displays logs in pretty printed format', () => {
//     logger.info('pretty print works')
//
//     expect(logged).not.toContain('{')
//   })
//
//   // TODO - Figure out how to stub `require` to throw a fake MODULE_NOT_FOUND error
//   // test('default logger does not pretty print if pino-pretty is not installed', async () => {
//   //   proxyquire('../src/logger', {
//   //     'pino-pretty': null
//   //   })
//   //
//   //   const logger = DefaultLogger()
//   //   logger.info('pretty print disabled')
//   //   expect(logged).toContain('{')
//   // })
// })

describe('In production env', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production'
    logger = DefaultLogger()
  })

  test('default logger should default to info level', () => {
    logger.debug('debug does not work')

    expect(logger.level).toEqual('info')
    expect(logged).toEqual('') // no logs should have happened
  })

  test('default logger displays logs in JSON format', () => {
    logger.info('json works')

    expect(logged).toContain('{')
    const jsonLogEntry = JSON.parse(logged)
    expect(jsonLogEntry.message).toBeTruthy()
    expect(jsonLogEntry.level).toBeTruthy()
    expect(jsonLogEntry.time).toBeTruthy()
  })

  test('default logger should display info logs', () => {
    logger.info('info works')

    const jsonLogEntry = JSON.parse(logged)
    expect(jsonLogEntry.message).toEqual('info works')
    expect(jsonLogEntry.level).toEqual('info')
  })

  test('default logger displays logs with epoch datetime format', () => {
    logger.info('iso date works')

    const jsonLogEntry = JSON.parse(logged)
    expect(jsonLogEntry.time).toEqual(jan1st.getTime())
  })
})

describe('In test env', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test'
    logger = DefaultLogger()
  })

  test('default logger should default to silent level', () => {
    logger.debug('debug does not work')

    expect(logger.level).toEqual('silent')
    expect(logged).toEqual('') // no logs should have happened
  })

  test('default logger should not display logs', () => {
    logger.info('info works')

    expect(logged).toEqual('')
  })
})
