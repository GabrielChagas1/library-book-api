const { livrosRepository, typeormLivrosRepository } = require("./livros.repository");

describe('Livros Repository Typeorm', () => {

  let sut;

  beforeAll(() => {
    sut = livrosRepository()
  })

  beforeEach(async () => {
    await typeormLivrosRepository.delete({})
  })

  const livroDTO = {
    nome: 'nome-valido',
    quantidade: 3,
    autor: 'autor-valido',
    genero: 'genero-valido',
    ISBN: 'ISBN-valido'
  }

  test('Deve retornar void ao criar um livro', async () => {
    const livroCriado = await sut.cadastrar(livroDTO)
    expect(livroCriado).toBeUndefined()
  })

  test('Deve retornar true se existir um livro por ISBN', async () => {
    await typeormLivrosRepository.save(livroDTO)
    const existePorISBN = await sut.existePorISBN(livroDTO.ISBN)
    expect(existePorISBN).toBe(true)
  })

  test('Deve retornar false se existir um livro por ISBN', async () => {
    await typeormLivrosRepository.save(livroDTO)
    const existePorISBN = await sut.existePorISBN(livroDTO.ISBN+"teste")
    expect(existePorISBN).toBe(false)
  })

  test('Deve retornar um livro completo se buscar por nome', async () => {
    await typeormLivrosRepository.save(livroDTO)
    const buscarPorNomeOuISBNComNomeCorreto = await sut.buscarPorNomeOuISBN(livroDTO.nome)

    expect(buscarPorNomeOuISBNComNomeCorreto).toHaveLength(1)
    expect(buscarPorNomeOuISBNComNomeCorreto[0].nome).toBe(livroDTO.nome)

  })

  test('Deve retornar um livro completo se buscar por ISBN', async () => {
    await typeormLivrosRepository.save(livroDTO)
    const buscarPorNomeOuISBNComNomeCorreto = await sut.buscarPorNomeOuISBN(livroDTO.ISBN)

    expect(buscarPorNomeOuISBNComNomeCorreto).toHaveLength(1)
    expect(buscarPorNomeOuISBNComNomeCorreto[0].ISBN).toBe(livroDTO.ISBN)

  })


  test('Deve retornar um array vazio se buscar por nome ou ISBN e nada for encontrado', async () => {
    await typeormLivrosRepository.save(livroDTO)
    const buscarPorNomeOuISBNComNomeCorreto = await sut.buscarPorNomeOuISBN(livroDTO.ISBN+"teste")

    expect(buscarPorNomeOuISBNComNomeCorreto).toHaveLength(0)
  })

})