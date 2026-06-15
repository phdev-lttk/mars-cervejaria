import api from "./api";

/**
 * Verifica se o usuário autenticado é admin.
 * @returns {Promise<boolean>} True se o usuário for admin.
 */
export async function verificarAdmin() {
  try {
    const response = await api.get("/admins/verificar");
    return !!response.data.isAdmin;
  } catch (error) {
    console.error("Erro ao verificar admin:", error.message);
    return false;
  }
}

/**
 * Lista todos os administradores (Requer Auth Admin).
 * @returns {Promise<Array>} Lista de admins.
 */
export async function getAdmins() {
  const response = await api.get("/admins");
  return response.data;
}

/**
 * Adiciona um novo administrador (Requer Auth Admin).
 * @param {string} uid - UID do Firebase Auth do novo admin.
 * @param {Object} dados - Dados do admin (email, nome, role).
 * @returns {Promise<Object>} Admin criado.
 */
export async function addAdmin(uid, dados) {
  const response = await api.post("/admins", { uid, ...dados });
  return response.data;
}