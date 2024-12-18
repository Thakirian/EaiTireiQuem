const express = require("express");
const { auth, isAdmin } = require("../middleware/auth");
const { reajustar } = require("../drawService");

const router = express.Router();

/**
 * @swagger
 * /api/special/redistribuir/{groupId}:
 *   post:
 *     summary: Redistribuir o sorteio do Amigo Secreto
 *     description: Redistribui os pares do sorteio de um grupo existente no sistema.
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do grupo para o qual o sorteio será redistribuído.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sorteio redistribuído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Sorteio redistribuído com sucesso para o grupo."
 *                 resultado:
 *                   type: object
 *                   description: Resultados atualizados do sorteio.
 *       403:
 *         description: Acesso negado. Somente administradores podem realizar esta ação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Acesso restrito a administradores."
 *       404:
 *         description: Grupo não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Grupo não encontrado."
 *       400:
 *         description: Erro de validação ou problemas no processamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao redistribuir o sorteio."
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro interno no servidor."
 */

router.post("/reajustargroupId", auth, isAdmin, async (req, res) => {
  try {
    const result = await reajustar(req.params.groupId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
