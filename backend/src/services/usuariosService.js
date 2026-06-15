const { db, admin } = require("../firebase");

const COLECAO = "usuarios";

async function listarUsuarios() {
    const snapshot = await db.collection(COLECAO).orderBy("criadoEm", "desc").get();

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

async function buscarUsuarioPorUid(uid) {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;
    return { id: docSnap.id, ...docSnap.data() };
}

async function criarUsuario({ uid, email, nome, telefone, endereco }) {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) return null; // já existe

    const novoUsuario = {
        nome: nome || "",
        email,
        telefone: telefone || "",
        endereco: endereco || {
            rua: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
        },
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
        atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(novoUsuario);
    return { uid, ...novoUsuario };
}

async function atualizarUsuario(uid, corpo) {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;

    const updates = {};
    const camposPermitidos = ["nome", "telefone", "endereco"];

    camposPermitidos.forEach((campo) => {
        if (corpo[campo] !== undefined) {
            if (campo === "endereco" && typeof corpo[campo] === "object") {
                const subcampos = ["rua", "numero", "complemento", "bairro", "cidade", "estado", "cep"];
                const endObj = {};
                subcampos.forEach((sub) => {
                    endObj[sub] = corpo[campo][sub] !== undefined ? String(corpo[campo][sub]) : "";
                });
                updates[campo] = endObj;
            } else {
                updates[campo] = String(corpo[campo]);
            }
        }
    });

    updates.atualizadoEm = admin.firestore.FieldValue.serverTimestamp();
    await docRef.update(updates);
    return updates;
}

async function excluirUsuario(id) {
    const docRef = db.collection(COLECAO).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return false;

    await docRef.delete();
    return true;
}

module.exports = {
    listarUsuarios,
    buscarUsuarioPorUid,
    criarUsuario,
    atualizarUsuario,
    excluirUsuario,
};