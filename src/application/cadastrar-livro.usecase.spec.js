const { AppError, Either } = require("../shared/errors");
const cadastrarLivroUsecase = require("./cadastrar-livro.usecase");

describe('Cadastrar Livro UseCase', () => {
  test('Deve poder cadastrar um livro', async () => {

    const livrosRepository = {
      cadastrar: jest.fn(),
      existePorISBN: jest.fn(),
    }

    const livroDTO = {
      nome: 'nome-valido',
      quantidade: 'quantidade-valido',
      autor: 'autor-valido',
      genero: 'genero-valido',
      ISBN: 'ISBN-valido'
    }

    const sut = cadastrarLivroUsecase({livrosRepository});
    const output = await sut(livroDTO)

    expect(output.right).toBeNull()
    expect(livrosRepository.cadastrar).toHaveBeenCalledWith(livroDTO);
    expect(livrosRepository.cadastrar).toHaveBeenCalledTimes(1)

  });


  test('Deve retornar um throw AppError se o livrosRepository não for fornecido', () => {
    expect(() => cadastrarLivroUsecase({})).toThrow(new AppError(AppError.dependecias))
  })

  test('Deve retornar um throw appError se os campos obrigatórios não forem fornecidos', async function (){
    const livrosRepository = {
      cadastrar: jest.fn()
    }
    const sut = cadastrarLivroUsecase({livrosRepository})
    await expect(() => sut({})).rejects.toThrow(
      new AppError(AppError.parametrosObrigatoriosAusentes)
    )
  })

  test('Deve retornar um Either.Left Either.valorJaCadastrado("ISBN") se já existir um ISBN cadastrado para um livro', async () => {

    const livrosRepository = {
      cadastrar: jest.fn(),
      existePorISBN: jest.fn(),
    }
    
    livrosRepository.existePorISBN.mockResolvedValue(true)

    const livroDTO = {
      nome: 'nome-valido',
      quantidade: 'quantidade-valido',
      autor: 'autor-valido',
      genero: 'genero-valido',
      ISBN: 'ISBN-valido'
    }

    const sut = cadastrarLivroUsecase({livrosRepository})
    const output = await sut(livroDTO)

    expect(output.left).toEqual(Either.valorJaCadastrado('ISBN'))
    expect(livrosRepository.existePorISBN).toHaveBeenCalledWith(livroDTO.ISBN)
    expect(livrosRepository.existePorISBN).toHaveBeenCalledTimes(1)


  })

})