import { useEffect, useState } from "react";

function TestConnection() {
  const [status, setStatus] = useState("[API] - INICIANDO CONEXÃO COM BACKEND...");

  useEffect(() => {
    async function testarConexao() {
      try {
        const response = await fetch("http://localhost:5000/health");
        if (response.ok) {
          const data = await response.json();
          setStatus(`[API] - Conexão OK! Status do Servidor: ${data.status}`);
          console.log("[API] - CONECTADO AO BACKEND COM ÊXITO", data);
        } else {
          throw new Error("Resposta de erro do servidor");
        }
      } catch (error) {
        setStatus("[API] - Erro na conexão com o backend (porta 5000)");
        console.error("Erro:", error);
      }
    }

    testarConexao();
  }, []);

  return null; // Apenas loga no console
}

export default TestConnection;