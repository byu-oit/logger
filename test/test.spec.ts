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

test.before((t) => {
  /* Stub the date time */
  const jan1st = new Date(2021, 0, 1)
  t.context.now = jan1st
  t.context.clock = sinon.useFakeTimers(jan1st.getTime())
})

test.beforeEach((t) => {
  /* Capture the stdout pipe */
  process.stdout.write = (buffer: string) => {
    t.context.logged += buffer
    return true
  }

  process.env.NODE_ENV = 'test'
  t.context.logged = ''
  t.context.logger = ByuLogger()
})

test.after((t) => {
  t.context.clock.restore()
})

test.serial('default logger should default to silent level', (t) => {
  t.context.logger.debug('debug does not work')

  t.is(t.context.logger.level, 'silent')
  t.is(t.context.logged, '') // no logs should have happened
})

test.serial('default logger should not display logs', (t) => {
  t.context.logger.info('info works')

  t.is(t.context.logged, '')
})
