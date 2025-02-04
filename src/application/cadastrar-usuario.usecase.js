const AppError = require("../shared/errors/AppError");
const {Either} = require('../shared/errors')

module.exports = function cadastrarUsuarioUseCase({ usuariosRepository }){
  if(!usuariosRepository) throw new AppError(AppError.dependecias)
    return async function({nomeCompleto, CPF, telefone, endereco, email}){
    const checaCampos = nomeCompleto && CPF && telefone && endereco && email;
    if(!checaCampos) throw new AppError(AppError.parametrosObrigatoriosAusentes)
    
    const checaSeJaExisteUmUsuarioCadastradoComOCPF = await usuariosRepository.existePorCPF(CPF);
    if(checaSeJaExisteUmUsuarioCadastradoComOCPF){
      return Either.Left(Either.valorJaCadastrado('CPF'))
    }

    const checaSeJaExisteUmUsuarioCadastradoComOEmail = await usuariosRepository.existePorEmail(email)
    if(checaSeJaExisteUmUsuarioCadastradoComOEmail){
      return Either.Left(Either.valorJaCadastrado('Email'))

    }
    
    await usuariosRepository.cadastrar({
      nomeCompleto, CPF, telefone, endereco, email
    });

    return Either.Right(null)

  };
};