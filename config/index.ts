import type Default from './default'
import type Development from './development'

type Objectype = Record<string, unknown>

export const util = {
  isObject<T>(value: T): value is T & Objectype {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  },
  merge<T extends Objectype, U extends Objectype>(target: T, source: U): T & U {
    Object.keys(source).forEach((key) => {
      const targetValue = target[key]
      const sourceValue = source[key]
      if (this.isObject(targetValue) && this.isObject(sourceValue)) {
        Object.assign(sourceValue, this.merge(targetValue, sourceValue))
      }
    })

    return { ...target, ...source }
  },
}

export type Config = typeof Default & typeof Development

export const configuration = async (): Promise<Config> => {
  const { default: config } = await import('./default')
  const { default: environment } = <{ default: typeof Development }>await import(`./${process.env.NODE_ENV || 'development'}`)

  return util.merge(config, environment)
}
