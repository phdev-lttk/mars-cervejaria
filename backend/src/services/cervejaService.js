const { db, admin } = require("../firebase");

const COLECAO = "cervejas";

async function listarCervejas(apenasDisponiveis = false) {
    let queryRef = db.collection(COLECAO);

    if (apenasDisponiveis) {
        queryRef = queryRef.where("disponivel", "==", true);
    }

    queryRef = queryRef.orderBy("criadoEm", "desc");

    const snapshot = await queryRef.get();
    return snapshot.docs.map((doc) => {
        const dados = doc.data();
        return {
            id: doc.id,
            ...dados,
            criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
            atualizadoEm: dados.atualizadoEm ? dados.atualizadoEm.toDate() : null,
        };
    });
}

async function buscarCervejaPorId(id) {
    const docRef = db.collection(COLECAO).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;

    const dados = docSnap.data();
    return {
        id: docSnap.id,
        ...dados,
        criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
        atualizadoEm: dados.atualizadoEm ? dados.atualizadoEm.toDate() : null,
    };
}

async function criarCerveja({ nome, tipo, abv, ibu, descricao, imagemUrl, preco, disponivel }) {
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
        atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection(COLECAO).add(novaCerveja);
    return { id: docRef.id, ...novaCerveja };
}

async function atualizarCerveja(id, corpo) {
    const docRef = db.collection(COLECAO).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;

    const camposPermitidos = ["nome", "tipo", "abv", "ibu", "descricao", "imagemUrl", "preco", "disponivel"];
    const updates = {};

    camposPermitidos.forEach((campo) => {
        if (corpo[campo] !== undefined) {
            if (["abv", "ibu", "preco"].includes(campo)) {
                updates[campo] = Number(corpo[campo]);
            } else if (campo === "disponivel") {
                updates[campo] = Boolean(corpo[campo]);
            } else {
                updates[campo] = corpo[campo];
            }
        }
    });

    updates.atualizadoEm = admin.firestore.FieldValue.serverTimestamp();
    await docRef.update(updates);
    return updates;
}

async function excluirCerveja(id) {
    const docRef = db.collection(COLECAO).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return false;

    await docRef.delete();
    return true;
}

module.exports = {
    listarCervejas,
    buscarCervejaPorId,
    criarCerveja,
    atualizarCerveja,
    excluirCerveja,
};