const express = require("express");
const router = express.Router();
const adminsController = require("../controllers/adminsController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { adicionarAdminSchema } = require("../validations/adminSchema");

// GET /api/admins/verificar - Verificar se o usuário logado é admin
router.get("/verificar", authenticateToken, adminsController.verificar);

// GET /api/admins - Listar todos os administradores cadastrados (Admin)
router.get("/", authenticateToken, requireAdmin, adminsController.listar);

// POST /api/admins - Adicionar um novo administrador (Admin)
router.post("/", authenticateToken, requireAdmin, validate(adicionarAdminSchema), adminsController.adicionar);

module.exports = router;
