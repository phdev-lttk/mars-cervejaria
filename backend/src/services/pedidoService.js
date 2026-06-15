const { db, admin } = require("../firebase");

const COLECAO = "pedidos";

const STATUS_PEDIDO = {
    PENDENTE: "pendente",
    CONFIRMADO: "confirmado",
    EM_PREPARO: "em_preparo",
    ENVIADO: "enviado",
    ENTREGUE: "entregue",
    CANCELADO: "cancelado",
};

function formatarPedido(doc) {
    const dados = doc.data();
    return {
        id: doc.id,
        ...dados,
        criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
        atualizadoEm: dados.atualizadoEm ? dados.atualizadoEm.toDate() : null,
    };
}

async function listarTodosPedidos(statusFiltro) {
    let queryRef = db.collection(COLECAO);

    if (statusFiltro) {
        queryRef = queryRef.where("status", "==", statusFiltro);
    }

    queryRef = queryRef.orderBy("criadoEm", "desc");
    const snapshot = await queryRef.get();
    return snapshot.docs.map(formatarPedido);
}

async function listarPedidosPorUsuario(uid) {
    const snapshot = await db
        .collection(COLECAO)
        .where("usuarioId", "==", uid)
        .orderBy("criadoEm", "desc")
        .get();

    return snapshot.docs.map(formatarPedido);
}

async function buscarPedidoPorId(id) {
    const docRef = db.collection(COLECAO).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;
    return formatarPedido(docSnap);
}

/**
 * Verifica se o usuário é o dono do pedido ou um administrador.
 */
async function usuarioPodeVerPedido(pedido, uid) {
    if (pedido.usuarioId === uid) return true;
    const adminSnap = await db.collection("admins").doc(uid).get();
    return adminSnap.exists;
}

async function criarPedido({ usuarioId, usuarioNome, itens, total }) {
    const novosItens = itens.map((item) => {
        if (!item.cervejaId || !item.nome || !item.quantidade || !item.precoUnitario) {
            throw new Error("Item de pedido incompleto.");
        }
        return {
            cervejaId: item.cervejaId,
            nome: item.nome,
            quantidade: Number(item.quantidade),
            precoUnitario: Number(item.precoUnitario),
        };
    });

    const novoPedido = {
        usuarioId,
        usuarioNome: usuarioNome || "Cliente Mars",
        itens: novosItens,
        total: Number(total),
        status: STATUS_PEDIDO.PENDENTE,
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
        atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(COLECAO).add(novoPedido);
    return { id: docRef.id, ...novoPedido };
}

async function atualizarStatusPedido(id, novoStatus) {
    const docRef = db.collection(COLECAO).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;

    await docRef.update({
        status: novoStatus,
        atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { novoStatus };
}

async function excluirPedido(id) {
    const docRef = db.collection(COLECAO).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return false;

    await docRef.delete();
    return true;
}

module.exports = {
    STATUS_PEDIDO,
    listarTodosPedidos,
    listarPedidosPorUsuario,
    buscarPedidoPorId,
    usuarioPodeVerPedido,
    criarPedido,
    atualizarStatusPedido,
    excluirPedido,
};
