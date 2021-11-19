import Pino from 'pino'

const ENV_LEVELS: Record<string, Pino.LevelWithSilent> = {
  production: 'info',
  test: 'silent',
  default: 'debug'
}

export function getLevel (level: string = 'default'): Pino.LevelWithSilent {
  return ENV_LEVELS[level] ?? ENV_LEVELS.default
}

export function isInstalled (name: string): boolean {
  try {
    return require(name) != null
  } catch (e) {
    if (isRecord(e) && hasProperty(e, 'code') && e.code === 'MODULE_NOT_FOUND') {
      return false
    }
    throw e
  }
}

export function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function hasProperty<T = unknown> (value: T, prop: string | number | symbol): prop is keyof T {
  return prop in value
}
