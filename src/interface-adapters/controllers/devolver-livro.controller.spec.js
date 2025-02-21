const { ZodError } = require("zod")
const httpResponse = require("../../helpers/http.response")
const { Either, AppError } = require("../../shared/errors")
const devolverLivroController = require("./devolver-livro.controller")

describe('Devolver livro controller', () => {
  const devolverLivroUseCase = jest.fn()
  test('Deve retornar uma mensagem ao devolver um livro informando uma multa ou não', async () => {
    devolverLivroUseCase.mockResolvedValue(Either.Right('Multa por atraso: R$0'))
    const httpRequest = {
      body: {
        data_devolucao: '2024-02-14'
      },
      params: {
        emprestimo_id: 1
      }
    }

    const response = await devolverLivroController({
      devolverLivroUseCase,
      httpRequest
    })

    expect(response).toEqual(httpResponse(200, 'Multa por atraso: R$0'))
    expect(devolverLivroUseCase).toHaveBeenCalledWith({
      ...httpRequest.body,
      ...httpRequest.params
    })
    expect(devolverLivroUseCase).toHaveBeenCalledTimes(1)

  })

  test('Deve retornar um erro se o devolverLivroUseCase e httpRequest não forem fornecidos', async () => {
    await expect(() => devolverLivroController({})).rejects.toThrow(new AppError(AppError.dependecias))
  })

  test('Deve retornar um erro do zod validator se der erro na validação dos dados', async function(){
    const httpRequest = {
      body: {}
    }

    expect(() => devolverLivroController({ devolverLivroUseCase, httpRequest})).rejects.toBeInstanceOf(ZodError)
  })

})