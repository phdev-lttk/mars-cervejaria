const express = require("express");
const router = express.Router();
const { db, admin } = require("../firebase");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const COLECAO = "admins";

// GET /api/admins/verificar - Verificar se o usuário logado é admin
router.get("/verificar", authenticateToken, async (req, res) => {
  try {
    const docRef = db.collection(COLECAO).doc(req.user.uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      res.json({ isAdmin: true, role: docSnap.data().role || "admin" });
    } else {
      res.json({ isAdmin: false });
    }
  } catch (error) {
    console.error("Erro ao verificar status de admin:", error);
    res.status(500).json({ erro: "Erro ao verificar permissão administrativa." });
  }
});

// GET /api/admins - Listar todos os administradores cadastrados (Admin)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection(COLECAO).get();
    const admins = [];

    snapshot.forEach((doc) => {
      admins.push({
        uid: doc.id,
        ...doc.data(),
        criadoEm: doc.data().criadoEm ? doc.data().criadoEm.toDate() : null
      });
    });

    res.json(admins);
  } catch (error) {
    console.error("Erro ao listar administradores:", error);
    res.status(500).json({ erro: "Erro ao listar administradores." });
  }
});

// POST /api/admins - Adicionar um novo administrador (Admin)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  const { uid, email, nome, role } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ erro: "Os campos UID e Email do usuário são obrigatórios." });
  }

  try {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return res.status(400).json({ erro: "Usuário já possui privilégios de administrador." });
    }

    const novoAdmin = {
      email,
      nome: nome || "",
      role: role || "admin",
      criadoEm: admin.firestore.FieldValue.serverTimestamp()
    };

    await docRef.set(novoAdmin);
    res.status(201).json({ uid, ...novoAdmin });
  } catch (error) {
    console.error("Erro ao adicionar administrador:", error);
    res.status(500).json({ erro: "Erro ao adicionar administrador." });
  }
});

module.exports = router;
