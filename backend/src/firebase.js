const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("[FIREBASE] Inicializado com chave serviceAccountKey.json com sucesso.");
} else {
  console.warn(
    "[FIREBASE WARNING] Arquivo 'serviceAccountKey.json' não foi encontrado na raiz do backend!\n" +
    "Por favor, faça o download da chave privada no Firebase Console:\n" +
    "Configurações do Projeto > Contas de Serviço > Gerar nova chave privada\n" +
    "E salve-o como 'serviceAccountKey.json' na raiz da pasta 'mars-cervejaria-backend'.\n" +
    "Tentando inicializar com as credenciais padrão do ambiente..."
  );
  try {
    admin.initializeApp();
  } catch (error) {
    console.error("[FIREBASE ERROR] Falha ao inicializar Firebase Admin:", error.message);
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
};
