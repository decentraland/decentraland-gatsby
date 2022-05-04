import { FeatureFlagsResult } from '@dcl/feature-flags'
import FeatureFlags from './FeatureFlags'

const empty = new FeatureFlags({ flags: {}, variants: {} })

const ff = new FeatureFlags({
  flags: {
    flag_switch: true,
    flag_disabled: false,
    flag_variant: true,
    flag_string_variant: true,
    flag_json_variant: true,
  },
  variants: {
    flag_disabled: {
      name: 'abc',
      enabled: false,
    },
    flag_variant: {
      name: 'xyz',
      enabled: true,
    },
    flag_string_variant: {
      name: 'string',
      enabled: true,
      payload: {
        type: 'string',
        value: '123456789',
      },
    },
    flag_json_variant: {
      name: 'json',
      enabled: true,
      payload: {
        type: 'json',
        value: `{"key":"value"}`,
      },
    },
  },
})

test(`FeatureFlags.list`, () => {
  expect(new FeatureFlags(empty).list()).toEqual([])
  expect(new FeatureFlags(ff).list()).toEqual([
    'flag_switch',
    'flag_variant',
    'flag_string_variant',
    'flag_json_variant',
    'flag_variant:xyz',
    'flag_string_variant:string',
    'flag_json_variant:json',
  ])
})

test(`FeatureFlags.enabled`, () => {
  expect(new FeatureFlags(ff).list()).toEqual([
    'flag_switch',
    'flag_variant',
    'flag_string_variant',
    'flag_json_variant',
    'flag_variant:xyz',
    'flag_string_variant:string',
    'flag_json_variant:json',
  ])
})
