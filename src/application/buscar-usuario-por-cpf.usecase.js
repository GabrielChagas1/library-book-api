const { Either } = require("../shared/errors");
const AppError = require("../shared/errors/AppError");


module.exports = function buscarUsuarioPorCPFUseCase({ usuariosRepository }){
  if(!usuariosRepository) throw new AppError(AppError.dependecias)

  return async function ({CPF}){
    if(!CPF) throw new AppError(AppError.parametrosObrigatoriosAusentes)
    const usuario = await usuariosRepository.buscarPorCPF(CPF);
    return Either.Right(usuario)
  }
}