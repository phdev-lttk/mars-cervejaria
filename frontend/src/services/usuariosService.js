import { fetchAPI } from "./api";

/**
 * Busca o perfil do usuário logado na API.
 * O UID é identificado no backend através do token.
 * @returns {Promise<Object>} Perfil do usuário.
 */
export async function getUsuario() {
  return fetchAPI("/usuarios/me");
}

/**
 * Cria o perfil do usuário no Firestore através da API.
 * O UID é identificado pelo backend através do token.
 * @param {Object} dados - Dados do perfil.
 * @returns {Promise<Object>} Perfil criado.
 */
export async function criarUsuario(dados) {
  return fetchAPI("/usuarios", {
    method: "POST",
    body: dados
  });
}

/**
 * Atualiza dados do perfil do usuário na API.
 * @param {Object} dados - Campos a atualizar.
 * @returns {Promise<Object>} Mensagem de sucesso.
 */
export async function updateUsuario(dados) {
  return fetchAPI("/usuarios/me", {
    method: "PUT",
    body: dados
  });
}
