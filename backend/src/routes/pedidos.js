const express = require("express");
const router = express.Router();
const { db, admin } = require("../firebase");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const COLECAO = "pedidos";

const STATUS_PEDIDO = {
  PENDENTE: "pendente",
  CONFIRMADO: "confirmado",
  EM_PREPARO: "em_preparo",
  ENVIADO: "enviado",
  ENTREGUE: "entregue",
  CANCELADO: "cancelado"
};

// GET /api/pedidos - Listar todos os pedidos (Admin)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    let queryRef = db.collection(COLECAO);

    if (status) {
      queryRef = queryRef.where("status", "==", status);
    }

    queryRef = queryRef.orderBy("criadoEm", "desc");

    const snapshot = await queryRef.get();
    const pedidos = [];

    snapshot.forEach((doc) => {
      const dados = doc.data();
      pedidos.push({
        id: doc.id,
        ...dados,
        criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
        atualizadoEm: dados.atualizadoEm ? dados.atualizadoEm.toDate() : null
      });
    });

    res.json(pedidos);
  } catch (error) {
    console.error("Erro ao listar todos os pedidos (admin):", error);
    res.status(500).json({ erro: "Erro ao buscar todos os pedidos." });
  }
});

// GET /api/pedidos/meus - Listar os pedidos do usuário autenticado
router.get("/meus", authenticateToken, async (req, res) => {
  try {
    const queryRef = db
      .collection(COLECAO)
      .where("usuarioId", "==", req.user.uid)
      .orderBy("criadoEm", "desc");

    const snapshot = await queryRef.get();
    const pedidos = [];

    snapshot.forEach((doc) => {
      const dados = doc.data();
      pedidos.push({
        id: doc.id,
        ...dados,
        criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
        atualizadoEm: dados.atualizadoEm ? dados.atualizadoEm.toDate() : null
      });
    });

    res.json(pedidos);
  } catch (error) {
    console.error("Erro ao listar pedidos do usuário:", error);
    res.status(500).json({ erro: "Erro ao buscar seus pedidos." });
  }
});

// GET /api/pedidos/:id - Obter detalhes de um pedido específico (Dono ou Admin)
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const docRef = db.collection(COLECAO).doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ erro: "Pedido não encontrado." });
    }

    const dados = docSnap.data();

    // Verifica se o usuário é o dono do pedido ou se é admin
    const isAdminUser = await db.collection("admins").doc(req.user.uid).get().then(snap => snap.exists);
    if (dados.usuarioId !== req.user.uid && !isAdminUser) {
      return res.status(403).json({ erro: "Acesso negado. Você não tem permissão para visualizar este pedido." });
    }

    res.json({
      id: docSnap.id,
      ...dados,
      criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
      atualizadoEm: dados.atualizadoEm ? dados.atualizadoEm.toDate() : null
    });
  } catch (error) {
    console.error("Erro ao obter pedido:", error);
    res.status(500).json({ erro: "Erro ao obter detalhes do pedido." });
  }
});

// POST /api/pedidos - Criar um novo pedido
router.post("/", authenticateToken, async (req, res) => {
  const { usuarioNome, itens, total } = req.body;

  if (!itens || !Array.isArray(itens) || itens.length === 0 || total === undefined) {
    return res.status(400).json({ erro: "Dados do pedido inválidos ou incompletos." });
  }

  try {
    const novosItens = itens.map((item) => {
      if (!item.cervejaId || !item.nome || !item.quantidade || !item.precoUnitario) {
        throw new Error("Item de pedido incompleto.");
      }
      return {
        cervejaId: item.cervejaId,
        nome: item.nome,
        quantidade: Number(item.quantidade),
        precoUnitario: Number(item.precoUnitario)
      };
    });

    const novoPedido = {
      usuarioId: req.user.uid,
      usuarioNome: usuarioNome || req.user.name || "Cliente Mars",
      itens: novosItens,
      total: Number(total),
      status: STATUS_PEDIDO.PENDENTE,
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection(COLECAO).add(novoPedido);
    res.status(201).json({ id: docRef.id, ...novoPedido });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(400).json({ erro: error.message || "Erro ao processar criação de pedido." });
  }
});

// PATCH /api/pedidos/:id/status - Atualizar o status do pedido (Admin)
router.patch("/:id/status", authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;

  if (!status || !Object.values(STATUS_PEDIDO).includes(status)) {
    return res.status(400).json({ erro: `Status inválido. Escolha um dos seguintes: ${Object.values(STATUS_PEDIDO).join(", ")}` });
  }

  try {
    const docRef = db.collection(COLECAO).doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ erro: "Pedido não encontrado." });
    }

    await docRef.update({
      status,
      atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ mensagem: "Status do pedido atualizado com sucesso.", novoStatus: status });
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    res.status(500).json({ erro: "Erro ao atualizar status do pedido." });
  }
});

module.exports = router;
