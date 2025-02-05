const { AppError, Either } = require("../shared/errors");

module.exports = function buscarEmprestimosPendentesUseCase({ emprestimosRepository }){
  if(!emprestimosRepository) throw new AppError(AppError.dependecias)
  return async function(){
    const emprestimosPendentes = await emprestimosRepository.buscarPendentesComLivroComUsuario();
    return Either.Right(emprestimosPendentes)
  }
}