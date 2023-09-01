import ErrorResponse from './ErrorResponse'

describe(`ErrorResponse.toResponse`, () => {
  test(`should transform an error into a Response object`, () => {
    expect(ErrorResponse.toResponse(new Error('Unexpected Error'))).toEqual({
      status: 500,
      statusText: 'Internal Server Error',
      body: {
        ok: false,
        error: 'Unexpected Error',
        code: 'internal_server_error',
      },
    })
  })

  test(`should map extra props into a Response object`, () => {
    expect(
      ErrorResponse.toResponse(
        Object.assign(new Error('Invalid data received'), {
          status: 400,
          data: { code: 'invalid_data', params: ['param1', 'param2'] },
        })
      )
    ).toEqual({
      status: 400,
      statusText: 'Bad Request',
      body: {
        ok: false,
        error: 'Invalid data received',
        code: 'invalid_data',
        data: {
          params: ['param1', 'param2'],
        },
      },
    })
  })

  test(`should transform a ErroResponse into a Response object`, () => {
    expect(
      ErrorResponse.toResponse(
        new ErrorResponse(404, 'Data not found', {
          code: 'data_not_found',
          params: ['param1', 'param2'],
        })
      )
    ).toEqual({
      status: 404,
      statusText: 'Not Found',
      body: {
        ok: false,
        error: 'Data not found',
        code: 'data_not_found',
        data: {
          params: ['param1', 'param2'],
        },
      },
    })
  })
})
