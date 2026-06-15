const { db, admin } = require("../firebase");

const COLECAO = "admins";

function formatarAdmin(doc) {
    const dados = doc.data();
    return {
        uid: doc.id,
        ...dados,
        criadoEm: dados.criadoEm ? dados.criadoEm.toDate() : null,
    };
}

async function verificarAdmin(uid) {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return { isAdmin: false };
    return { isAdmin: true, role: docSnap.data().role || "admin" };
}

async function listarAdmins() {
    const snapshot = await db.collection(COLECAO).get();
    return snapshot.docs.map(formatarAdmin);
}

async function adicionarAdmin({ uid, email, nome, role }) {
    const docRef = db.collection(COLECAO).doc(uid);
    const docSnap = await docRef.get();

    if (docSnap.exists) return null; // já é admin

    const novoAdmin = {
        email,
        nome: nome || "",
        role: role || "admin",
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(novoAdmin);
    return { uid, ...novoAdmin };
}

module.exports = {
    verificarAdmin,
    listarAdmins,
    adicionarAdmin,
};
