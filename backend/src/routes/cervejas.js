const express = require("express");
const router = express.Router();
const cervejaController = require("../controllers/cervejaController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
    criarCervejaSchema,
    atualizarCervejaSchema,
    listarCervejasQuerySchema,
} = require("../validations/cervejaSchema");

// GET /api/cervejas - Listar cervejas (Público)
router.get("/", validate(listarCervejasQuerySchema, "query"), cervejaController.listar);

// GET /api/cervejas/:id - Obter uma cerveja específica (Público)
router.get("/:id", cervejaController.obterPorId);

// POST /api/cervejas - Adicionar nova cerveja (Admin)
router.post("/", authenticateToken, requireAdmin, validate(criarCervejaSchema), cervejaController.criar);

// PUT /api/cervejas/:id - Atualizar uma cerveja (Admin)
router.put("/:id", authenticateToken, requireAdmin, validate(atualizarCervejaSchema), cervejaController.atualizar);

// DELETE /api/cervejas/:id - Remover uma cerveja (Admin)
router.delete("/:id", authenticateToken, requireAdmin, cervejaController.excluir);

module.exports = router;
