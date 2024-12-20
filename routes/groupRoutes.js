const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/auth");
const {
  criarGrupo,
  adicionarParticipante,
  realizarSorteio,
  obterResultadosSorteio,
  obterGruposUsuario,
  listarTodosGrupos,
  excluirGrupo,
} = require("../controller/groupController");

/**
 * @swagger
 * /api/grupos/criar:
 *   post:
 *     summary: Cria um novo grupo de Amigo Secreto
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Grupos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do grupo
 *                 example: Amigo secreto da empresa
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 *       400:
 *         description: Dados inválidos ou falta de parâmetros
 *       401:
 *         description: Usuário não autorizado
 */

router.post("/criar", auth, criarGrupo);

/**
 * @swagger
 * /api/grupos/{id}/adicionar-participante:
 *   patch:
 *     summary: Adiciona um participante a um grupo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID do grupo
 *           example: 60d2e7b1e1b6a32f4c6e0b5f
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID do usuário a ser adicionado
 *                 example: 64d4f1e8b453bc1234567891
 *     responses:
 *       200:
 *         description: Participante adicionado com sucesso
 *       404:
 *         description: Grupo não encontrado
 *       409:
 *         description: Usuário já é participante do grupo
 */

router.patch("/:id/adicionar-participante", auth, adicionarParticipante);

/**
 * @swagger
 * /api/grupos/{id}/sortear:
 *   post:
 *     summary: Realizar sorteio de Amigo Secreto
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          type: string
 *          description: ID do grupo
 *          example: 63d2e3e8e982ab1234567890
 *     responses:
 *       200:
 *         description: Sorteio realizado com sucesso
 *      400:
 *       description: Erro durante o sorteio
 */
router.post("/:id/sortear", auth, realizarSorteio);

/**
 * @swagger
 * /api/grupos/{id}/resultados:
 *   get:
 *     summary: Obter resultados do sorteio de um grupo
 *     security:
 *       - bearerAuth: []
 *    tags:
 *     - Grupos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID do grupo
 *           example: 60d2e7b1e1b6a32f4c6e0b5f
 *     responses:
 *       200:
 *         description: Resultados do sorteio obtidos com sucesso
 *       404:
 *         description: Resultados não encontrados
 */
router.get("/:id/resultados", auth, obterResultadosSorteio);

/**
 * @swagger
 * /api/grupos/listar-usuario:
 *   get:
 *     summary: Lista todos os grupos de um usuário
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID do usuário
 *           example: 64d4f1e8b453bc1234567891
 *      - in: query
 *        name: pagina
 *        schema:
 *          type: integer
 *          default: 1
 *          minimum: 1
 *         description: Número da página
 *      - in: query
 *        name: limite
 *        schema:
 *          type: integer
 *          enum: [5, 10, 30]
 *          default: 10
 *        description: Quantidade de itens por página
 * 
 *     responses:
 *       200:
 *         description: Grupos do usuário obtidos com sucesso
 * content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de registros
 *                 paginaAtual:
 *                   type: integer
 *                   description: Página atual
 *                 limite:
 *                   type: integer
 *                   description: Itens por página
 *                 dados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       idAdmin:
 *                         type: string
 *                       participantes:
 *                         type: array
 *                         items:
 *                           type: string
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/listar-usuario/:id", auth, obterGruposUsuario);

/**
 * @swagger
 * /api/grupos:
 *   get:
 *     summary: Lista todos os grupos
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Número da página
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *           enum: [5, 10, 30]
 *           default: 10
 *         description: Quantidade de itens por página
 *     responses:
 *       200:
 *         description: Grupos obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de registros
 *                 paginaAtual:
 *                   type: integer
 *                   description: Página atual
 *                 limite:
 *                   type: integer
 *                   description: Itens por página
 *                 dados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nome:
 *                         type: string
 *                       idAdmin:
 *                         type: string
 *                       participantes:
 *                         type: array
 *                         items:
 *                           type: string
 */

router.get("/", auth, isAdmin, listarTodosGrupos);

/**
 * @swagger
 * /api/grupos/{id}:
 *   delete:
 *     summary: Exclui um grupo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Grupos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: ID do grupo
 *           example: 63d2e3e8e982ab1234567890
 *     responses:
 *       204:
 *         description: Grupo excluído com sucesso
 *       403:
 *         description: Apenas administradores podem excluir grupos
 *       404:
 *         description: Grupo não encontrado
 */
router.delete("/deletar/:id", auth, isAdmin, excluirGrupo);

module.exports = router;
