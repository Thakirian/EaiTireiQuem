const express = require("express");
const { auth } = require("../middleware/auth");
const { getWishlistMiddleware } = require("../middleware/wish");
const wishlistController = require("../controller/wishlistController");
const router = express.Router();

router.post("/", auth, wishlistController.criarWishlist);
/**
 * @swagger
 * /api/wishlists:
 *   post:
 *     summary: Criar uma nova lista de desejos
 *     description: Permite que o usuário crie uma lista de desejos vinculada ao seu perfil.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 description: Lista de itens que serão adicionados à nova lista de desejos.
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Perfume"
 *                     description:
 *                       type: string
 *                       example: "Um perfume da Natura"
 *                     price:
 *                       type: number
 *                       example: 100.0
 *     responses:
 *       201:
 *         description: Lista de desejos criada com sucesso.
 *       400:
 *         description: Erro na validação dos dados ou outro problema no processamento.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro interno no servidor.
 */

router.post(
  "/items",
  auth,
  getWishlistMiddleware,
  wishlistController.adicionarItem
);
/**
 * @swagger
 * /api/wishlists/items:
 *   post:
 *     summary: Adicionar um item à lista de desejos
 *     description: Adiciona um novo item à lista de desejos do usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Smartphone"
 *               description:
 *                 type: string
 *                 example: "Um smartphone com câmera avançada"
 *               price:
 *                 type: number
 *                 example: 2000.0
 *     responses:
 *       201:
 *         description: Item adicionado com sucesso.
 *       400:
 *         description: Dados inválidos ou erro ao adicionar o item.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Lista de desejos não encontrada.
 *       500:
 *         description: Erro interno no servidor.
 */

router.delete(
  "/items/:itemId",
  auth,
  getWishlistMiddleware,
  wishlistController.removerItem
);
/**
 * @swagger
 * /api/wishlists/items/{itemId}:
 *   delete:
 *     summary: Remover um item da lista de desejos
 *     description: Remove um item específico da lista de desejos do usuário.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item a ser removido.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Item removido com sucesso.
 *       400:
 *         description: Erro ao remover o item.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Item ou lista de desejos não encontrada.
 *       500:
 *         description: Erro interno no servidor.
 *
 *   patch:
 *     summary: Atualizar um item na lista de desejos
 *     description: Atualiza as informações de um item específico na lista de desejos do usuário.
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tablet"
 *               description:
 *                 type: string
 *                 example: "Um tablet de última geração"
 *               price:
 *                 type: number
 *                 example: 1500.0
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso.
 *       400:
 *         description: Dados inválidos ou erro ao atualizar o item.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Item ou lista de desejos não encontrada.
 *       500:
 *         description: Erro interno no servidor.
 */

router.patch(
  "/items/:itemId",
  auth,
  getWishlistMiddleware,
  wishlistController.atualizarItem
);

router.get("/usuario", auth, wishlistController.obterListaDesejosPorUsuario);
/**
 * @swagger
 * /api/wishlists/usuario:
 *   get:
 *     summary: Obter a lista de desejos de um usuário
 *     description: Retorna a lista de desejos paginada vinculada ao usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           enum: [5, 10, 30]
 *           default: 10
 *         description: Número de itens por página (5, 10 ou 30)
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página a ser retornada
 *     responses:
 *       200:
 *         description: Lista de desejos recuperada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de itens
 *                   example: 25
 *                 paginaAtual:
 *                   type: integer
 *                   description: Página atual
 *                   example: 1
 *                 limite:
 *                   type: integer
 *                   description: Número de itens por página
 *                   example: 10
 *                 dados:
 *                   type: array
 *                   description: Array de itens da lista de desejos
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Notebook"
 *                       description:
 *                         type: string
 *                         example: "Um notebook de alta performance"
 *                       price:
 *                         type: number
 *                         example: 5000.0
 *       400:
 *         description: Limite de itens por página inválido.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Lista de desejos não encontrada.
 *       500:
 *         description: Erro interno no servidor.
 */

module.exports = router;
