const { db, admin } = require("../firebase");

const cervejasIniciais = [
  {
    nome: "Mars IPA",
    tipo: "India Pale Ale",
    abv: 6.5,
    ibu: 55,
    descricao: "Uma IPA encorpada com notas cítricas e tropicais. Lúpulos selecionados de aroma intenso, finalização seca e refrescante. Para quem busca personalidade em cada gole.",
    imagemUrl: "/images/beers/mars_ipa.png",
    preco: 24.90,
    disponivel: true
  },
  {
    nome: "Mars Lager",
    tipo: "American Lager",
    abv: 4.8,
    ibu: 18,
    descricao: "Leve, límpida e extremamente refrescante. Uma lager artesanal com maltes premium e carbonatação equilibrada. Perfeita para o calor de Brasília.",
    imagemUrl: "/images/beers/mars_lager.png",
    preco: 19.90,
    disponivel: true
  },
  {
    nome: "Mars Stout",
    tipo: "Dry Stout",
    abv: 5.2,
    ibu: 35,
    descricao: "Escura, cremosa e com notas de café e chocolate amargo. Uma stout seca com corpo médio e finalização suave. Ideal para noites frias.",
    imagemUrl: "/images/beers/mars_stout.png",
    preco: 27.90,
    disponivel: true
  },
  {
    nome: "Mars Witbier",
    tipo: "Belgian Witbier",
    abv: 4.5,
    ibu: 14,
    descricao: "Cerveja de trigo com casca de laranja e semente de coentro. Turva, aromática e extremamente leve. O frescor da Bélgica com alma brasileira.",
    imagemUrl: "/images/beers/mars_witbier.png",
    preco: 22.90,
    disponivel: true
  },
  {
    nome: "Mars Red Ale",
    tipo: "Irish Red Ale",
    abv: 5.0,
    ibu: 25,
    descricao: "Avermelhada, maltada e com toques de caramelo e biscoito. Corpo médio e amargor suave. Uma cerveja elegante para qualquer ocasião.",
    imagemUrl: "/images/beers/mars_red_ale.png",
    preco: 23.90,
    disponivel: true
  },
  {
    nome: "Mars Pilsen Premium",
    tipo: "Czech Pilsner",
    abv: 5.0,
    ibu: 38,
    descricao: "Pilsen artesanal com lúpulo Saaz importado. Dourada, brilhante e com amargor nobre. Para quem quer uma pilsen de verdade.",
    imagemUrl: "/images/beers/mars_pilsen.png",
    preco: 21.90,
    disponivel: true
  }
];

async function seed() {
  console.log("[SEED] Iniciando população do banco de dados...");
  
  try {
    const colRef = db.collection("cervejas");
    const snapshot = await colRef.get();

    if (!snapshot.empty) {
      console.log(`[SEED] Abortado: Coleção 'cervejas' já possui ${snapshot.size} documentos para evitar duplicados.`);
      process.exit(0);
    }

    const batch = db.batch();

    cervejasIniciais.forEach((cerveja) => {
      const docRef = colRef.doc(); // Gera ID automático
      batch.set(docRef, {
        ...cerveja,
        criadoEm: admin.firestore.FieldValue.serverTimestamp(),
        atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`[SEED] Adicionando '${cerveja.nome}' ao lote.`);
    });

    await batch.commit();
    console.log("[SEED] Banco de dados populado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("[SEED ERROR] Erro ao popular banco de dados:", error);
    process.exit(1);
  }
}

// Executa o seed
seed();
