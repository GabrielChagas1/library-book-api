const { typeormServer } = require("../setup")

const typeormEmprestimosRepository = typeormServer.getRepository('Emprestimo')
const emprestimosRepository = () => {
  const emprestar = async ({usuario_id, livro_id, data_saida, data_retorno}) => {
    await typeormEmprestimosRepository.save({
      usuario_id,
      livro_id,
      data_saida,
      data_retorno,
    })
  }

  const devolver = async ({emprestimo_id, data_devolucao}) => {
    await typeormEmprestimosRepository.update(emprestimo_id, {
      data_devolucao
    })
    const {data_retorno} = await typeormEmprestimosRepository.findOneBy({
      id: emprestimo_id
    })

    console.log(data_retorno)

    return {data_retorno}
  }

  return {emprestar, devolver}
}



module.exports = {emprestimosRepository, typeormEmprestimosRepository}