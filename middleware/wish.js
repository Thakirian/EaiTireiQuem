const Wishlist = require("../models/wishlist");

const getWishlistMiddleware = async (req, res, next) => {
  try {
    req.listaDesejos = await Wishlist.buscarPorUsuario(req.user.id);
    if (!req.listaDesejos) {
      return res.status(404).json({ error: "Lista de desejos não encontrada" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getWishlistMiddleware };
