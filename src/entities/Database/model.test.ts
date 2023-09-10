import { Model } from './model'

Model.tableName = 'testing_table'

const namedQuery = jest.spyOn(Model, 'namedQuery')
const namedRowCount = jest.spyOn(Model, 'namedRowCount')

beforeEach(() => {
  namedQuery.mockReset()
  namedRowCount.mockReset()
})

afterAll(() => {
  namedQuery.mockRestore()
  namedRowCount.mockRestore()
})

describe(`Model.createOne`, () => {
  test(`should call Model.createMany`, async () => {
    namedRowCount.mockResolvedValue(1)
    expect(await Model.createOne<any>({ id: 123 })).toBe(1)
    expect(namedRowCount.mock.calls.length).toBe(1)
    expect(namedQuery.mock.calls.length).toBe(0)

    const [name, sql] = namedRowCount.mock.calls[0]
    expect(name).toBe('testing_table_create_many')
    expect(sql.values).toEqual([123])
    expect(sql.text.trim().replace(/\s{2,}/gi, ' ')).toEqual(
      `
        INSERT INTO "testing_table" ("id")
          VALUES ($1)
      `
        .trim()
        .replace(/\s{2,}/gi, ' ')
    )
  })
})

describe(`Model.createMany`, () => {
  test(`should fail if receive a non word character as key`, async () => {
    await expect(
      Model.createMany<any>([{ 'invalid field': 123 }])
    ).rejects.toThrow()
    expect(namedRowCount.mock.calls.length).toBe(0)
    expect(namedQuery.mock.calls.length).toBe(0)
  })

  test(`should skip query if receive an empty list`, async () => {
    expect(await Model.createMany<any>([])).toBe(0)
    expect(namedRowCount.mock.calls.length).toBe(0)
    expect(namedQuery.mock.calls.length).toBe(0)
  })

  test(`should run a bulk query`, async () => {
    namedRowCount.mockResolvedValue(2)
    expect(await Model.createMany<any>([{ id: 123 }, { id: 456 }])).toBe(2)
    expect(namedRowCount.mock.calls.length).toBe(1)
    expect(namedQuery.mock.calls.length).toBe(0)

    const [name, sql] = namedRowCount.mock.calls[0]
    expect(name).toBe('testing_table_create_many')
    expect(sql.values).toEqual([123, 456])
    expect(sql.text.trim().replace(/\s{2,}/gi, ' ')).toEqual(
      `
        INSERT INTO "testing_table" ("id")
          VALUES ($1), ($2)
      `
        .trim()
        .replace(/\s{2,}/gi, ' ')
    )
  })
})

describe(`Model.updateTo`, () => {
  test(`should fail if receive a non word character as key`, async () => {
    await expect(
      Model.updateTo<any>({ 'invalid field': 123 }, { valid_key: 123 })
    ).rejects.toThrow()
    await expect(
      Model.updateTo<any>({ valid_key: 123 }, { 'invalid field': 123 })
    ).rejects.toThrow()
    expect(namedRowCount.mock.calls.length).toBe(0)
    expect(namedQuery.mock.calls.length).toBe(0)
  })

  test(`should fail if receive an empty condition`, async () => {
    await expect(() => Model.updateTo<any>({}, {})).rejects.toThrow()
    expect(namedRowCount.mock.calls.length).toBe(0)
    expect(namedQuery.mock.calls.length).toBe(0)
  })

  test(`should skip query if receive and empty update`, async () => {
    expect(await Model.updateTo<any>({}, { id: 123 })).toBe(0)
    expect(namedRowCount.mock.calls.length).toBe(0)
    expect(namedQuery.mock.calls.length).toBe(0)
  })

  test(`should run an update query and return how many records were updated`, async () => {
    namedRowCount.mockResolvedValueOnce(20)
    expect(
      await Model.updateTo<any>(
        { name: 'new name' },
        { id: 123, name: null, labels: ['label1', 'label2'] }
      )
    ).toBe(20)
    expect(namedRowCount.mock.calls.length).toBe(1)
    expect(namedQuery.mock.calls.length).toBe(0)

    const [name, sql] = namedRowCount.mock.calls[0]
    expect(name).toBe('testing_table_update_to_by_id_name_labels')
    expect(sql.values).toEqual(['new name', 123, 'label1', 'label2'])
    expect(sql.text.trim().replace(/\s{2,}/gi, ' ')).toBe(
      `
        UPDATE "testing_table"
          SET
            "name" = $1
          WHERE
            "id" = $2
            AND "name" IS NULL
            AND "labels" IN ($3, $4)
      `
        .trim()
        .replace(/\s{2,}/gi, ' ')
    )
  })

  test(`should skip query if receive and empty condition prop`, async () => {
    expect(await Model.updateTo<any>({ name: 'new name' }, { id: [] })).toBe(0)
    expect(namedRowCount.mock.calls.length).toBe(0)
    expect(namedQuery.mock.calls.length).toBe(0)
  })
})

describe(`Model.updateMany`, () => {
  test(`should fail if receive a non word character as key`, async () => {
    await expect(
      Model.updateMany<any>([{ 'invalid field': 123 }], ['valid_key'])
    ).rejects.toThrow()
    await expect(
      Model.updateMany<any>([{ valid_key: 123 }], ['invalid field'])
    ).rejects.toThrow()
    expect(namedRowCount.mock.calls.length).toBe(0)
    expect(namedQuery.mock.calls.length).toBe(0)
  })

  test(`should fails if doesn't receive any key`, async () => {
    await expect(() => Model.updateMany<any>([{}], [])).rejects.toThrow()
    expect(namedRowCount.mock.calls.length).toBe(0)
    expect(namedQuery.mock.calls.length).toBe(0)
  })

  test(`shoudl skip query if get an empty list of updates`, async () => {
    expect(await Model.updateMany<any>([], [])).toBe(0)
    expect(namedRowCount.mock.calls.length).toBe(0)
    expect(namedQuery.mock.calls.length).toBe(0)
  })

  test(`should run a bulk update`, async () => {
    namedRowCount.mockResolvedValueOnce(2)
    const updates = [
      {
        id: 123,
        name: 'new name 1',
        description: 'new description 1',
      },
      {
        id: 456,
        name: 'new name 2',
        description: 'new description 2',
      },
    ]

    await expect(await Model.updateMany<any>(updates, ['id'])).toBe(2)
    expect(namedQuery.mock.calls.length).toBe(0)
    expect(namedRowCount.mock.calls.length).toBe(1)

    const [name, sql] = namedRowCount.mock.calls[0]
    expect(name).toBe('testing_table_update_many_by_id')
    expect(sql.values).toEqual([
      123,
      'new name 1',
      'new description 1',
      456,
      'new name 2',
      'new description 2',
    ])
    expect(sql.text.trim().replace(/\s{2,}/gi, ' ')).toBe(
      `
        UPDATE "testing_table"
          SET
            "name" = "_tmp_"."name",
            "description" = "_tmp_"."description"
            , "updated_at" = NOW()
          FROM (values ($1, $2, $3), ($4, $5, $6)) AS "_tmp_" ("id", "name", "description")
          WHERE
            "testing_table"."id" = "_tmp_"."id"
      `
        .trim()
        .replace(/\s{2,}/gi, ' ')
    )
  })

  test(`should limit the update to the fields on the last params`, async () => {
    namedRowCount.mockResolvedValueOnce(2)
    const now = new Date()
    const updates = [
      {
        id: 123,
        name: 'name 1',
        description: 'new description 1',
        created_at: now,
        updated_at: now,
      },
      {
        id: 456,
        name: 'name 2',
        description: 'new description 2',
        created_at: now,
        updated_at: now,
      },
    ]

    await expect(
      await Model.updateMany<any>(updates, ['id'], ['description'])
    ).toBe(2)
    expect(namedQuery.mock.calls.length).toBe(0)
    expect(namedRowCount.mock.calls.length).toBe(1)

    const [name, sql] = namedRowCount.mock.calls[0]
    expect(name).toBe('testing_table_update_many_by_id')
    expect(sql.values).toEqual([
      123,
      'new description 1',
      456,
      'new description 2',
    ])
    expect(sql.text.trim().replace(/\s{2,}/gi, ' ')).toBe(
      `
        UPDATE "testing_table"
          SET
            "description" = "_tmp_"."description"
            , "updated_at" = NOW()
          FROM (values ($1, $2), ($3, $4)) AS "_tmp_" ("id", "description")
          WHERE
            "testing_table"."id" = "_tmp_"."id"
      `
        .trim()
        .replace(/\s{2,}/gi, ' ')
    )
  })
})
