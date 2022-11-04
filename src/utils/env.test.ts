import { uid } from 'radash/dist/random'

import env, { Env, requiredEnv, setupEnv } from './env'

describe(`env`, () => {
  test(`should return the value if exists`, () => {
    expect(env('NODE_ENV')).toBe('test')
  })
  test(`should return undefined if exists doens't exists`, () => {
    expect(env('MISSING_ENV')).toBe(undefined)
  })
  test(`should return the default value if the environment is not defined`, () => {
    expect(env('MISSING_ENV', 'missing')).toBe('missing')
    expect(env('NODE_ENV', 'missing')).toBe('test')
  })
  test(`should fallback to other frameworks variables`, () => {
    const RANDOM_ENV1 = uid(24)
    const RANDOM_ENV2 = uid(24)
    const RANDOM_ENV3 = uid(24)
    const RANDOM_ENV4 = uid(24)
    setupEnv({
      [Env.DEVELOPMENT]: {
        RANDOM_ENV1: RANDOM_ENV1,
        GATSBY_RANDOM_ENV2: RANDOM_ENV2,
        REACT_APP_RANDOM_ENV3: RANDOM_ENV3,
        STORYBOOK_RANDOM_ENV4: RANDOM_ENV4,
      },
    })

    expect(env('RANDOM_ENV1')).toBe(RANDOM_ENV1)
    expect(env('RANDOM_ENV2')).toBe(RANDOM_ENV2)
    expect(env('RANDOM_ENV3')).toBe(RANDOM_ENV3)
    expect(env('RANDOM_ENV4')).toBe(RANDOM_ENV4)
  })
})

describe(`requiredEnv`, () => {
  test(`should return the value if the environment exists`, () => {
    expect(requiredEnv('NODE_ENV')).toBe('test')
  })
  test(`should fail if the value doens't exists`, () => {
    expect(() => requiredEnv('MISSING_ENV')).toThrowError(
      'Missing "MISSING_ENV" environment variable'
    )
  })
  test(`should fallback to other frameworks variables`, () => {
    const RANDOM_ENV1 = uid(24)
    const RANDOM_ENV2 = uid(24)
    const RANDOM_ENV3 = uid(24)
    const RANDOM_ENV4 = uid(24)
    setupEnv({
      [Env.DEVELOPMENT]: {
        RANDOM_ENV1: RANDOM_ENV1,
        GATSBY_RANDOM_ENV2: RANDOM_ENV2,
        REACT_APP_RANDOM_ENV3: RANDOM_ENV3,
        STORYBOOK_RANDOM_ENV4: RANDOM_ENV4,
      },
    })

    expect(requiredEnv('RANDOM_ENV1')).toBe(RANDOM_ENV1)
    expect(requiredEnv('RANDOM_ENV2')).toBe(RANDOM_ENV2)
    expect(requiredEnv('RANDOM_ENV3')).toBe(RANDOM_ENV3)
    expect(requiredEnv('RANDOM_ENV4')).toBe(RANDOM_ENV4)
  })
})

describe('setupEnv', () => {
  test(`should create new environment variables`, () => {
    expect(env('NODE_ENV')).toBe('test')
    expect(env('MISSING_ENV')).toBe(undefined)
    expect(env('MISSING_ENV', 'missing')).toBe('missing')

    setupEnv({
      [Env.DEVELOPMENT]: {
        MISSING_ENV: 'exists',
      },
    })

    expect(env('NODE_ENV')).toBe('test')
    expect(env('MISSING_ENV')).toBe('exists')
    expect(env('MISSING_ENV', 'missing')).toBe('exists')
  })
})
