module.exports = class AppError extends Error{
  constructor(message){
    super(message)
    this.message = message
  }

  static dependecias = 'Alguma dependência obrigatória não foi fornecida!';
  static parametrosObrigatoriosAusentes = 'Algum parâmetro obrigatório não foi fornecido!';

}