const adminService = require("../services/adminService");

async function verificar(req, res) {
    try {
        const resultado = await adminService.verificarAdmin(req.user.uid);
        res.json(resultado);
    } catch (error) {
        console.error("Erro ao verificar status de admin:", error);
        res.status(500).json({ erro: "Erro ao verificar permissão administrativa." });
    }
}

async function listar(req, res) {
    try {
        const admins = await adminService.listarAdmins();
        res.json(admins);
    } catch (error) {
        console.error("Erro ao listar administradores:", error);
        res.status(500).json({ erro: "Erro ao listar administradores." });
    }
}

async function adicionar(req, res) {
    const { uid, email, nome, role } = req.body;

    try {
        const novoAdmin = await adminService.adicionarAdmin({ uid, email, nome, role });

        if (!novoAdmin) {
            return res.status(400).json({ erro: "Usuário já possui privilégios de administrador." });
        }

        res.status(201).json(novoAdmin);
    } catch (error) {
        console.error("Erro ao adicionar administrador:", error);
        res.status(500).json({ erro: "Erro ao adicionar administrador." });
    }
}

module.exports = {
    verificar,
    listar,
    adicionar,
};
