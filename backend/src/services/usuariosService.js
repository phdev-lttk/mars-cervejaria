const { db, admin } = require("../firebase");

const COLECAO = "usuarios";

function formatarUsuario(doc) {
    const dados = doc.data();
    return {
        id: doc.id,
        ...dados,
        criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
        atualizadoEm: dados.atualizadoEm ? dados.atualizadoEm.toDate() : null,
    };
}

function montarEndereco(enderecoBody) {
    const subcampos = ["rua", "numero", "complemento", "bairro", "cidade", "estado", "cep"];
    const endObj = {};
    subcampos.forEach((sub) => {
        endObj[sub] = enderecoBody[sub] !== undefined ? String(enderecoBody[sub]) : "";
    });
    return endObj;
}

async function listarUsuarios() {
    const snapshot = await db.collection(COLECAO).orderBy("criadoEm", "desc").get();
    return snapshot.docs.map(formatarUsuario);
}

async function buscarUsuarioPorUid(uid) {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;
    return formatarUsuario(docSnap);
}

async function criarUsuario({ uid, email, nome, telefone, dataNascimento, endereco }) {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) return null; // já existe

    const novoUsuario = {
        nome: nome || "",
        email,
        telefone: telefone || "",
        dataNascimento: dataNascimento || "",
        endereco: endereco ? montarEndereco(endereco) : {
            rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", cep: "",
        },
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
        atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(novoUsuario);
    return { uid, ...novoUsuario };
}

/**
 * Atualiza o perfil do próprio usuário (campos limitados: nome, telefone, endereco).
 */
async function atualizarPerfilProprio(uid, corpo) {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;

    const updates = {};
    const camposPermitidos = ["nome", "telefone", "dataNascimento", "endereco"];

    camposPermitidos.forEach((campo) => {
        if (corpo[campo] !== undefined) {
            if (campo === "endereco" && typeof corpo[campo] === "object") {
                updates[campo] = montarEndereco(corpo[campo]);
            } else {
                updates[campo] = String(corpo[campo]);
            }
        }
    });

    updates.atualizadoEm = admin.firestore.FieldValue.serverTimestamp();
    await docRef.update(updates);
    return updates;
}

/**
 * Atualiza dados de qualquer usuário (uso administrativo: nome, email, telefone, endereco).
 */
async function atualizarUsuarioPorAdmin(uid, corpo) {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;

    const updates = {};
    const camposPermitidos = ["nome", "email", "telefone", "endereco"];

    camposPermitidos.forEach((campo) => {
        if (corpo[campo] !== undefined) {
            if (campo === "endereco" && typeof corpo[campo] === "object") {
                updates[campo] = montarEndereco(corpo[campo]);
            } else {
                updates[campo] = corpo[campo];
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
    atualizarPerfilProprio,
    atualizarUsuarioPorAdmin,
    excluirUsuario,
};
