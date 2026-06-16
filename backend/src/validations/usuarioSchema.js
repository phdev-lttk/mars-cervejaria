const { z } = require("zod");

// Telefone: aceita o formato mascarado gerado pelo front, (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX,
// ou apenas os dígitos equivalentes (10 ou 11 dígitos, DDD + número).
const REGEX_TELEFONE = /^(\(\d{2}\) \d{4,5}-\d{4}|\d{10,11})$/;

// CEP: aceita o formato mascarado 00000-000 ou apenas 8 dígitos.
const REGEX_CEP = /^(\d{5}-\d{3}|\d{8})$/;

// Estado (UF): exatamente 2 letras, normalizado para maiúsculas.
const ufSchema = z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/, "Estado deve ser a sigla da UF (2 letras).");

const telefoneSchema = z
    .string()
    .trim()
    .regex(REGEX_TELEFONE, "Telefone inválido. Use o formato (DD) 9XXXX-XXXX ou apenas números.");

const cepSchema = z
    .string()
    .trim()
    .regex(REGEX_CEP, "CEP inválido. Use o formato 00000-000 ou 00000000.");

/**
 * Schema do objeto endereço, usado dentro de usuários.
 * Todos os subcampos são strings opcionais (com default "").
 * Quando preenchidos, estado e cep precisam ter formato válido.
 */
const enderecoSchema = z.object({
    rua: z.string().trim().max(150, "Rua deve ter no máximo 150 caracteres.").optional().default(""),
    numero: z.string().trim().max(20, "Número deve ter no máximo 20 caracteres.").optional().default(""),
    complemento: z.string().trim().max(100, "Complemento deve ter no máximo 100 caracteres.").optional().default(""),
    bairro: z.string().trim().max(100, "Bairro deve ter no máximo 100 caracteres.").optional().default(""),
    cidade: z.string().trim().max(100, "Cidade deve ter no máximo 100 caracteres.").optional().default(""),
    estado: z.union([ufSchema, z.literal("")]).optional().default(""),
    cep: z.union([cepSchema, z.literal("")]).optional().default(""),
});

/**
 * Schema para criação do perfil de usuário (POST /api/usuarios).
 * O uid e o email vêm do token autenticado, não do corpo da requisição.
 */
// Data de nascimento: aceita formato YYYY-MM-DD (gerado pelo input[type=date]) ou string vazia.
const dataNascimentoSchema = z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento deve estar no formato YYYY-MM-DD.")
    .refine((d) => !isNaN(new Date(d).getTime()), "Data de nascimento inválida.");

const criarUsuarioSchema = z.object({
    nome: z.string().trim().max(100, "Nome deve ter no máximo 100 caracteres.").optional().default(""),
    telefone: z.union([telefoneSchema, z.literal("")]).optional().default(""),
    dataNascimento: z.union([dataNascimentoSchema, z.literal("")]).optional().default(""),
    endereco: enderecoSchema.optional(),
});

/**
 * Schema para o usuário autenticado atualizar o próprio perfil (PUT /api/usuarios/me).
 * Campos permitidos: nome, telefone, endereco.
 */
const atualizarPerfilProprioSchema = z.object({
    nome: z.string().trim().min(1).max(100, "Nome deve ter no máximo 100 caracteres.").optional(),
    telefone: telefoneSchema.optional(),
    dataNascimento: z.union([dataNascimentoSchema, z.literal("")]).optional(),
    endereco: enderecoSchema.optional(),
}).refine((dados) => Object.keys(dados).length > 0, {
    message: "Envie ao menos um campo para atualizar.",
});

/**
 * Schema para o admin atualizar dados de qualquer usuário (PUT /api/usuarios/:id).
 * Campos permitidos: nome, email, telefone, endereco.
 */
const atualizarUsuarioPorAdminSchema = z.object({
    nome: z.string().trim().min(1).max(100, "Nome deve ter no máximo 100 caracteres.").optional(),
    email: z.string().trim().email("Email inválido.").max(150, "Email deve ter no máximo 150 caracteres.").optional(),
    telefone: telefoneSchema.optional(),
    endereco: enderecoSchema.optional(),
}).refine((dados) => Object.keys(dados).length > 0, {
    message: "Envie ao menos um campo para atualizar.",
});

module.exports = {
    enderecoSchema,
    criarUsuarioSchema,
    atualizarPerfilProprioSchema,
    atualizarUsuarioPorAdminSchema,
};
