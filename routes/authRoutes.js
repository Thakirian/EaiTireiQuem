const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Admin = require("../models/admin");
const { generateToken } = require("../utils/jwt");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    let usuario = await Admin.buscarPorEmail(email);
    if (!usuario) {
      usuario = await User.buscarPorEmail(email);
    }

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = generateToken(usuario);

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        funcao: usuario.papel,
      },
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
