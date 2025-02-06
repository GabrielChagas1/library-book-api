const { AppError } = require("../shared/errors")
const devolverLivroUsecase = require("./devolver-livro.usecase")

describe('Devolver livro UseCase', () => {

  const emprestimosRepository = {
    devolver: jest.fn()
  }

  test('Deve ser possível devolver um livro sem multa', async () => {
    emprestimosRepository.devolver.mockResolvedValue({
      data_retorno: new Date('2024-02-16')
    })

    const devolverLivroDTO = {
      emprestimo_id: 'qualquer_id',
      data_devolucao: new Date('2024-02-16')
    }

    const sut = devolverLivroUsecase({ emprestimosRepository})
    const  output = await sut(devolverLivroDTO)

    expect(output.right).toBe('Multa por atraso: R$0')
    expect(emprestimosRepository.devolver).toHaveBeenCalledWith(devolverLivroDTO)
    expect(emprestimosRepository.devolver).toHaveBeenCalledTimes(1)

  })

  test('Deve ser possível devolver um livro com multa', async () => {

    emprestimosRepository.devolver.mockResolvedValue({
      data_retorno: new Date('2024-02-15')
    })

    const devolverLivroDTO = {
      emprestimo_id: 'qualquer_id',
      data_devolucao: new Date('2024-02-16')
    }

    const sut = devolverLivroUsecase({ emprestimosRepository})
    const  output = await sut(devolverLivroDTO)

    expect(output.right).toBe('Multa por atraso: R$10')
    expect(emprestimosRepository.devolver).toHaveBeenCalledWith(devolverLivroDTO)
    expect(emprestimosRepository.devolver).toHaveBeenCalledTimes(1)
  })

  test('Deve retornar um throw AppError se o emprestimoRepository não for fornecido', () => {
    expect(() => devolverLivroUsecase({})).toThrow(new AppError(AppError.dependecias))
  })

  test('Deve retornar um throw AppError se algum campo obrigatório não for fornecido', async () => {
      const sut = devolverLivroUsecase({emprestimosRepository})
      await expect(() => sut({})).rejects.toThrow(new AppError(AppError.parametrosObrigatoriosAusentes))
    })

})