const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
    criarUsuarioSchema,
    atualizarPerfilProprioSchema,
    atualizarUsuarioPorAdminSchema,
} = require("../validations/usuarioSchema");

// GET /api/usuarios - Listar todos os usuários (Admin)
router.get("/", authenticateToken, requireAdmin, usuariosController.listar);

// GET /api/usuarios/me - Obter dados do perfil do usuário autenticado
router.get("/me", authenticateToken, usuariosController.obterPerfil);

// POST /api/usuarios - Criar perfil do usuário após o cadastro
router.post("/", authenticateToken, validate(criarUsuarioSchema), usuariosController.criar);

// PUT /api/usuarios/me - Atualizar dados do perfil do usuário autenticado
router.put("/me", authenticateToken, validate(atualizarPerfilProprioSchema), usuariosController.atualizarPerfilProprio);

// PUT /api/usuarios/:id - Atualizar dados de um usuário (Admin)
router.put("/:id", authenticateToken, requireAdmin, validate(atualizarUsuarioPorAdminSchema), usuariosController.atualizarPorAdmin);

// DELETE /api/usuarios/:id - Excluir usuário (Admin)
router.delete("/:id", authenticateToken, requireAdmin, usuariosController.excluir);

module.exports = router;
