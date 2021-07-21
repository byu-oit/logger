import Pino, { LoggerOptions, Logger } from 'pino'

export default function DefaultLogger (options?: LoggerOptions): Logger {
  const isDeployed = process.env.NODE_ENV === 'production'
  return Pino({
    level: (() => {
      switch (process.env.NODE_ENV) {
        case 'production':
          return 'info'
        case 'test':
          return 'silent'
        default:
          return 'debug'
      }
    })(),
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
    prettyPrint: isDeployed ? false : {
      // if in local environment use pretty print logs
      translateTime: 'UTC:yyyy-mm-dd\'T\'HH:MM:ss.l\'Z\'' // show timestamp instead of epoch time
    },
    ...options
  })
}
