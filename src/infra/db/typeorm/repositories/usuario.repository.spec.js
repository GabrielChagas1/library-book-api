const { usuariosRepository, typeormUsuariosRepository } = require("./usuario.repository");

describe('Usuarios Repository', () => {

  let sut;

  beforeEach(async () => {
    await typeormUsuariosRepository.delete({})
  })

  beforeAll(() => {
    sut = usuariosRepository();
  })

  const usuarioDTO = {
    nome_completo: 'nome_valido',
      CPF: 'CPF_valido',
      telefone: 'telefone_valido',
      email: 'email_valido',
      endereco: 'endereco_valido'
  }

  test('Deve retornar void ao criar um usuário', async () => {
    const usuarioCriado = await sut.cadastrar(usuarioDTO)
    expect(usuarioCriado).toBeUndefined()
  })

  test('Deve retornar um usuário se o mesmo existir buscando por CPF', async () => {
    await typeormUsuariosRepository.save(usuarioDTO)
    const buscarPorCPFCadastrado = await sut.buscarPorCPF('CPF_valido')
    expect(buscarPorCPFCadastrado.id).toBeDefined()
    expect(buscarPorCPFCadastrado.nome_completo).toBe('nome_valido')
  })

  test('Deve retornar null se o usuário não existir ao buscar por CPF', async () => {
    const buscarPorCPFCadastrado = await sut.buscarPorCPF('CPF_valido')
    expect(buscarPorCPFCadastrado).toBeNull()
  })

  test('Deve retornar true se exister um usuario por CPF', async () => {
    await typeormUsuariosRepository.save(usuarioDTO)
    const existePorCPF = await sut.existePorCPF(usuarioDTO.CPF)
    expect(existePorCPF).toBe(true);
  })

  test('Deve retornar false se exister um usuario por CPF', async () => {
    await typeormUsuariosRepository.save(usuarioDTO)
    const existePorCPF = await sut.existePorCPF('teste')
    expect(existePorCPF).toBe(false);
  })

  test('Deve retornar um usuário se o mesmo existir buscando por email', async () => {
    await typeormUsuariosRepository.save(usuarioDTO)
    const buscarPorEmailCadastrado = await sut.buscarPorEmail(usuarioDTO.email)
    expect(buscarPorEmailCadastrado.id).toBeDefined()
    expect(buscarPorEmailCadastrado.email).toBe(usuarioDTO.email)
  })

  test('Deve retornar null se o usuário não existir ao buscar por email', async () => {
    const buscarPorCPFCadastrado = await sut.buscarPorCPF(usuarioDTO.email)
    expect(buscarPorCPFCadastrado).toBeNull()
  })

})