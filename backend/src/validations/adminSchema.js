const { z } = require("zod");

/**
 * Schema para adicionar um novo administrador (POST /api/admins).
 */
const adicionarAdminSchema = z.object({
    uid: z.string().trim().min(1, "O campo uid é obrigatório.").max(128, "uid deve ter no máximo 128 caracteres."),
    email: z.string().trim().email("Email inválido.").max(150, "Email deve ter no máximo 150 caracteres."),
    nome: z.string().trim().max(100, "Nome deve ter no máximo 100 caracteres.").optional().default(""),
    role: z.string().trim().max(30, "Role deve ter no máximo 30 caracteres.").optional().default("admin"),
});

module.exports = {
    adicionarAdminSchema,
};
