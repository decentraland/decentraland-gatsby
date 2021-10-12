export type LimitOptions = {
  min: number
  max: number
  defaultValue: number
}

export const Type = {
  /** CHAR(36): 00000000-0000-0000-0000-000000000000 */
  UUID: 'CHAR(36)',

  /** CHAR(42): 0x0000000000000000000000000000000000000000 */
  Address: 'CHAR(42)',

  /** CHAR(66): 0x0000000000000000000000000000000000000000000000000000000000000000 */
  TransactionHash: 'CHAR(66)',

  /** TEXT: variable unlimited length */
  Text: 'TEXT',

  /** CHAR: fixed-length, blank padded */
  Char: (num: number) => `CHAR(${num})`,

  /** VARCHAR: variable-length with limit */
  Varchar: (num: number) => `VARCHAR(${num})`,

  /** SMALLINT: small-range integer (2 bytes, -32768 to +32767) */
  SmallInt: `SMALLINT`,

  /** INTEGER: typical choice for integer (4 bytes, -2147483648 to +2147483647) */
  Integer: `INTEGER`,

  /** BIGINT: large-range integer (8 bytes, -9223372036854775808 to 9223372036854775807) */
  BigInt: `BIGINT`,

  /** BIGINT: user-specified precision, exact (variable, up to 131072 digits before the decimal point; up to 16383 digits after the decimal point) */
  Decimal: `DECIMAL`,

  /** REAL: variable-precision, inexact (4 bytes, 6 decimal digits precision) */
  Real: `REAL`,

  /** DOUBLE PRECISION: variable-precision, inexact (8 bytes, 15 decimal digits precision) */
  DoublePrecision: `DOUBLE PRECISION`,

  /** SMALLSERIAL: small autoincrementing integer (2 bytes, 1 to 32767) */
  SmallSerial: `SMALLSERIAL`,

  /** SERIAL: autoincrementing integer (4 bytes, 1 to 2147483647) */
  Serial: `SERIAL`,

  /** BIGSERIAL: large autoincrementing integer	(8 bytes, 1 to 9223372036854775807) */
  BigSerial: `BIGSERIAL`,

  Date: `DATE`,
  Time: `TIME WITH TIME ZONE`,
  TimeTZ: `TIME WITHOUT TIME ZONE`,
  TimeStamp: `TIMESTAMP WITH TIME ZONE`,
  TimeStampTZ: `TIMESTAMP WITHOUT TIME ZONE`,

  /** INTERVAL: time interval */
  Interval: `INTERVAL`,

  Boolean: `BOOLEAN`,

  Array: (type: string) => type + '[]',
}
