const { AppError } = require("../shared/errors")
const buscarEmprestimosUsecase = require("./buscar-emprestimos.usecase")

describe('Buscar emprestimos pendentes UseCase', () => {
  const emprestimosRepository = {
    buscarPendentesComLivroComUsuario: jest.fn()
  }

  test('Deve ser possível buscar os empréstimos pendentes', async () => {

    emprestimosRepository.buscarPendentesComLivroComUsuario.mockResolvedValue([
      {
        usuario: {
          nome: 'qualquer_nome_usuario',
          CPF: 'qualquer_cpf'
        },
        livro: {
          nome: 'qualquer_nome_livro'
        },
        data_saida: '2024-10-01',
        data_retorno: '2024-10-02'
      },
      {
        usuario: {
          nome: 'qualquer_nome_valido',
          CPF: 'qualquer_cpf_valido'
        },
        livro: {
          nome: 'qualquer_nome_livro_valido'
        },
        data_saida: '2024-10-10',
        data_retorno: '2024-10-15'
      }
    ])

    const sut = buscarEmprestimosUsecase({ emprestimosRepository})
    const output = await sut();

    expect(output.right).toHaveLength(2)
    expect(output.right[0].usuario.nome).toBe('qualquer_nome_usuario')
    expect(output.right[0].usuario.CPF).toBe('qualquer_cpf')
    expect(output.right[0].livro.nome).toBe('qualquer_nome_livro')
    expect(output.right[0].data_saida).toBe('2024-10-01')
    expect(output.right[0].data_retorno).toBe('2024-10-02')
  })

  test('Deve retornar um throw appError se o emprestimosRepository não for fornecido', () => {
    expect(() => buscarEmprestimosUsecase({})).toThrow(new AppError(AppError.dependecias))
  })

})