import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function TestConnection() {
  const [status, setStatus] = useState("[DATABASE] - INICIANDO CONEXÃO...");

  useEffect(() => {
    async function testarConexao() {
      try {
        const snapshot = await getDocs(collection(db, "testeConexao"));

        setStatus(`Conexão OK! Erros encontrados: ${snapshot.size}`);
        console.log("[DATABASE] - CONECTADO COM ÊXITO", snapshot.docs.map((doc) => doc.data()));
      } catch (error) {
        setStatus("Erro na conexão com o Firebase");
        console.error("Erro:", error);
      }
    }

    testarConexao();
  }, []);

  return console.log(status);
}

export default TestConnection;