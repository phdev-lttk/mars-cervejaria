const { z } = require("zod");

// Coerção para number: aceita "24.90" (string vinda de form) ou 24.90 (number)
const numero = z.coerce.number();

// imagemUrl: aceita string vazia ou uma URL válida.
const imagemUrlSchema = z.union([z.string().trim().url("URL da imagem inválida."), z.literal("")]);

/**
 * Schema para criação de uma cerveja (POST /api/cervejas).
 * nome, tipo e preco são obrigatórios.
 */
const criarCervejaSchema = z.object({
    nome: z.string().trim().min(1, "O campo nome é obrigatório.").max(100, "Nome deve ter no máximo 100 caracteres."),
    tipo: z.string().trim().min(1, "O campo tipo é obrigatório.").max(50, "Tipo deve ter no máximo 50 caracteres."),
    abv: numero.min(0, "ABV não pode ser negativo.").max(100, "ABV não pode ser maior que 100%.").optional().default(0),
    ibu: numero.min(0, "IBU não pode ser negativo.").max(200, "IBU não pode ser maior que 200.").optional().default(0),
    descricao: z.string().trim().max(1000, "Descrição deve ter no máximo 1000 caracteres.").optional().default(""),
    imagemUrl: imagemUrlSchema.optional().default(""),
    preco: numero.min(0, "Preço não pode ser negativo.").max(100000, "Preço não pode ser maior que 100000."),
    disponivel: z.coerce.boolean().optional().default(true),
});

/**
 * Schema para atualização de uma cerveja (PUT /api/cervejas/:id).
 * Todos os campos são opcionais, mas pelo menos um deve ser enviado.
 */
const atualizarCervejaSchema = z.object({
    nome: z.string().trim().min(1).max(100, "Nome deve ter no máximo 100 caracteres.").optional(),
    tipo: z.string().trim().min(1).max(50, "Tipo deve ter no máximo 50 caracteres.").optional(),
    abv: numero.min(0).max(100, "ABV não pode ser maior que 100%.").optional(),
    ibu: numero.min(0).max(200, "IBU não pode ser maior que 200.").optional(),
    descricao: z.string().trim().max(1000, "Descrição deve ter no máximo 1000 caracteres.").optional(),
    imagemUrl: imagemUrlSchema.optional(),
    preco: numero.min(0).max(100000, "Preço não pode ser maior que 100000.").optional(),
    disponivel: z.coerce.boolean().optional(),
}).refine((dados) => Object.keys(dados).length > 0, {
    message: "Envie ao menos um campo para atualizar.",
});

/**
 * Schema para query string de listagem (GET /api/cervejas).
 */
const listarCervejasQuerySchema = z.object({
    disponiveis: z.enum(["true", "false"]).optional(),
});

module.exports = {
    criarCervejaSchema,
    atualizarCervejaSchema,
    listarCervejasQuerySchema,
};
