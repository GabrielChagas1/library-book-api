const { AppError } = require("../shared/errors")
const buscarLivrosPorNomeouISBNUseCase = require("./buscar-livro-por-nome-ou-isbn.usecase")

describe('Buscar livro por nome ou ISBN UseCase', () => {
  test('Deve retornar um livro válido ao buscar por nome ou ISBN existente', async () => {
    const livrosRepository = {
      buscarPorNomeOuISBN: jest.fn()
    }

    const nomeISBNDTO = {
      valor: 'valor-valido'
    }

    const outputDTO = [{
      nome: 'nome-valido',
      quantidade: 'quantidade-valido',
      autor: 'autor-valido',
      genero: 'genero-valido',
      ISBN: 'ISBN-valido'
    }]

    livrosRepository.buscarPorNomeOuISBN.mockResolvedValue(outputDTO)

    const sut = buscarLivrosPorNomeouISBNUseCase({livrosRepository})
    const output = await sut(nomeISBNDTO)

    expect(output.right).toEqual(outputDTO)
    expect(livrosRepository.buscarPorNomeOuISBN).toHaveBeenCalledWith(nomeISBNDTO.valor)
    expect(livrosRepository.buscarPorNomeOuISBN).toHaveBeenCalledTimes(1)
  })

  test('Deve retornar um array vazio quando não existir um livro com o nome ou ISBN informados', async () => {
    const nomeISBNDTO = {
      valor: 'valor-invalido'
    }

    const livrosRepository = {
      buscarPorNomeOuISBN: jest.fn()
    }

    livrosRepository.buscarPorNomeOuISBN.mockResolvedValue([])

    const sut = buscarLivrosPorNomeouISBNUseCase({livrosRepository})
    const output = await sut(nomeISBNDTO)

    expect(output.right).toEqual([])
    expect(livrosRepository.buscarPorNomeOuISBN).toHaveBeenCalledWith(nomeISBNDTO.valor)
    expect(livrosRepository.buscarPorNomeOuISBN).toHaveBeenCalledTimes(1)
  })

  test('Deve retornar um throw appError se o LivrosRepository não for fornecido', async () => {
    expect(() => buscarLivrosPorNomeouISBNUseCase({})).toThrow(new AppError(AppError.dependecias))
  })

  test('Deve retornar um throw AppError se o campo valor obrigatório não for fornecido', async () => {
    const livrosRepository = {
      buscarPorNomeOuISBN: jest.fn()
    }
    const sut = buscarLivrosPorNomeouISBNUseCase({livrosRepository})

    expect(() => sut({})).rejects.toThrow(new AppError(AppError.parametrosObrigatoriosAusentes))

  })

})