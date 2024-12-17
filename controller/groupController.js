const Group = require("../models/group");
const User = require("../models/user");
const { validarNomeGrupo } = require("../utils/validation");

async function criarGrupo(req, res) {
  try {
    if (!validarNomeGrupo(req.body.nome)) {
      return res.status(400).json({ error: "Nome do grupo inválido" });
    }

    const grupo = await Group.criar({
      nome: req.body.nome,
      idAdmin: req.user.id,
    });
    res.status(201).json(grupo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function adicionarParticipante(req, res) {
  try {
    const grupo = await Group.buscarPorId(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });

    if (grupo.idAdmin !== req.user.id && req.user.papel !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const grupoAtualizado = await Group.adicionarParticipante(
      req.params.id,
      req.body.userId
    );

    res.status(200).json(grupoAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function realizarSorteio(req, res) {
  try {
    const grupo = await Group.buscarPorId(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });

    if (grupo.idAdmin !== req.user.id && req.user.papel !== "admin") {
      return res.status(403).json({ error: "Não autorizado" });
    }

    const grupoAtualizado = await Group.realizarSorteio(grupo.id);

    res.json({
      message: "Sorteio realizado com sucesso",
      grupo: grupoAtualizado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obterResultadosSorteio(req, res) {
  try {
    const grupo = await Group.buscarPorId(req.params.id);
    if (!grupo) return res.status(404).json({ error: "Grupo não encontrado" });

    if (!grupo.resultadoSorteio) {
      return res
        .status(400)
        .json({ error: "O sorteio ainda não foi realizado" });
    }

    if (req.user.papel === "admin" || grupo.idAdmin === req.user.id) {
      return res.json(grupo.resultadoSorteio);
    }

    if (grupo.participantes.includes(req.user.id)) {
      const receptor = await User.findById(grupo.resultadoSorteio[req.user.id]);
      return res.json({
        match: {
          id: receptor.id,
          nome: receptor.nome,
        },
      });
    }

    res.status(403).json({ error: "Não autorizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obterGruposUsuario(req, res) {
  try {
    const grupos = await Group.buscarTodos(req.user.id);
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function listarTodosGrupos(req, res) {
  try {
    const grupos = await Group.buscarTodos();
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function excluirGrupo(req, res) {
  try {
    const grupo = await Group.buscarPorId(req.params.id);

    if (!grupo) {
      return res.status(404).json({ error: "Grupo não encontrado" });
    }

    if (
      String(grupo.idAdmin) !== String(req.user.id) &&
      req.user.papel !== "admin"
    ) {
      return res.status(403).json({ error: "Não autorizado" });
    }

    await Group.excluir(req.params.id);
    res.status(200).json({ message: "Grupo excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  criarGrupo,
  adicionarParticipante,
  realizarSorteio,
  obterResultadosSorteio,
  obterGruposUsuario,
  listarTodosGrupos,
  excluirGrupo,
};
