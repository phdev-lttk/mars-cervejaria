import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "sans-serif"
      }}>
        Verificando permissões...
      </div>
    );
  }

  // Só permite acessar se estiver autenticado E for administrador no Firestore
  return user && isAdmin ? children : <Navigate to="/login" />;
}