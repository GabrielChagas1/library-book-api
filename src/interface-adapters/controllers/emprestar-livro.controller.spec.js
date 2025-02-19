const { ZodError } = require("zod");
const httpResponse = require("../../helpers/http.response");
const { Either, AppError } = require("../../shared/errors");
const emprestarLivroController = require("./emprestar-livro.controller");

describe('Emprestar livro Controller', () => {
  const emprestarLivroUseCase = jest.fn();
  test('Deve ser possível emprestar um livro', async () => {
    emprestarLivroUseCase.mockResolvedValue(Either.Right(null))
    const httpRequest = {
      body: {
        livro_id: 1,
        usuario_id: 1,
        data_saida: '2024-02-03',
        data_retorno: '2024-02-15'
      }
    }
    const response = await emprestarLivroController({
      emprestarLivroUseCase,
      httpRequest
    })

    expect(response).toEqual(httpResponse(201, null))
    expect(emprestarLivroUseCase).toHaveBeenCalledWith({
      livro_id: 1,
      usuario_id: 1,
      data_saida: expect.any(Date),
      data_retorno: expect.any(Date)
    })
    expect(emprestarLivroUseCase).toHaveBeenCalledTimes(1)
  })

  test('Deve retornar um httpResponse 400 e error.message se o emprestimo não for realizado com sucesso por lógica do useCase', async () => {
    emprestarLivroUseCase.mockResolvedValue(Either.Left({ message: 'validacao_invalida' }))
    const httpRequest = {
      body: {
        livro_id: 1,
        usuario_id: 1,
        data_saida: '2024-02-03',
        data_retorno: '2024-02-15'
      }
    }
    const response = await emprestarLivroController({
      emprestarLivroUseCase,
      httpRequest
    })

    expect(response).toEqual(httpResponse(400, 'validacao_invalida'))
    expect(emprestarLivroUseCase).toHaveBeenCalledWith({
      livro_id: 1,
      usuario_id: 1,
      data_saida: expect.any(Date),
      data_retorno: expect.any(Date)
    })
    expect(emprestarLivroUseCase).toHaveBeenCalledTimes(1)
  })

  test('Deve retornar um throw appError se o emprestarLivroUseCase e httpRequest não forem fornecidos', async () => {
    expect(() => emprestarLivroController({})).rejects.toThrow(new AppError(AppError.dependecias))
  })

  test('Deve retornar um erro do zod validator se der erro na validação dos dados obrigatórios', async () => {
    const httpRequest = {
      body: {}
    }
    await expect(() => emprestarLivroController({emprestarLivroUseCase, httpRequest})).rejects.toBeInstanceOf(ZodError)
  })
})