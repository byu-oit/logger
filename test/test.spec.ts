import { test, mock } from 'node:test'
import assert from 'node:assert'
import { Logger } from 'pino'
import { ByuLogger } from '../src/logger.js'

interface Context {
  logged: string
  logger: Logger
}

const context: Context = {
  logged: '',
  logger: ByuLogger()
}

test.before((t) => {
  /* Stub the date time */
  mock.timers.enable({ apis: ['Date'] })
  mock.timers.setTime(1000)
})

test.beforeEach((t) => {
  /* Capture the stdout pipe */
  process.stdout.write = (buffer: string) => {
    context.logged += buffer
    return true
  }
  process.env.NODE_ENV = 'test'
  context.logged = ''
  context.logger = ByuLogger()
})

test.after((t) => {
  mock.timers.reset()
})

void test('default logger should default to silent level', (t) => {
  context.logger.debug('debug does not work')
  assert.equal(context.logger.level, 'silent')
  assert.equal(context.logged, '') // no logs should have happened
})

void test('default logger should not display logs', (t) => {
  context.logger.info('info works')
  assert.equal(context.logged, '')
})
