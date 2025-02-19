const { ZodError } = require("zod")
const httpResponse = require("../../helpers/http.response")
const { Either, AppError } = require("../../shared/errors")
const cadastrarLivroController = require("./cadastrar-livro.controller")

describe('Cadastrar Livro Controller', () => {
  const cadastrarLivroUseCase = jest.fn()
  test('Deve retornar um httpResponse 201 e null se o livro for cadastrado com sucesso', async () => {
    cadastrarLivroUseCase.mockResolvedValue(Either.Right(null))
    const httpRequest = {
      body: {
        nome: 'qualquer_nome',
        quantidade: 1,
        autor: 'qualquer_autor',
        genero: 'qualquer_genero',
        ISBN: 'qualquer_ISBN'
      }
    }

    const response = await cadastrarLivroController({
      cadastrarLivroUseCase,
      httpRequest
    })

    expect(response).toEqual(httpResponse(201, null))
    expect(cadastrarLivroUseCase).toHaveBeenCalledWith(httpRequest.body)
    expect(cadastrarLivroUseCase).toHaveBeenCalledTimes(1)

  })

  test('Deve retornar um httpResponse 400 e null e message se o Livro não for cadastrado com sucesso', async () => {
    cadastrarLivroUseCase.mockResolvedValue(Either.Left({message: 'validacao_invalida'}))
    const httpRequest = {
      body: {
        nome: 'qualquer_nome',
        quantidade: 1,
        autor: 'qualquer_autor',
        genero: 'qualquer_genero',
        ISBN: 'qualquer_ISBN'
      }
    }

    const response = await cadastrarLivroController({
      cadastrarLivroUseCase,
      httpRequest
    })

    expect(response).toEqual(httpResponse(400, 'validacao_invalida'))
    expect(cadastrarLivroUseCase).toHaveBeenCalledWith(httpRequest.body)
    expect(cadastrarLivroUseCase).toHaveBeenCalledTimes(1)
  })

  test('Deve retornar um throw appError se o cadastrarLivroUseCase e o httpRequest não form fornecidos', async () => {
    await expect(() => cadastrarLivroController({})).rejects.toThrow(new AppError(AppError.dependecias))
  })

  test('Deve retornar um erro do zod validator se der erro na validação dos dados obrigatórios', async () => {
    const httpRequest = {
      body: {}
    }
    await expect(() => cadastrarLivroController({cadastrarLivroUseCase, httpRequest})).rejects.toBeInstanceOf(ZodError)
  })

})