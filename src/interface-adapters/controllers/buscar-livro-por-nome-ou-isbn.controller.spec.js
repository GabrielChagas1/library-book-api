const { ZodError } = require("zod")
const httpResponse = require("../../helpers/http.response")
const { Either, AppError } = require("../../shared/errors")
const buscarLivroPorNomeOuIsbnController = require("./buscar-livro-por-nome-ou-isbn.controller")

describe('Buscar livro por ISBN ou por nome', () => {
  const buscarLivroPorNomeOuISBNUseCase = jest.fn()
  test('Deve retornar um httpResponse 200 e os livros se forem encontrados com o valor informado', async () => {
    const livroDTO = [{
      id: 'qualquer_id',
      nome: 'qualquer_nome',
      quantidade: 3,
      autor: 'qualquer_autor',
      genero: 'qualquer_genero',
      ISBN: 'qualquer_ISBN'
    }]

    buscarLivroPorNomeOuISBNUseCase.mockResolvedValue(Either.Right(livroDTO))

    const httpRequest = {
      query: {
        valor: 'nome_valido'
      }
    }

    const response = await buscarLivroPorNomeOuIsbnController({
      buscarLivroPorNomeOuISBNUseCase,
      httpRequest
    })

    expect(response).toEqual(httpResponse(200, livroDTO))
    expect(buscarLivroPorNomeOuISBNUseCase).toHaveBeenCalledWith(httpRequest.query)
    expect(buscarLivroPorNomeOuISBNUseCase).toHaveBeenCalledTimes(1)

  })

  test('Deve retornar um httpResponse 200 e um array vazio se não forem encontrados com o valor informado', async () => {
    buscarLivroPorNomeOuISBNUseCase.mockResolvedValue(Either.Right([]))

    const httpRequest = {
      query: {
        valor: 'nome_valido'
      }
    }

    const response = await buscarLivroPorNomeOuIsbnController({
      buscarLivroPorNomeOuISBNUseCase,
      httpRequest
    })

    expect(response).toEqual(httpResponse(200, []))
    expect(buscarLivroPorNomeOuISBNUseCase).toHaveBeenCalledWith(httpRequest.query)
    expect(buscarLivroPorNomeOuISBNUseCase).toHaveBeenCalledTimes(1)

  })

  test('Deve retornar um throw appError se o buscarLivroPorNomeOuISBN e httpRequest não forem fornecidos', async () => {
    expect(() => buscarLivroPorNomeOuIsbnController({})).rejects.toThrow(new AppError(AppError.dependecias))
  })

  test('Deve retornar um erro do zod validator se der erro na validação dos dados obrigatórios', async () => {
    const httpRequest = {
      query: {}
    }
    await expect(() => buscarLivroPorNomeOuIsbnController({buscarLivroPorNomeOuISBNUseCase, httpRequest})).rejects.toBeInstanceOf(ZodError)
  })

})