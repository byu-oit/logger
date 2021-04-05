import Pino, { LevelWithSilent, Logger } from 'pino'

export interface Options {
  name?: string
  level?: LevelWithSilent | string
}

export default function DefaultLogger (input?: Options): Logger {
  if (input == null) {
    input = {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' // if level is provided use that, if not then set level to 'info' if in non-local environment
    }
  }
  return Pino({
    name: input.name,
    level: input.level,
    messageKey: 'message',
    formatters: {
      level: level => { return { level } } // display the level not the number value of the level
    },
    base: { }, // don't display the process pid, nor hostname
    redact: {
      // redact bearer tokens and JWTs
      paths: ['req.headers.authorization', 'req.headers.assertion', 'req.headers["x-jwt-assertion"]', 'req.headers["x-jwt-assertion-original"]'],
      censor: '***'
    },
    prettyPrint: process.env.NODE_ENV !== 'production' ? {
      // if in local environment use pretty print logs
      translateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\'' // show timestamp instead of epoch time
    } : false
  })
}
