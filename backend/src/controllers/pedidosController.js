const pedidoService = require("../services/pedidoService");

async function listarTodos(req, res) {
    try {
        const { status } = req.query;
        const pedidos = await pedidoService.listarTodosPedidos(status);
        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao listar todos os pedidos (admin):", error);
        res.status(500).json({ erro: "Erro ao buscar todos os pedidos." });
    }
}

async function listarMeus(req, res) {
    try {
        const pedidos = await pedidoService.listarPedidosPorUsuario(req.user.uid);
        res.json(pedidos);
    } catch (error) {
        console.error("Erro ao listar pedidos do usuário:", error);
        res.status(500).json({ erro: "Erro ao buscar seus pedidos." });
    }
}

async function obterPorId(req, res) {
    try {
        const pedido = await pedidoService.buscarPedidoPorId(req.params.id);

        if (!pedido) {
            return res.status(404).json({ erro: "Pedido não encontrado." });
        }

        const podeVer = await pedidoService.usuarioPodeVerPedido(pedido, req.user.uid);
        if (!podeVer) {
            return res.status(403).json({ erro: "Acesso negado. Você não tem permissão para visualizar este pedido." });
        }

        res.json(pedido);
    } catch (error) {
        console.error("Erro ao obter pedido:", error);
        res.status(500).json({ erro: "Erro ao obter detalhes do pedido." });
    }
}

async function criar(req, res) {
    const { usuarioNome, itens, total } = req.body;

    try {
        const novoPedido = await pedidoService.criarPedido({
            usuarioId: req.user.uid,
            usuarioNome: usuarioNome || req.user.name || "Cliente Mars",
            itens,
            total,
        });

        res.status(201).json(novoPedido);
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        res.status(400).json({ erro: error.message || "Erro ao processar criação de pedido." });
    }
}

async function atualizarStatus(req, res) {
    const { status } = req.body;

    try {
        const resultado = await pedidoService.atualizarStatusPedido(req.params.id, status);

        if (!resultado) {
            return res.status(404).json({ erro: "Pedido não encontrado." });
        }

        res.json({ mensagem: "Status do pedido atualizado com sucesso.", novoStatus: resultado.novoStatus });
    } catch (error) {
        console.error("Erro ao atualizar status do pedido:", error);
        res.status(500).json({ erro: "Erro ao atualizar status do pedido." });
    }
}

async function excluir(req, res) {
    try {
        const sucesso = await pedidoService.excluirPedido(req.params.id);

        if (!sucesso) {
            return res.status(404).json({ erro: "Pedido não encontrado." });
        }

        res.json({ mensagem: "Pedido removido com sucesso." });
    } catch (error) {
        console.error("Erro ao remover pedido:", error);
        res.status(500).json({ erro: "Erro ao remover pedido." });
    }
}

module.exports = {
    listarTodos,
    listarMeus,
    obterPorId,
    criar,
    atualizarStatus,
    excluir,
};
