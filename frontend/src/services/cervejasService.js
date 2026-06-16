import api from "./api";

/**
 * Busca todas as cervejas do catálogo da API.
 * @param {boolean} [apenasDisponiveis=false] - Se true, retorna apenas cervejas disponíveis.
 * @returns {Promise<Array>} Lista de cervejas.
 */
export async function getCervejas(apenasDisponiveis = false) {
  const response = await api.get("/cervejas", {
    params: apenasDisponiveis ? { disponiveis: true } : {}
  });
  return response.data;
}

/**
 * Busca uma cerveja por ID na API.
 * @param {string} id - ID da cerveja.
 * @returns {Promise<Object>} Dados da cerveja.
 */
export async function getCervejaPorId(id) {
  const response = await api.get(`/cervejas/${id}`);
  return response.data;
}

/**
 * Adiciona uma nova cerveja ao catálogo (Requer Auth Admin).
 * @param {Object} dados - Dados da cerveja.
 * @returns {Promise<Object>} Cerveja criada.
 */
export async function addCerveja(dados) {
  const response = await api.post("/cervejas", dados);
  return response.data;
}

/**
 * Atualiza dados de uma cerveja existente (Requer Auth Admin).
 * @param {string} id - ID do documento.
 * @param {Object} dados - Campos a atualizar.
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function updateCerveja(id, dados) {
  const response = await api.put(`/cervejas/${id}`, dados);
  return response.data;
}

/**
 * Remove uma cerveja do catálogo (Requer Auth Admin).
 * @param {string} id - ID da cerveja.
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function deleteCerveja(id) {
  const response = await api.delete(`/cervejas/${id}`);
  return response.data;
}