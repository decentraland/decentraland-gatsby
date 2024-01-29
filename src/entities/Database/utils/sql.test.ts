import { Model } from 'decentraland-server/dist/Model'

import {
  SQL,
  columns,
  columnsLabels,
  compareTableColumns,
  conditionValuesCompare,
  conditional,
  getCompareQuery,
  join,
  objectValues,
  raw,
  setColumns,
  table,
  values,
} from './sql'

describe('table', () => {
  test('should returns the quoted table name of a model', () => {
    const sql = table(
      class Table extends Model<any> {
        static tableName = 'table_name'
      }
    )

    expect(sql.text).toBe('"table_name"')
    expect(sql.values).toEqual([])
  })
})

describe('conditional', () => {
  test('should returns the sql if the condition is true', () => {
    const sql = conditional(true, SQL`SELECT RANDOM()`)

    expect(sql.text).toBe('SELECT RANDOM()')
    expect(sql.values).toEqual([])
  })

  test('should returns an empty sql if the condition is false', () => {
    const sql = conditional(false, SQL`SELECT RANDOM()`)

    expect(sql.text).toBe('')
    expect(sql.values).toEqual([])
  })
})

describe('columns', () => {
  test('should returns the list of culums quoted', () => {
    const sql = columns(['id', 'name', 'email'])

    expect(sql.text).toBe('("id", "name", "email")')
    expect(sql.values).toEqual([])
  })
})

describe('values', () => {
  test('should returns the list of values escaped', () => {
    const sql = values([12345, 'UserName', 'email@example.com'])

    expect(sql.text).toBe('($1, $2, $3)')
    expect(sql.values).toEqual([12345, 'UserName', 'email@example.com'])
  })
})

describe('join', () => {
  test('should returns the joined version of an sql using a comma (,)', () => {
    const random = Math.random()
    const sql = join([SQL`1`, SQL`${random}`])
    expect(sql.text).toBe('1, $1')
    expect(sql.values).toEqual([random])
  })

  test('should returns the joined version of an sql using a custom separator', () => {
    const random = Math.random()
    const sql = join([SQL`(1`, SQL`${random})`], SQL`), (`)
    expect(sql.text).toBe('(1), ($1)')
    expect(sql.values).toEqual([random])
  })
})

describe('objectValues', () => {
  test('should returns an ordered list of values escaped', () => {
    const sql = objectValues(
      ['id', 'name', 'email'],
      [
        {
          id: 1,
          name: 'name1',
          email: 'email1@example.com',
        },
        {
          id: 2,
          name: 'name2',
          email: 'email2@example.com',
          extraprops: 'secret',
        },
        {
          extraprops: 'secret',
          email: 'email3@example.com',
          name: 'name3',
          id: 3,
        },
      ]
    )

    expect(sql.text).toBe('($1, $2, $3), ($4, $5, $6), ($7, $8, $9)')
    expect(sql.values).toEqual([
      1,
      'name1',
      'email1@example.com',
      2,
      'name2',
      'email2@example.com',
      3,
      'name3',
      'email3@example.com',
    ])
  })
})

describe('columnsLabels', () => {
  test('should returns an ordered list of keys escaped', () => {
    const sql = columnsLabels(['id', 'name', 'email'])
    expect(sql.text).toBe('("id", "name", "email")')
  })
})

describe('setColumns', () => {
  test('should returns a set of columns with values', () => {
    const sql = setColumns(['id', 'name', 'email'], {
      id: 1,
      name: 'name1',
      email: 'email1@example.com',
    })
    expect(sql.text).toBe('"id" = $1, "name" = $2, "email" = $3')
    expect(sql.values).toEqual([1, 'name1', 'email1@example.com'])
  })
})

describe('getCompareQuery', () => {
  const values: { [key: string]: any } = {
    id: 1,
    name: 'name1',
    emails: ['email1@example.com', 'email2@example.com', 'email3@example.com'],
  }
  test('should returns a compare with a key and a number', () => {
    const sql = getCompareQuery('id', values['id'])
    expect(sql.text).toBe('"id" = $1')
    expect(sql.values).toEqual([1])
  })
  test('should returns a compare with a key and a string', () => {
    const sql = getCompareQuery('name', values['name'])
    expect(sql.text).toBe('"name" = $1')
    expect(sql.values).toEqual(['name1'])
  })
  test('should returns a compare with a key and an array', () => {
    const sql = getCompareQuery('emails', values['emails'])
    expect(sql.text).toBe('"emails" IN ($1, $2, $3)')
    expect(sql.values).toEqual([
      'email1@example.com',
      'email2@example.com',
      'email3@example.com',
    ])
  })
})

describe('conditionValuesCompare', () => {
  test('should returns a condition with compared string, number or array', () => {
    const values: { [key: string]: any } = {
      id: 1,
      name: 'name1',
      emails: [
        'email1@example.com',
        'email2@example.com',
        'email3@example.com',
      ],
    }
    const keys = Object.keys(values) as string[]
    const sql = conditionValuesCompare(keys, values)

    expect(sql.text).toBe(
      '"id" = $1 AND "name" = $2 AND "emails" IN ($3, $4, $5)'
    )
    expect(sql.values).toEqual([
      1,
      'name1',
      'email1@example.com',
      'email2@example.com',
      'email3@example.com',
    ])
  })
})

describe('compareTableColumns', () => {
  test('should returns a compare of columns between 2 tables', () => {
    const sql = compareTableColumns(raw('"table1"'), raw('"table2"'), [
      'id',
      'name',
      'email',
    ])
    expect(sql.text).toBe(
      '"table1"."id" = "table2"."id" AND "table1"."name" = "table2"."name" AND "table1"."email" = "table2"."email"'
    )
  })
})
