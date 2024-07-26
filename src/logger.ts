import deepmerge from 'deepmerge'
import { Logger, LoggerOptions, pino } from 'pino'
import { getLevel, isInstalled, isProduction } from './util.js'

export function ByuLogger (options?: LoggerOptions): Logger {
  const defaultOptions: LoggerOptions = {
    level: getLevel(process.env.NODE_ENV),
    messageKey: 'message',
    formatters: {
      level: level => ({ level }) // display the level not the number value of the level
    },
    base: { }, // don't display the process pid, nor hostname
    redact: {
      // redact bearer tokens and JWTs
      paths: ['req.headers.authorization', 'req.headers.assertion', 'req.headers["x-jwt-assertion"]', 'req.headers["x-jwt-assertion-original"]'],
      censor: '***'
    },
    // if in local environment and not running tests try to pretty print logs
    // jest and pretty-print don't get along (causes open handles and sometimes doesn't close),
    // so we'll default to not include pretty-print if running tests
    ...!isProduction() && process.env.NODE_ENV !== 'test' && isInstalled('pino-pretty') && {
      transport: {
        target: 'pino-pretty',
        options: { translateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\'' }
      }
    }
  }
  const opts: LoggerOptions = options == null ? defaultOptions : deepmerge(defaultOptions, options)
  return pino(opts)
}

export default ByuLogger
