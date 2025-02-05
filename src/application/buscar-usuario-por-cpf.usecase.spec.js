const { AppError } = require("../shared/errors")
const buscarUsuarioPorCpfUsecase = require("./buscar-usuario-por-cpf.usecase")

describe('Buscar usuario por CPF UseCase', () => {

  const usuariosRepository = {
    buscarPorCPF: jest.fn()
  }

  test('Deve retornar o usuario caso o CPF esteja cadastrado', async () => {
    const cpfDTO = {
      CPF: 'CPF_cadastrado'
    }

    const outputDTO = {
      id: 'qualquer_ID',
      nome: 'qualquer_nome',
      CPF: 'CPF_cadastrado',
      telefone: 'qualquer_telefone',
      email: 'qualquer_email'
    }

    usuariosRepository.buscarPorCPF.mockResolvedValue(outputDTO)

    const sut = buscarUsuarioPorCpfUsecase({usuariosRepository});
    const output = await sut(cpfDTO)

    expect(output.right).toEqual(outputDTO)
    expect(usuariosRepository.buscarPorCPF).toHaveBeenCalledWith(cpfDTO.CPF)
    expect(usuariosRepository.buscarPorCPF).toHaveBeenCalledTimes(1)
  })

  test('Deve retornar null se não existir nenhum usuário com o CPF informado', async () =>{
    const cpfDTO = {
      CPF: 'CPF_cadastrado'
    }

    usuariosRepository.buscarPorCPF.mockResolvedValue(null)


    const sut = buscarUsuarioPorCpfUsecase({usuariosRepository});
    const output = await sut(cpfDTO)

    expect(output.right).toBeNull()
    expect(usuariosRepository.buscarPorCPF).toHaveBeenCalledWith(cpfDTO.CPF)
    expect(usuariosRepository.buscarPorCPF).toHaveBeenCalledTimes(1)

  })

  test('Deve retornar um throw AppError se o usuariosRepository não for fornecido', () => {
    expect(() => buscarUsuarioPorCpfUsecase({})).toThrow(new AppError(AppError.dependecias))
  })

  test('Deve retornar um throw AppError se o campo CPF obrigatório não for fornecido', async () => {
    const sut = buscarUsuarioPorCpfUsecase({usuariosRepository})
    await expect(() => sut({})).rejects.toThrow(new AppError(AppError.parametrosObrigatoriosAusentes))
  })

})