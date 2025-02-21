const httpResponse = require("../../helpers/http.response")
const { Either, AppError } = require("../../shared/errors")
const buscarPendentesFixture = require("../../tests/fixtures/buscar-pendentes")
const buscarEmprestimoPendentesController = require("./buscar-emprestimo-pendentes.controller")

describe('Buscar emprestimo pendentes controller', () => {
  const buscarEmprestimosPendentesUseCase = jest.fn()
  test('Deve retornar um httpResponse 200 e os empréstimos pendentes', async () => {
    buscarEmprestimosPendentesUseCase.mockResolvedValue(Either.Right(buscarPendentesFixture))
    const response = await buscarEmprestimoPendentesController({
      buscarEmprestimosPendentesUseCase
    })

    expect(response).toEqual(httpResponse(200, buscarPendentesFixture))
  })

  test('Deve retornar um erro se o buscarEmprestimosPendentesUseCase não forem fornecidos', async () => {
    await expect(() => buscarEmprestimoPendentesController({})).rejects.toThrow(new AppError(AppError.dependecias))
  })

  // test('Deve retornar um erro do zod validator se der erro na validação dos dados', async function(){
  //   const httpRequest = {
  //     body: {}
  //   }

  //   expect(() => devolverLivroController({ buscarEmprestimosPendentesUseCase, httpRequest})).rejects.toBeInstanceOf(ZodError)
  // })

})