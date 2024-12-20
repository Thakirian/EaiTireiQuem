const express = require("express");
const router = express.Router();

const routes = {
  grupos: require("./groupRoutes"),
  especial: require("./specialRoutes"),
  auth: require("./authRoutes"),
  admin: require("./adminRoutes"),
  usuarios: require("./usersRoutes"),
  wishlists: require("./wishlistRoutes"),
};

Object.entries(routes).forEach(([path, routeHandler]) => {
  if (
    typeof routeHandler === "function" ||
    typeof routeHandler.use === "function"
  ) {
    router.use(`/${path}`, routeHandler);
  } else {
    console.error(
      console.error(
        `Erro: Roteador para "${path}" não é válido. Verifique a exportação do arquivo ${path}Routes.`
      )
    );
  }
});

module.exports = router;
