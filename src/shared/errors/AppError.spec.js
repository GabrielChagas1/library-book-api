const AppError = require("./AppError")

describe('AppError', () => {
  test('AppError é uma instância de Error', () => {
    const appError = new AppError('erro')
    expect(appError).toBeInstanceOf(Error)
  })

  test('AppError contém a mensagem correta', () => {
    const mensagem = 'Mensagem de erro'
    const appError = new AppError(mensagem);
    expect(appError.message).toBe(mensagem)
  })

})