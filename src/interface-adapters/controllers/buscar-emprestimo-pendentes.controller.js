const httpResponse = require("../../helpers/http.response")
const { AppError } = require("../../shared/errors")

module.exports = async function buscarEmprestimosPendentesController({buscarEmprestimosPendentesUseCase}){
  if(!buscarEmprestimosPendentesUseCase) throw new AppError(AppError.dependecias)
  const output = await buscarEmprestimosPendentesUseCase()

  return output.fold(
    (error) => httpResponse(400, error.message),
    (emprestimos) => httpResponse(200, emprestimos)
  )
}