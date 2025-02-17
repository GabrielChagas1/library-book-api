const { ZodError } = require("zod")
const httpResponse = require("../../helpers/http.response")
const { Either, AppError } = require("../../shared/errors")
const buscarUsuarioPorCpfController = require("./buscar-usuario-por-cpf.controller")

describe('Buscar usuario por CPF controller', () => {
  const buscarUsuarioPorCPFUseCase = jest.fn()
  test('Deve retornar um httresponse 200 e um usuario se o mesmo for encontrado', async () => {
    const usuarioDto = {
      nome_completo: 'qualquer_nome',
      CPF: '123.123.123-12',
      endereco: 'qualquer_endereco',
      telefone: 'qualquer_telefone',
      email: 'qualquer_email@gmail.com'
    }

    buscarUsuarioPorCPFUseCase.mockResolvedValue(Either.Right(usuarioDto))

    const httpRequest = {
      params: {
        CPF: '123.123.123-12'
      }
    }

    const response = await buscarUsuarioPorCpfController({
      buscarUsuarioPorCPFUseCase,
      httpRequest
    })

    expect(response).toEqual(httpResponse(200, usuarioDto))
    expect(buscarUsuarioPorCPFUseCase).toHaveBeenCalledWith(httpRequest.params)
    expect(buscarUsuarioPorCPFUseCase).toHaveBeenCalledTimes(1)

  })

  test('Deve retornar um httpResponse 200 e null se não for encontrado nenhum usuario com o CPF', async () => {
    buscarUsuarioPorCPFUseCase.mockResolvedValue(Either.Right(null))

    const httpRequest = {
      params: {
        CPF: '123.123.123-12'
      }
    }

    const response = await buscarUsuarioPorCpfController({
      buscarUsuarioPorCPFUseCase,
      httpRequest
    })

    expect(response).toEqual(httpResponse(200, null))
    expect(buscarUsuarioPorCPFUseCase).toHaveBeenCalledWith(httpRequest.params)
    expect(buscarUsuarioPorCPFUseCase).toHaveBeenCalledTimes(1)
  })

  test('Deve retornar um throw AppError se o buscar UsuarioPorCPF e o httpRequest não forem fornecidos', async () => {
    expect(() => buscarUsuarioPorCpfController({})).rejects.toThrow(
      new AppError(AppError.dependecias)
    )
  })

  test('Deve retornar um erro de zod validator se os campos obrigatórios não forem fornecedos', async () => {
    const httpRequest = {
      params: {}
    }

    expect(buscarUsuarioPorCpfController({buscarUsuarioPorCPFUseCase, httpRequest})).rejects.toBeInstanceOf(ZodError)

  })

})