const usuariosService = require("../services/usuariosService");

async function listar(req, res) {
    try {
        const usuarios = await usuariosService.listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ erro: "Erro ao listar usuários." });
    }
}

async function obterPerfil(req, res) {
    try {
        const usuario = await usuariosService.buscarUsuarioPorUid(req.user.uid);

        if (!usuario) {
            return res.status(404).json({ erro: "Perfil de usuário não encontrado no banco de dados." });
        }

        res.json(usuario);
    } catch (error) {
        console.error("Erro ao obter perfil de usuário:", error);
        res.status(500).json({ erro: "Erro ao buscar dados do perfil." });
    }
}

async function criar(req, res) {
    const { nome, telefone, endereco } = req.body;

    try {
        const existente = await usuariosService.buscarUsuarioPorUid(req.user.uid);

        if (existente) {
            return res.status(400).json({ erro: "Perfil de usuário já cadastrado." });
        }

        const novoUsuario = await usuariosService.criarUsuario({
            uid: req.user.uid,
            email: req.user.email,
            nome,
            telefone,
            endereco,
        });

        res.status(201).json(novoUsuario);
    } catch (error) {
        console.error("Erro ao criar perfil de usuário:", error);
        res.status(500).json({ erro: "Erro ao criar perfil do usuário." });
    }
}

async function atualizarPerfilProprio(req, res) {
    try {
        const updates = await usuariosService.atualizarPerfilProprio(req.user.uid, req.body);

        if (!updates) {
            return res.status(404).json({ erro: "Perfil de usuário não encontrado." });
        }

        res.json({ mensagem: "Perfil atualizado com sucesso.", camposAtualizados: updates });
    } catch (error) {
        console.error("Erro ao atualizar perfil de usuário:", error);
        res.status(500).json({ erro: "Erro ao atualizar dados do perfil." });
    }
}

async function atualizarPorAdmin(req, res) {
    try {
        const updates = await usuariosService.atualizarUsuarioPorAdmin(req.params.id, req.body);

        if (!updates) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        res.json({ mensagem: "Usuário atualizado com sucesso.", camposAtualizados: updates });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ erro: "Erro ao atualizar usuário." });
    }
}

async function excluir(req, res) {
    try {
        const sucesso = await usuariosService.excluirUsuario(req.params.id);

        if (!sucesso) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        res.json({ mensagem: "Usuário removido com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        res.status(500).json({ erro: "Erro ao excluir usuário." });
    }
}

module.exports = {
    listar,
    obterPerfil,
    criar,
    atualizarPerfilProprio,
    atualizarPorAdmin,
    excluir,
};
