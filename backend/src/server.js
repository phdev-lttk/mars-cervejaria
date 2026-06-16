require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do CORS
// Permite requisições apenas da origem do frontend React por padrão (geralmente localhost:3000)
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware para processar JSON nas requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Importação das rotas
const cervejasRoutes = require("./routes/cervejas");
const usuariosRoutes = require("./routes/usuarios");
const pedidosRoutes = require("./routes/pedidos");
const adminsRoutes = require("./routes/admins");
// const uploadRoutes = require("./routes/upload");

// Definição das rotas com prefixo /api
app.use("/api/cervejas", cervejasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/admins", adminsRoutes);
// app.use("/api/upload", uploadRoutes);

// Rota de status simples do servidor
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Tratamento de rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Middleware genérico para tratamento de erros
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]:", err.stack);
  res.status(500).json({ erro: "Erro interno no servidor." });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Servidor rodando com sucesso na porta ${PORT}`);
});
