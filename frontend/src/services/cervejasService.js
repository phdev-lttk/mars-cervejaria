import { fetchAPI } from "./api";

/**
 * Busca todas as cervejas do catálogo da API.
 * @param {boolean} [apenasDisponiveis=false] - Se true, retorna apenas cervejas disponíveis.
 * @returns {Promise<Array>} Lista de cervejas.
 */
export async function getCervejas(apenasDisponiveis = false) {
  const queryParam = apenasDisponiveis ? "?disponiveis=true" : "";
  return fetchAPI(`/cervejas${queryParam}`);
}

/**
 * Busca uma cerveja por ID na API.
 * @param {string} id - ID da cerveja.
 * @returns {Promise<Object>} Dados da cerveja.
 */
export async function getCervejaPorId(id) {
  return fetchAPI(`/cervejas/${id}`);
}

/**
 * Adiciona uma nova cerveja ao catálogo (Requer Auth Admin).
 * @param {Object} dados - Dados da cerveja.
 * @returns {Promise<Object>} Cerveja criada.
 */
export async function addCerveja(dados) {
  return fetchAPI("/cervejas", {
    method: "POST",
    body: dados
  });
}

/**
 * Atualiza dados de uma cerveja existente (Requer Auth Admin).
 * @param {string} id - ID do documento.
 * @param {Object} dados - Campos a atualizar.
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function updateCerveja(id, dados) {
  return fetchAPI(`/cervejas/${id}`, {
    method: "PUT",
    body: dados
  });
}

/**
 * Remove uma cerveja do catálogo (Requer Auth Admin).
 * @param {string} id - ID da cerveja.
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function deleteCerveja(id) {
  return fetchAPI(`/cervejas/${id}`, {
    method: "DELETE"
  });
}
