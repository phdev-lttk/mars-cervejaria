import api from "./api";

export const STATUS_PEDIDO = {
  PENDENTE: "pendente",
  CONFIRMADO: "confirmado",
  EM_PREPARO: "em_preparo",
  ENVIADO: "enviado",
  ENTREGUE: "entregue",
  CANCELADO: "cancelado"
};

/**
 * Cria um novo pedido na API.
 * @param {Object} dados - Dados do pedido (usuarioNome, itens, total).
 * @returns {Promise<Object>} Pedido criado.
 */
export async function criarPedido(dados) {
  const response = await api.post("/pedidos", dados);
  return response.data;
}

/**
 * Busca todos os pedidos do usuário autenticado na API.
 * O UID é identificado pelo backend através do token.
 * @returns {Promise<Array>} Lista de pedidos do usuário.
 */
export async function getPedidosPorUsuario() {
  const response = await api.get("/pedidos/meus");
  return response.data;
}

/**
 * Busca todos os pedidos (Requer Auth Admin).
 * @param {string} [statusFiltro] - Filtrar por status específico (opcional).
 * @returns {Promise<Array>} Lista de todos os pedidos.
 */
export async function getTodosPedidos(statusFiltro) {
  const response = await api.get("/pedidos", {
    params: statusFiltro ? { status: statusFiltro } : {}
  });
  return response.data;
}

/**
 * Busca um pedido por ID.
 * @param {string} id - ID do pedido.
 * @returns {Promise<Object>} Dados do pedido.
 */
export async function getPedidoPorId(id) {
  const response = await api.get(`/pedidos/${id}`);
  return response.data;
}

/**
 * Atualiza o status de um pedido (Requer Auth Admin).
 * @param {string} id - ID do pedido.
 * @param {string} novoStatus - Novo status (usar STATUS_PEDIDO).
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function updateStatusPedido(id, novoStatus) {
  const response = await api.patch(`/pedidos/${id}/status`, { status: novoStatus });
  return response.data;
}

/**
 * Remove um pedido (Requer Auth Admin).
 * @param {string} id - ID do pedido.
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function deletePedido(id) {
  const response = await api.delete(`/pedidos/${id}`);
  return response.data;
}