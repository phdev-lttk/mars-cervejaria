const { z } = require("zod");

const STATUS_PEDIDO = [
    "pendente",
    "confirmado",
    "em_preparo",
    "enviado",
    "entregue",
    "cancelado",
];

/**
 * Schema de cada item dentro do array "itens" de um pedido.
 */
const itemPedidoSchema = z.object({
    cervejaId: z.string().trim().min(1, "cervejaId é obrigatório.").max(100, "cervejaId deve ter no máximo 100 caracteres."),
    nome: z.string().trim().min(1, "nome do item é obrigatório.").max(100, "Nome do item deve ter no máximo 100 caracteres."),
    quantidade: z.coerce.number().int("Quantidade deve ser um número inteiro.").positive("Quantidade deve ser maior que zero.").max(1000, "Quantidade não pode ser maior que 1000."),
    precoUnitario: z.coerce.number().nonnegative("precoUnitario não pode ser negativo.").max(100000, "precoUnitario não pode ser maior que 100000."),
});

/**
 * Schema para criação de um pedido (POST /api/pedidos).
 * usuarioId é preenchido pelo backend a partir do token, não vem do body.
 */
const criarPedidoSchema = z.object({
    usuarioNome: z.string().trim().max(100, "usuarioNome deve ter no máximo 100 caracteres.").optional(),
    itens: z.array(itemPedidoSchema).min(1, "O pedido precisa ter ao menos um item.").max(100, "O pedido não pode ter mais de 100 itens."),
    total: z.coerce.number().nonnegative("O total não pode ser negativo.").max(1000000, "O total não pode ser maior que 1000000."),
});

/**
 * Schema para atualização de status (PATCH /api/pedidos/:id/status).
 */
const atualizarStatusPedidoSchema = z.object({
    status: z.enum(STATUS_PEDIDO, {
        errorMap: () => ({ message: `Status inválido. Escolha um dos seguintes: ${STATUS_PEDIDO.join(", ")}` }),
    }),
});

/**
 * Schema para query string de listagem (GET /api/pedidos).
 */
const listarPedidosQuerySchema = z.object({
    status: z.enum(STATUS_PEDIDO).optional(),
});

module.exports = {
    STATUS_PEDIDO,
    itemPedidoSchema,
    criarPedidoSchema,
    atualizarStatusPedidoSchema,
    listarPedidosQuerySchema,
};
