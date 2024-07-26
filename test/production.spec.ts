import ava, { TestFn } from 'ava'
import sinon, { SinonFakeTimers } from 'sinon'
import { Logger } from 'pino'
import { ByuLogger } from '../src/logger.js'

interface Context {
  logged: string
  logger: Logger
  clock: SinonFakeTimers
  now: Date
}

const test = ava as TestFn<Context>

test.beforeEach((t) => {
  /* Capture the stdout pipe */
  process.stdout.write = (buffer: string) => {
    t.context.logged += buffer
    return true
  }

  /* Stub the date time */
  const jan1st = new Date(2021, 0, 1)
  t.context.now = jan1st
  t.context.clock = sinon.useFakeTimers(jan1st.getTime())

  process.env.NODE_ENV = 'production'
  t.context.logged = ''
  t.context.logger = ByuLogger()
})

test.afterEach((t) => {
  t.context.clock.restore()
})

test.serial('default logger should default to info level', (t) => {
  t.context.logger.debug('debug does not work')

  t.is(t.context.logger.level, 'info')
  t.is(t.context.logged, '') // no logs should have happened
})

test.serial('default logger displays logs in JSON format', (t) => {
  t.context.logger.info('json works')

  try {
    const parsedLog = JSON.parse(t.context.logged)
    t.truthy(parsedLog.message)
    t.truthy(parsedLog.level)
    t.truthy(parsedLog.time)
  } catch (e) {
    t.log(e)
    t.fail('The log format should be stringified JSON but parsing failed. See the logged error for details.')
  }
})

test.serial('default logger should display info logs', (t) => {
  t.context.logger.info('info works')

  try {
    const parsedLog = JSON.parse(t.context.logged)
    t.is(parsedLog.message, 'info works')
    t.is(parsedLog.level, 'info')
  } catch (e) {
    t.log(e)
    t.fail('The log format should be stringified JSON but parsing failed. See the logged error for details.')
  }
})

test.serial('default logger displays logs with epoch datetime format', (t) => {
  t.context.logger.info('iso date works')

  try {
    const parsedLog = JSON.parse(t.context.logged)
    t.is(parsedLog.time, t.context.now.getTime())
  } catch (e) {
    t.log(e)
    t.fail('The log format should be stringified JSON but parsing failed. See the logged error for details.')
  }
})
