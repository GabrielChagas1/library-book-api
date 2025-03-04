const { emprestimosRepository, typeormEmprestimosRepository } = require("./emprestimo.repository");
const { typeormLivrosRepository } = require("./livros.repository");
const { typeormUsuariosRepository } = require("./usuarios.repository");

describe('Emprestimos Repository Typeorm', () => {
  let sut;

  beforeAll(() => {
    sut = emprestimosRepository()
  })

  beforeEach(async () => {
    await typeormEmprestimosRepository.delete({})
    await typeormUsuariosRepository.delete({})
    await typeormLivrosRepository.delete({})
  })

  const usuarioDTO = {
    nome_completo: 'nome_valido',
    CPF: 'CPF_valido',
    telefone: 'telefone_valido',
    email: 'email_valido',
    endereco: 'endereco_valido'
  }

  const livroDTO = {
    nome: 'nome-valido',
    quantidade: 3,
    autor: 'autor-valido',
    genero: 'genero-valido',
    ISBN: 'ISBN-valido'
  }

  test('Deve retornar void ao criar um empréstimo', async () => {

    const usuario = await typeormUsuariosRepository.save(usuarioDTO)
    const livro = await typeormLivrosRepository.save(livroDTO)

    const emprestimoCriado = await sut.emprestar({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_saida: '2024-01-26',
      data_retorno: '2024-01-27'
    })

    expect(emprestimoCriado).toBeUndefined()
  })

  test('Deve retornar a data de retorno salva no banco de dados corretamente', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO)
    const livro = await typeormLivrosRepository.save(livroDTO)

    const emprestimo = await typeormEmprestimosRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_saida: '2024-01-26',
      data_retorno: '2024-01-26'
    })

    const devolver = await sut.devolver({
      emprestimo_id: emprestimo.id,
      data_devolucao: '2024-01-26'
    })
    expect(devolver.data_retorno).toBe(emprestimo.data_retorno);
  })

  test('Deve atualizar a data de devolucao no bando de dados corretamente', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO)
    const livro = await typeormLivrosRepository.save(livroDTO)

    const emprestimo = await typeormEmprestimosRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_saida: '2024-01-26',
      data_retorno: '2024-01-26'
    })

    await sut.devolver({
      emprestimo_id: emprestimo.id,
      data_devolucao: '2024-01-26'
    })

    const buscarEmprestimoPorID = await typeormEmprestimosRepository.findOneBy({id: emprestimo.id})

    expect(buscarEmprestimoPorID.data_devolucao).toBe('2024-01-26');
  })

  test('Deve retornar os empréstimos pendentes', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO)
    const livro = await typeormLivrosRepository.save(livroDTO)
    await typeormEmprestimosRepository.save([
      {
        usuario_id: usuario.id,
        livro_id: livro.id,
        data_saida: '2024-01-27',
        data_retorno: '2024-01-28',
        data_devolucao: '2024-01-28'
      },
      {
        usuario_id: usuario.id,
        livro_id: livro.id,
        data_saida: '2024-01-28',
        data_retorno: '2024-01-29'
      },
    ])

    const emprestimosPendentes = await sut.buscarPendentescomLivroComUsuario();
    expect(emprestimosPendentes).toHaveLength(1)
    expect(emprestimosPendentes[0].id).toBeDefined()
    expect(emprestimosPendentes[0].data_saida).toBe('2024-01-28')
    expect(emprestimosPendentes[0].data_retorno).toBe('2024-01-29')
    expect(emprestimosPendentes[0].data_devolucao).toBeUndefined()
    expect(emprestimosPendentes[0].usuario.nome_completo).toBe(usuarioDTO.nome_completo)
    expect(emprestimosPendentes[0].livro.nome).toBe(livro.nome)
  })

  test('Deve retornar true se existir um emprestimo pendente para o usuario ou o livro', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO)
    const livro = await typeormLivrosRepository.save(livroDTO)

    await typeormEmprestimosRepository.save({
      usuario_id: usuario.id,
      livro_id: livro.id,
      data_saida: '2024-01-26',
      data_retorno: '2024-01-26'
    })

    const existeEmprestimoPendenteLivroUsuario = await sut.existeLivroISBNEmprestradoPendenteUsuario({
      livro_id: livro.id,
      usuario_id: usuario.id
    })

    expect(existeEmprestimoPendenteLivroUsuario).toBe(true)

  })

  test('Deve retornar false se não existir um emprestimo pendente para o usuario ou o livro', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO)
    const livro = await typeormLivrosRepository.save(livroDTO)

    const existeEmprestimoPendenteLivroUsuario = await sut.existeLivroISBNEmprestradoPendenteUsuario({
      livro_id: livro.id,
      usuario_id: usuario.id
    })

    expect(existeEmprestimoPendenteLivroUsuario).toBe(false)

  })

  test('Deve retornar o emprestimo buscado por id com o usuario e o livro', async () => {
    const usuario = await typeormUsuariosRepository.save(usuarioDTO)
    const livro = await typeormLivrosRepository.save(livroDTO)
    const emprestimo = await typeormEmprestimosRepository.save(
      {
        usuario_id: usuario.id,
        livro_id: livro.id,
        data_saida: '2024-01-26',
        data_retorno: '2024-01-26',
      }
    )

    const buscarEmprestimoComLivroComUsuario = await sut.buscarEmprestimoComLivroComUsuarioPorID(emprestimo.id);

    expect(buscarEmprestimoComLivroComUsuario).toEqual({
      id: emprestimo.id,
      data_saida: '2024-01-26',
      data_retorno: '2024-01-26',
      usuario: {
        nome_completo: usuarioDTO.nome_completo,
        CPF: usuarioDTO.CPF,
        email: usuarioDTO.email
      },
      livro: {
        nome: livroDTO.nome
      }
    })

  })


})