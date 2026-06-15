const { auth, db } = require("../firebase");

/**
 * Middleware para validar o token JWT enviado pelo Firebase Auth no Frontend.
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Espera "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ erro: "Token de autenticação não fornecido." });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || ""
    };
    next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE] Erro ao verificar token:", error.message);
    return res.status(403).json({ erro: "Token inválido ou expirado." });
  }
}

/**
 * Middleware que exige que o usuário autenticado seja um administrador.
 * Deve ser colocado após o authenticateToken nas rotas.
 */
async function requireAdmin(req, res, next) {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ erro: "Usuário não autenticado." });
  }

  try {
    const adminDocRef = db.collection("admins").doc(req.user.uid);
    const adminDoc = await adminDocRef.get();

    if (!adminDoc.exists) {
      return res.status(403).json({ erro: "Acesso negado. Apenas administradores podem realizar esta ação." });
    }

    req.user.role = adminDoc.data().role || "admin";
    next();
  } catch (error) {
    console.error("[AUTH MIDDLEWARE] Erro ao verificar privilégios de administrador:", error.message);
    return res.status(500).json({ erro: "Erro interno no servidor ao validar permissões." });
  }
}

module.exports = {
  authenticateToken,
  requireAdmin
};
