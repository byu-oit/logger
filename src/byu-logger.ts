import Pino, { LevelWithSilent, Logger } from 'pino'
import PinoHttp, { HttpLogger } from 'pino-http'
import uuid from 'uuid'

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
      translateTime: true // in local show timestamp instead of epoch time
    } : false
  })
}

export interface MiddlewareOptions {
  logger: Logger
}

export function loggerMiddleware (input?: MiddlewareOptions): HttpLogger {
  return PinoHttp({
    logger: input?.logger ?? DefaultLogger(),
    genReqId: req => {
      return req.headers['x-amzn-trace-id'] ?? createId() // use the amazon trace id as the request id
    }
  })
}

function createId (): string {
  const id = uuid.v4().replace(/-/g, '')
  const shortId = id.substr(0, 12) + id.substr(13, 3) + id.substr(17)
  return Buffer.from(shortId, 'hex').toString('base64')
}
