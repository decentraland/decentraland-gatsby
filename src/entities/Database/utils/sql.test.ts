import { Model } from 'decentraland-server/dist/Model'
import {
  table,
  conditional,
  SQL,
  columns,
  values,
  objectValues,
  join,
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
  test('should returns an orderd list of values escaped', () => {
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
