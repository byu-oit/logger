import Pino from 'pino'
import { getLevel, isInstalled } from './util'
import deepmerge from 'deepmerge'

export default function DefaultLogger (options?: Pino.LoggerOptions): Pino.Logger {
  const defaultOptions: Pino.LoggerOptions = {
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
    // if in local environment use pretty print logs
    ...process.env.NODE_ENV !== 'production' && isInstalled('pino-pretty') && {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\'', // show timestamp instead of epoch time
          messageKey: 'message'
        }
      }
    }
  }

  const opts: Pino.LoggerOptions = options == null ? defaultOptions : deepmerge(defaultOptions, options)
  return Pino(opts)
}
