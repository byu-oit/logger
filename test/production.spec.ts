import { describe, mock, test } from 'node:test'
import * as assert from 'node:assert'
import { Logger } from 'pino'
import { ByuLogger } from '../src/logger.js'

interface Context {
  logged: string
  logger: Logger
  now: Date
}

const ctx: Context = {
  logged: '',
  logger: ByuLogger(),
  now: new Date(1000)
}

test.before((t) => {
  /* Stub the date time */
  mock.timers.enable({ apis: ['Date'] })
  mock.timers.setTime(1000)
})

test.beforeEach((t) => {
  /* Capture the stdout pipe */
  process.stdout.write = (buffer: string) => {
    ctx.logged += buffer
    return true
  }

  process.env.NODE_ENV = 'test'
  ctx.logged = ''
  ctx.logger = ByuLogger()
  ctx.now = new Date(1000)
})

test.after((t) => {
  mock.timers.reset()
})

void describe('Default logger level is info', () => {
  void test('default logger should default to info level', (context) => {
    try {
      ctx.logger.debug('debug does not work')
      assert.equal(ctx.logger.level, 'info')
      assert.equal(ctx.logged, '') // no logs should have happened
    } catch (e) {
      console.log(e)
      assert.fail('Logger level not info')
    }
  })
})

void describe('Default logger in JSON', () => {
  void test('default logger displays logs in JSON format', (context) => {
    ctx.logger.info('json works')
    try {
      const parsedLog = JSON.parse(ctx.logged)
      assert.ok(parsedLog.message)
      assert.ok(parsedLog.level)
      assert.ok(parsedLog.time)
    } catch (e) {
      console.log(e)
      assert.fail('No json output')
    }
  })
})

void describe('Default logger contains "info"', () => {
  void test('default logger should display info logs', (context) => {
    ctx.logger.info('info works')
    try {
      const parsedLog = JSON.parse(ctx.logged)
      assert.equal(parsedLog.message, 'info works')
      assert.equal(parsedLog.level, 'info')
    } catch (e) {
      console.log(e)
      assert.fail('Incorrect logger level')
    }
  })
})

void describe('Display correct date format', () => {
  void test('default logger displays logs with epoch datetime format', (context) => {
    ctx.logger.info('iso date works')
    try {
      const parsedLog = JSON.parse(ctx.logged)
      assert.equal(parsedLog.time, Date.now())
    } catch (e) {
      console.log(e)
      assert.fail('Incorrect date format logged')
    }
  })
})
