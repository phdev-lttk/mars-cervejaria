import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

async function testarConexao() {
  try {
    const snapshot = await getDocs(collection(db, "usuarios")); // nome da sua coleção
    console.log("Conexão OK! Documentos encontrados:", snapshot.size);

    snapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
    });
  } catch (error) {
    console.error("Erro na conexão com o Firebase:", error);
  }
}

testarConexao();