import api from "./api";

/**
 * Busca o perfil do usuário logado na API.
 * O UID é identificado no backend através do token.
 * @returns {Promise<Object>} Perfil do usuário.
 */
export async function getUsuario() {
  const response = await api.get("/usuarios/me");
  return response.data;
}

/**
 * Cria o perfil do usuário no Firestore através da API.
 * O UID é identificado pelo backend através do token.
 * @param {Object} dados - Dados do perfil.
 * @returns {Promise<Object>} Perfil criado.
 */
export async function criarUsuario(dados) {
  const response = await api.post("/usuarios", dados);
  return response.data;
}

/**
 * Atualiza dados do perfil do usuário autenticado na API.
 * @param {Object} dados - Campos a atualizar.
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function updateUsuario(dados) {
  const response = await api.put("/usuarios/me", dados);
  return response.data;
}

/**
 * Lista todos os usuários (Requer Auth Admin).
 * @returns {Promise<Array>} Lista de usuários.
 */
export async function getUsuarios() {
  const response = await api.get("/usuarios");
  return response.data;
}

/**
 * Atualiza dados de um usuário específico (Requer Auth Admin).
 * @param {string} id - UID do usuário.
 * @param {Object} dados - Campos a atualizar.
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function updateUsuarioPorId(id, dados) {
  const response = await api.put(`/usuarios/${id}`, dados);
  return response.data;
}

/**
 * Remove um usuário (Requer Auth Admin).
 * @param {string} id - UID do usuário.
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function deleteUsuario(id) {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
}