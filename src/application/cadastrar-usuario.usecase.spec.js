const AppError = require("../shared/errors/AppError");
const cadastrarUsuarioUseCase = require("./cadastrar-usuario.usecase")
const {Either} = require('../shared/errors')

describe('cadastrar usuário usecase', () => {

  const usuariosRepository = {
    cadastrar: jest.fn(),
    existePorCPF: jest.fn(),
    existePorEmail: jest.fn()
  }

  test('Deve poder cadastrar um usuário', async () => {
    const userDTO ={
      nomeCompleto: "Gabriel Chagas",
      CPF: "473.412.123.99",
      telefone: "11923402030", 
      endereco: "Rua Geraldo de Carvalho, 232", 
      email: "teste@teste.com"
    }
    const sut = cadastrarUsuarioUseCase({ usuariosRepository });
    const output = await sut(userDTO);

    expect(output.right).toBeNull();
    expect(usuariosRepository.cadastrar).toHaveBeenCalledWith(userDTO);
    expect(usuariosRepository.cadastrar).toHaveBeenCalledTimes(1)

  });

  test('Deve retornar um throw AppError se o usuariosRepository não for fornecido', async () => {
    expect(() => cadastrarUsuarioUseCase({})).toThrow(new AppError(AppError.dependecias))
  })

  test('Deve retornar com um throw AppError se os campos obrigatórios não forem fornecidos', async () => {
    const sut = cadastrarUsuarioUseCase({usuariosRepository})
    await expect(() => sut({})).rejects.toThrow(new AppError(AppError.parametrosObrigatoriosAusentes))
  })

  test('Deve retornar um Either.Left se já existir um cadastro com o CPF', async () => {
    usuariosRepository.existePorCPF.mockResolvedValue(true)
    const userDTO ={
      nomeCompleto: "Gabriel Chagas",
      CPF: "473.412.123.99",
      telefone: "11923402030", 
      endereco: "Rua Geraldo de Carvalho, 232", 
      email: "teste@teste.com"
    }

    const sut = cadastrarUsuarioUseCase({usuariosRepository})
    const out = await sut(userDTO)
    expect(out.right).toBeNull()
    expect(out.left).toEqual(Either.valorJaCadastrado('CPF'))
    expect(usuariosRepository.existePorCPF).toHaveBeenLastCalledWith(userDTO.CPF)
    expect(usuariosRepository.existePorCPF).toHaveBeenCalledTimes(1)

  })

  test('Deve retornar um Either.Left se já existir um cadastro com o Email', async () => {
    usuariosRepository.existePorCPF.mockResolvedValue(false)
    usuariosRepository.existePorEmail.mockResolvedValue(true)
    const userDTO ={
      nomeCompleto: "Gabriel Chagas",
      CPF: "473.412.123.99",
      telefone: "11923402030", 
      endereco: "Rua Geraldo de Carvalho, 232", 
      email: "teste@teste.com"
    }

    const sut = cadastrarUsuarioUseCase({ usuariosRepository })
    const out = await sut(userDTO)
    expect(out.right).toBeNull()
    expect(out.left).toEqual(Either.valorJaCadastrado('Email'))
    expect(usuariosRepository.existePorEmail).toHaveBeenLastCalledWith(userDTO.email)
    expect(usuariosRepository.existePorEmail).toHaveBeenCalledTimes(1)

  })

})