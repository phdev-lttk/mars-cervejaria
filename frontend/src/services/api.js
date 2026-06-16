import axios from "axios";
import { auth } from "../firebase";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Instância do axios configurada com a URL base da API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor de requisição: injeta o token JWT do Firebase Auth automaticamente
api.interceptors.request.use(async (config) => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (authError) {
    console.warn("[API SERVICE] Não foi possível recuperar o token de autenticação:", authError.message);
  }
  return config;
});

// Interceptor de resposta: padroniza a mensagem de erro vinda do backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const erroMsg = error.response?.data?.erro || error.message || "Erro na requisição da API";
    return Promise.reject(new Error(erroMsg));
  }
);

export default api;