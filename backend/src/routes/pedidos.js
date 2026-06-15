const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
    criarPedidoSchema,
    atualizarStatusPedidoSchema,
    listarPedidosQuerySchema,
} = require("../validations/pedidoSchema");

// GET /api/pedidos - Listar todos os pedidos (Admin)
router.get("/", authenticateToken, requireAdmin, validate(listarPedidosQuerySchema, "query"), pedidosController.listarTodos);

// GET /api/pedidos/meus - Listar os pedidos do usuário autenticado
router.get("/meus", authenticateToken, pedidosController.listarMeus);

// GET /api/pedidos/:id - Obter detalhes de um pedido específico (Dono ou Admin)
router.get("/:id", authenticateToken, pedidosController.obterPorId);

// POST /api/pedidos - Criar um novo pedido
router.post("/", authenticateToken, validate(criarPedidoSchema), pedidosController.criar);

// PATCH /api/pedidos/:id/status - Atualizar o status do pedido (Admin)
router.patch("/:id/status", authenticateToken, requireAdmin, validate(atualizarStatusPedidoSchema), pedidosController.atualizarStatus);

// DELETE /api/pedidos/:id - Remover um pedido (Admin)
router.delete("/:id", authenticateToken, requireAdmin, pedidosController.excluir);

module.exports = router;
