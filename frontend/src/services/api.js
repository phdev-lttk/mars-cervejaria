import { auth } from "../firebase";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

/**
 * Função utilitária para fazer requisições HTTP para a API Backend.
 * Obtém e inclui automaticamente o Token JWT do Firebase Auth.
 * 
 * @param {string} endpoint - O endpoint a ser chamado (ex: '/cervejas' ou '/pedidos')
 * @param {Object} [options={}] - Configurações padrão do fetch (method, body, headers, etc)
 * @returns {Promise<any>} Resposta JSON da API
 */
export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Garante que o header Authorization seja preenchido se o usuário estiver logado
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (authError) {
    console.warn("[API SERVICE] Não foi possível recuperar o token de autenticação:", authError.message);
  }

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let erroMsg = "Erro na requisição da API";
    try {
      const errorData = await response.json();
      erroMsg = errorData.erro || erroMsg;
    } catch (_) {
      // Falha ao ler JSON de erro
    }
    throw new Error(erroMsg);
  }

  return response.json();
}
