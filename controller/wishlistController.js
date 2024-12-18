const Wishlist = require("../models/wishlist");
const { validateWishlistItem } = require("../utils/validation");

const criarWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const listaDesejos = await Wishlist.criar({
      userId,
      items: req.body.items || [],
    });

    res.status(201).json(listaDesejos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const adicionarItem = async (req, res) => {
  try {
    const item = req.body;
    if (!validateWishlistItem(item)) {
      return res
        .status(400)
        .json({ error: "Os dados do item são inválidos ou incompletos." });
    }

    const novoItem = await Wishlist.adicionarItem(req.user.id, item);
    res.status(201).json(novoItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removerItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ error: "ID do item é obrigatório." });
    }

    await Wishlist.removerItem(req.user.id, itemId);
    res.status(200).json({ message: "Item removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const atualizacoes = req.body;

    if (!atualizacoes || Object.keys(atualizacoes).length === 0) {
      return res
        .status(400)
        .json({ error: "Os dados para atualização não foram fornecidos." });
    }

    const itemAtualizado = await Wishlist.atualizarItem(
      req.user.id,
      itemId,
      atualizacoes
    );
    res.status(200).json(itemAtualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obterListaDesejosPorUsuario = async (req, res) => {
  try {
    const listaDesejos = await Wishlist.buscarPorUsuario(req.user.id);

    if (!listaDesejos) {
      return res
        .status(404)
        .json({ error: "Lista de desejos não encontrada." });
    }

    res.status(200).json(listaDesejos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarWishlist,
  adicionarItem,
  removerItem,
  atualizarItem,
  obterListaDesejosPorUsuario,
};
