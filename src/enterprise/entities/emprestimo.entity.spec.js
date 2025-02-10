const { AppError } = require("../../shared/errors")
const emprestimoEntity = require("./emprestimo.entity")

describe('Emprestimos Entity', () => {
  test('CalcularMulta - sem atraso', () => {
    const resultado = emprestimoEntity.calcularMulta({
      data_devolucao: '2024-02-16',
      data_retorno: '2024-02-16'
    })

    expect(resultado).toBe('Multa por atraso: R$0')
  })

  test('CalcularMulta - com atraso', () => {
    const resultado = emprestimoEntity.calcularMulta({
      data_devolucao: '2024-02-16',
      data_retorno: '2024-02-15'
    })

    expect(resultado).toBe('Multa por atraso: R$10')
  })

  test('CalcularMulta - sem paramêtros obrigatórias', () => {
    expect(() => emprestimoEntity.calcularMulta({})).toThrow(AppError.parametrosObrigatoriosAusentes)
  })

})