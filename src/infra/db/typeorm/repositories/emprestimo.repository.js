const { IsNull } = require("typeorm")
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
    return {data_retorno}
  }

  const buscarPendentescomLivroComUsuario = async () => {
    const emprestimosPendentes = await typeormEmprestimosRepository.find({
      where: {
        data_devolucao: IsNull()
      },
      relations: ['usuario', 'livro'],
      select: {
        id: true,
        data_saida: true,
        data_retorno: true,
        usuario: {
          nome_completo: true,
          CPF: true
        },
        livro: {
          nome: true
        }
      }
    })
    return emprestimosPendentes
  }

  const existeLivroISBNEmprestradoPendenteUsuario = async ({usuario_id, livro_id}) => {
    const emprestimoLivro = await typeormEmprestimosRepository.count({
      where: {
        data_devolucao: IsNull(),
        livro_id,
        usuario_id
      }
    })
    return emprestimoLivro === 0 ? false : true
  }

  const buscarEmprestimoComLivroComUsuarioPorID = async (id) => {
    const emprestimo = await typeormEmprestimosRepository.findOne({
      where: {id: id},
      relations: ['usuario', 'livro'],
      select: {
        id: true,
        data_saida: true,
        data_retorno: true,
        usuario: {
          nome_completo: true,
          CPF: true,
          email: true
        },
        livro: {
          nome: true
        }
      }
    })
    return emprestimo
  }

  return {emprestar, devolver, buscarPendentescomLivroComUsuario, existeLivroISBNEmprestradoPendenteUsuario, buscarEmprestimoComLivroComUsuarioPorID}
}



module.exports = {emprestimosRepository, typeormEmprestimosRepository}