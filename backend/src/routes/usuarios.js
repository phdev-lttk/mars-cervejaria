const express = require("express");
const router = express.Router();
const { db, admin } = require("../firebase");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const COLECAO = "usuarios";

// GET /api/usuarios - Listar todos os usuários (Admin)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection(COLECAO).orderBy("criadoEm", "desc").get();
    const usuarios = [];
    snapshot.forEach(doc => {
      const dados = doc.data();
      usuarios.push({
        id: doc.id,
        ...dados,
        criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
        atualizadoEm: dados.atualizadoEm ? dados.atualizadoEm.toDate() : null
      });
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ erro: "Erro ao listar usuários." });
  }
});

// GET /api/usuarios/me - Obter dados do perfil do usuário autenticado
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const docRef = db.collection(COLECAO).doc(req.user.uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ erro: "Perfil de usuário não encontrado no banco de dados." });
    }

    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Erro ao obter perfil de usuário:", error);
    res.status(500).json({ erro: "Erro ao buscar dados do perfil." });
  }
});

// POST /api/usuarios - Criar perfil do usuário após o cadastro
router.post("/", authenticateToken, async (req, res) => {
  const { nome, telefone, endereco } = req.body;

  try {
    const docRef = db.collection(COLECAO).doc(req.user.uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return res.status(400).json({ erro: "Perfil de usuário já cadastrado." });
    }

    const novoUsuario = {
      nome: nome || "",
      email: req.user.email,
      telefone: telefone || "",
      endereco: endereco || { rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", cep: "" },
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
      atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    };

    await docRef.set(novoUsuario);
    res.status(201).json({ uid: req.user.uid, ...novoUsuario });
  } catch (error) {
    console.error("Erro ao criar perfil de usuário:", error);
    res.status(500).json({ erro: "Erro ao criar perfil do usuário." });
  }
});

// PUT /api/usuarios/me - Atualizar dados do perfil do usuário autenticado
router.put("/me", authenticateToken, async (req, res) => {
  try {
    const docRef = db.collection(COLECAO).doc(req.user.uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ erro: "Perfil de usuário não encontrado." });
    }

    const updates = {};
    const camposPermitidos = ["nome", "telefone", "endereco"];

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        if (campo === "endereco" && typeof req.body[campo] === "object") {
          const subcampos = ["rua", "numero", "complemento", "bairro", "cidade", "estado", "cep"];
          const endObj = {};
          subcampos.forEach(sub => {
            endObj[sub] = req.body[campo][sub] !== undefined ? String(req.body[campo][sub]) : "";
          });
          updates[campo] = endObj;
        } else {
          updates[campo] = String(req.body[campo]);
        }
      }
    });

    updates.atualizadoEm = admin.firestore.FieldValue.serverTimestamp();
    await docRef.update(updates);
    res.json({ mensagem: "Perfil atualizado com sucesso.", camposAtualizados: updates });
  } catch (error) {
    console.error("Erro ao atualizar perfil de usuário:", error);
    res.status(500).json({ erro: "Erro ao atualizar dados do perfil." });
  }
});

// DELETE /api/usuarios/:id - Excluir usuário (Admin)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const docRef = db.collection(COLECAO).doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    await docRef.delete();
    res.json({ mensagem: "Usuário removido com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ erro: "Erro ao excluir usuário." });
  }
});

module.exports = router;