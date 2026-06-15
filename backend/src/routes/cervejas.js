const express = require("express");
const router = express.Router();
const { db, admin } = require("../firebase");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const COLECAO = "cervejas";

// GET /api/cervejas - Listar cervejas (Público)
router.get("/", async (req, res) => {
  try {
    const apenasDisponiveis = req.query.disponiveis === "true";
    let queryRef = db.collection(COLECAO);

    if (apenasDisponiveis) {
      queryRef = queryRef.where("disponivel", "==", true);
    }

    // Ordena pelo campo criadoEm decrescente
    queryRef = queryRef.orderBy("criadoEm", "desc");

    const snapshot = await queryRef.get();
    const cervejas = [];

    snapshot.forEach((doc) => {
      cervejas.push({
        id: doc.id,
        ...doc.data(),
        // Trata conversão do timestamp do Firestore para o cliente (se existir)
        criadoEm: doc.data().criadoEm ? doc.data().criadoEm.toDate() : null,
        atualizadoEm: doc.data().atualizadoEm ? doc.data().atualizadoEm.toDate() : null
      });
    });

    res.json(cervejas);
  } catch (error) {
    console.error("Erro ao listar cervejas:", error);
    res.status(500).json({ erro: "Erro ao buscar catálogo de cervejas." });
  }
});

// GET /api/cervejas/:id - Obter uma cerveja específica (Público)
router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection(COLECAO).doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ erro: "Cerveja não encontrada." });
    }

    const dados = docSnap.data();
    res.json({
      id: docSnap.id,
      ...dados,
      criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
      atualizadoEm: dados.atualizadoEm ? dados.atualizadoEm.toDate() : null
    });
  } catch (error) {
    console.error("Erro ao obter cerveja:", error);
    res.status(500).json({ erro: "Erro ao obter detalhes da cerveja." });
  }
});

// POST /api/cervejas - Adicionar nova cerveja (Admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  const { nome, tipo, abv, ibu, descricao, imagemUrl, preco, disponivel } = req.body;

  if (!nome || !tipo || preco === undefined) {
    return res.status(400).json({ erro: "Os campos nome, tipo e preço são obrigatórios." });
  }

  try {
    const novaCerveja = {
      nome,
      tipo,
      abv: abv !== undefined ? Number(abv) : 0,
      ibu: ibu !== undefined ? Number(ibu) : 0,
      descricao: descricao || "",
      imagemUrl: imagemUrl || "",
      preco: Number(preco),
      disponivel: disponivel !== undefined ? Boolean(disponivel) : true,
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection(COLECAO).add(novaCerveja);
    res.status(201).json({ id: docRef.id, ...novaCerveja });
  } catch (error) {
    console.error("Erro ao adicionar cerveja:", error);
    res.status(500).json({ erro: "Erro ao adicionar cerveja ao catálogo." });
  }
});

// PUT /api/cervejas/:id - Atualizar uma cerveja (Admin)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const docRef = db.collection(COLECAO).doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ erro: "Cerveja não encontrada." });
    }

    const updates = {};
    const camposPermitidos = ["nome", "tipo", "abv", "ibu", "descricao", "imagemUrl", "preco", "disponivel"];

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        if (campo === "abv" || campo === "ibu" || campo === "preco") {
          updates[campo] = Number(req.body[campo]);
        } else if (campo === "disponivel") {
          updates[campo] = Boolean(req.body[campo]);
        } else {
          updates[campo] = req.body[campo];
        }
      }
    });

    updates.atualizadoEm = admin.firestore.FieldValue.serverTimestamp();

    await docRef.update(updates);
    res.json({ mensagem: "Cerveja atualizada com sucesso.", camposAtualizados: updates });
  } catch (error) {
    console.error("Erro ao atualizar cerveja:", error);
    res.status(500).json({ erro: "Erro ao atualizar cerveja." });
  }
});

// DELETE /api/cervejas/:id - Remover uma cerveja (Admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const docRef = db.collection(COLECAO).doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ erro: "Cerveja não encontrada." });
    }

    await docRef.delete();
    res.json({ mensagem: "Cerveja removida com sucesso." });
  } catch (error) {
    console.error("Erro ao remover cerveja:", error);
    res.status(500).json({ erro: "Erro ao remover cerveja." });
  }
});

module.exports = router;
