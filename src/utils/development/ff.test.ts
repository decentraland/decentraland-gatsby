import { listFeatureFlags } from './ff'

test(`listFeatureFlags`, () => {
  const ff = {
    flags: {
      flag_switch: true,
      flag_disabled: false,
      flag_variant: true,
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
    },
  }

  expect(listFeatureFlags({ flags: {}, variants: {} })).toEqual([])
  expect(listFeatureFlags(ff)).toEqual([
    'flag_switch',
    'flag_variant',
    'flag_variant:xyz',
  ])
})
