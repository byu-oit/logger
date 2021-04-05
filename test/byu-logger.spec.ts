import DefaultLogger from '../src/byu-logger'

const originalProcessEnv = process.env
const originalStdOutWriter = process.stdout.write
const jan1st = new Date(2021, 0, 1)
const dateNowStub = jest.fn(() => jan1st.getTime())
const realDateNow = Date.now.bind(global.Date)
let logged: string = ''

beforeEach(() => {
  logged = ''
  global.Date.now = dateNowStub
})

afterEach(() => {
  process.env = originalProcessEnv
  process.stdout.write = originalStdOutWriter
  global.Date.now = realDateNow
})

function captureStdoutLogs () {
  return (buffer: string): boolean => {
    logged = `${logged}${buffer}`
    return true
  }
}

describe('In local env', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'local'
  })

  test('default logger should default to debug level', () => {
    process.stdout.write = captureStdoutLogs()

    const logger = DefaultLogger()
    logger.debug('debug works')

    expect(logger.level).toEqual('debug')
    expect(logged).toContain('DEBUG') // must contain the debug level
    expect(logged).toContain('debug works') // must contain the message
  })

  test('default logger should still display info', () => {
    process.stdout.write = captureStdoutLogs()

    const logger = DefaultLogger()
    logger.info('info works')

    expect(logged).toContain('INFO') // must contain the info level
    expect(logged).toContain('info works') // must contain the message
  })

  test('default logger displays logs with iso datetime format', () => {
    process.stdout.write = captureStdoutLogs()

    const logger = DefaultLogger()
    logger.info('iso date works')

    expect(logged).toContain(`[${jan1st.toISOString()}]`)
  })

  test('default logger displays logs in pretty printed format', () => {
    process.stdout.write = captureStdoutLogs()

    const logger = DefaultLogger()
    logger.info('pretty print works')

    expect(logged).not.toContain('{')
  })
})

describe('In production env', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'production'
  })

  test('default logger should default to info level', () => {
    process.stdout.write = captureStdoutLogs()

    const logger = DefaultLogger()
    logger.debug('debug does not work')

    expect(logger.level).toEqual('info')
    expect(logged).toEqual('') // no logs should have happened
  })

  test('default logger displays logs in JSON format', () => {
    process.stdout.write = captureStdoutLogs()

    const logger = DefaultLogger()
    logger.info('json works')

    expect(logged).toContain('{')
    const jsonLogEntry = JSON.parse(logged)
    expect(jsonLogEntry.message).toBeTruthy()
    expect(jsonLogEntry.level).toBeTruthy()
    expect(jsonLogEntry.time).toBeTruthy()
  })

  test('default logger should display info logs', () => {
    process.stdout.write = captureStdoutLogs()

    const logger = DefaultLogger()
    logger.info('info works')

    const jsonLogEntry = JSON.parse(logged)
    expect(jsonLogEntry.message).toEqual('info works')
    expect(jsonLogEntry.level).toEqual('info')
  })

  test('default logger displays logs with epoch datetime format', () => {
    process.stdout.write = captureStdoutLogs()

    const logger = DefaultLogger()
    logger.info('iso date works')

    const jsonLogEntry = JSON.parse(logged)
    expect(jsonLogEntry.time).toEqual(jan1st.getTime())
  })
})
