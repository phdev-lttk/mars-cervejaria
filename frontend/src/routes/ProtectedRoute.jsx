import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
export default function ProtectedRoute({ children, adminOnly }) {
  const { user } = useContext(AuthContext);
  // Se não estiver logado, manda pro Login
  if (!user) {
    return <Navigate to="/login" />;
  }
  // Se a rota for só para admin, e a pessoa for um cliente comum, chuta ela pra tela inicial
  if (adminOnly && user.email !== "admin@mars.com") {
    alert("Acesso restrito! Você não é um administrador.");
    return <Navigate to="/inicio" />;
  }
  // Se passar nos testes, libera a tela
  return children;
}