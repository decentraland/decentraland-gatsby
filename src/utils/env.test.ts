import { uid } from 'radash'

import env, { Env, requiredEnv, setupEnv } from './env'

// First not empty environment variable
const EXISTING_ENV_NAME = Object.keys(process.env).find(
  (name) => !!process.env[name]
)!
const MISSING_ENV_NAME = 'MISSING_ENV_' + String((Math.random() * 1000) | 0)

describe(`env`, () => {
  test(`should return the value if exists`, () => {
    expect(env(EXISTING_ENV_NAME)).toBe(process.env[EXISTING_ENV_NAME])
  })
  test(`should return undefined if exists doens't exists`, () => {
    expect(env(MISSING_ENV_NAME)).toBe(undefined)
  })
  test(`should return the default value if the environment is not defined`, () => {
    expect(env(EXISTING_ENV_NAME, 'missing')).toBe(
      process.env[EXISTING_ENV_NAME]
    )
    expect(env(MISSING_ENV_NAME, 'missing')).toBe('missing')
  })
  test(`should fallback to other frameworks variables`, () => {
    const RANDOM_ENV1 = uid(24)
    const RANDOM_ENV2 = uid(24)
    const RANDOM_ENV3 = uid(24)
    const RANDOM_ENV4 = uid(24)
    setupEnv({
      [Env.LOCAL]: {
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
    expect(requiredEnv(EXISTING_ENV_NAME)).toBe(process.env[EXISTING_ENV_NAME])
  })
  test(`should fail if the value doens't exists`, () => {
    expect(() => requiredEnv(MISSING_ENV_NAME)).toThrow(
      `Missing "${MISSING_ENV_NAME}" environment variable`
    )
  })
  test(`should fallback to other frameworks variables`, () => {
    const RANDOM_ENV1 = uid(24)
    const RANDOM_ENV2 = uid(24)
    const RANDOM_ENV3 = uid(24)
    const RANDOM_ENV4 = uid(24)
    setupEnv({
      [Env.LOCAL]: {
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
    expect(env(EXISTING_ENV_NAME)).toBe(process.env[EXISTING_ENV_NAME])
    expect(env(MISSING_ENV_NAME)).toBe(undefined)
    expect(env(MISSING_ENV_NAME, 'missing')).toBe('missing')

    setupEnv({
      [Env.LOCAL]: {
        [MISSING_ENV_NAME]: 'exists',
      },
    })

    expect(env(EXISTING_ENV_NAME)).toBe(process.env[EXISTING_ENV_NAME])
    expect(env(MISSING_ENV_NAME)).toBe('exists')
    expect(env(MISSING_ENV_NAME, 'missing')).toBe('exists')
  })
})
