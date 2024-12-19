const User = require("../models/user");

const criar = async (req, res) => {
  try {
    const user = await User.criar(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const buscarTodos = async (req, res) => {
  try {
    const users = await User.getAll();
    const limite = parseInt(req.query.limite) || 10;
    const pagina = parseInt(req.query.pagina) || 1;

    if (![5, 10, 30].includes(limite)) {
      return res.status(400).json({ error: "O limite deve ser 5, 10 ou 30." });
    }

    const inicio = (pagina - 1) * limite;
    const fim = inicio + limite;

    const usuariosPaginados = users.slice(inicio, fim);
    const usersWithoutPasswords = usuariosPaginados.map(removeSensitiveData);

    res.json({
      total: users.length,
      paginaAtual: pagina,
      limite,
      dados: usersWithoutPasswords,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarDadosUsuario = async (req, res) => {
  try {
    const { nome, email } = req.body;

    // Validação dos campos fornecidos
    if (!nome && !email) {
      return res.status(400).json({ error: "Nenhum dado para atualizar." });
    }

    const usuario = await User.buscarPorId(req.user.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;

    const usuarioAtualizado = await User.atualizar(req.user.id, usuario);

    return res.json({
      message: "Dados do usuário atualizados com sucesso.",
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const excluirUsuario = async (req, res) => {
  try {
    const usuario = await User.buscarPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await User.excluir(req.params.id);
    res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
function removeSensitiveData(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  criar,
  buscarTodos,
  atualizarDadosUsuario,
  excluirUsuario,
};
