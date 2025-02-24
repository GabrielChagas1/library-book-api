const httpResponse = require("../../helpers/http.response")
const { z } = require('zod')
const { AppError } = require("../../shared/errors")

const zodValidator = z.object({
  valor: z.string({
    required_error: 'Valor é obrigatório'
  })
})

module.exports = async function buscarLivroPorNomeOuISBNController({buscarLivroPorNomeOuISBNUseCase, httpRequest}){

  if(!buscarLivroPorNomeOuISBNUseCase || !httpRequest || !httpRequest.query){
    throw new AppError(AppError.dependecias)
  }

  const {valor} = zodValidator.parse(httpRequest.query)

  const output = await buscarLivroPorNomeOuISBNUseCase({ valor })

  return output.fold(
    (error) => httpResponse(400, error.message),
    (livros) => httpResponse(200, livros)
  )

}