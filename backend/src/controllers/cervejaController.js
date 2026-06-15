const cervejaService = require("../services/cervejaService");

async function listar(req, res) {
    try {
        const apenasDisponiveis = req.query.disponiveis === "true";
        const cervejas = await cervejaService.listarCervejas(apenasDisponiveis);
        res.json(cervejas);
    } catch (error) {
        console.error("Erro ao listar cervejas:", error);
        res.status(500).json({ erro: "Erro ao buscar catálogo de cervejas." });
    }
}

async function obterPorId(req, res) {
    try {
        const cerveja = await cervejaService.buscarCervejaPorId(req.params.id);

        if (!cerveja) {
            return res.status(404).json({ erro: "Cerveja não encontrada." });
        }

        res.json(cerveja);
    } catch (error) {
        console.error("Erro ao obter cerveja:", error);
        res.status(500).json({ erro: "Erro ao obter detalhes da cerveja." });
    }
}

async function criar(req, res) {
    const { nome, tipo, abv, ibu, descricao, imagemUrl, preco, disponivel } = req.body;

    try {
        const novaCerveja = await cervejaService.criarCerveja({
            nome, tipo, abv, ibu, descricao, imagemUrl, preco, disponivel,
        });
        res.status(201).json(novaCerveja);
    } catch (error) {
        console.error("Erro ao adicionar cerveja:", error);
        res.status(500).json({ erro: "Erro ao adicionar cerveja ao catálogo." });
    }
}

async function atualizar(req, res) {
    try {
        const updates = await cervejaService.atualizarCerveja(req.params.id, req.body);

        if (!updates) {
            return res.status(404).json({ erro: "Cerveja não encontrada." });
        }

        res.json({ mensagem: "Cerveja atualizada com sucesso.", camposAtualizados: updates });
    } catch (error) {
        console.error("Erro ao atualizar cerveja:", error);
        res.status(500).json({ erro: "Erro ao atualizar cerveja." });
    }
}

async function excluir(req, res) {
    try {
        const sucesso = await cervejaService.excluirCerveja(req.params.id);

        if (!sucesso) {
            return res.status(404).json({ erro: "Cerveja não encontrada." });
        }

        res.json({ mensagem: "Cerveja removida com sucesso." });
    } catch (error) {
        console.error("Erro ao remover cerveja:", error);
        res.status(500).json({ erro: "Erro ao remover cerveja." });
    }
}

module.exports = {
    listar,
    obterPorId,
    criar,
    atualizar,
    excluir,
};
