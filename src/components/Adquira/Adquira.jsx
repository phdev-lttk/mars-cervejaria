import { useState, useEffect, useContext } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Adquira() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cerveja, setCerveja] = useState('');
  const [cervejasList, setCervejasList] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function fetchCervejas() {
      const snap = await getDocs(collection(db, 'cervejas'));
      let list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // AUTO-SEEDING: Se o banco estiver vazio, cria as 3 cervejas verdadeiras
      if (list.length === 0) {
        console.log("Banco vazio! Criando cervejas padrão...");
        const cervejasPadrao = [
          { nome: 'Blue Dark', tipo: 'Dark Ale', abv: '6.2', preco: '32.90', disponivel: true },
          { nome: 'Sol da Tarde', tipo: 'Lager', abv: '4.8', preco: '24.50', disponivel: true },
          { nome: 'Forest', tipo: 'IPA', abv: '5.5', preco: '29.90', disponivel: true }
        ];
        
        for (const c of cervejasPadrao) {
          await addDoc(collection(db, 'cervejas'), c);
        }
        
        // Refetch after seeding
        const newSnap = await getDocs(collection(db, 'cervejas'));
        list = newSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      
      setCervejasList(list);

      // Pre-select beer from URL if available by exact name or ID
      const cervejaParamId = searchParams.get('cerveja');
      const cervejaParamNome = searchParams.get('nome');
      
      if (cervejaParamId) {
        setCerveja(cervejaParamId);
      } else if (cervejaParamNome) {
        const found = list.find(c => c.nome.toLowerCase() === cervejaParamNome.toLowerCase());
        if (found) {
          setCerveja(found.id);
        } else if (list.length > 0) {
          setCerveja(list[0].id);
        }
      } else if (list.length > 0) {
        setCerveja(list[0].id);
      }
    }
    fetchCervejas();
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nome || !email || !cerveja) return;

    try {
      const cervejaSelecionada = cervejasList.find(c => c.id === cerveja);
      
      await addDoc(collection(db, 'pedidos'), {
        cervejaId: cerveja,
        cervejaNome: cervejaSelecionada?.nome || '',
        usuarioId: user.uid,
        usuarioNome: nome, // Salva o nome preenchido no formulário!
        emailCliente: email,
        total: cervejaSelecionada?.preco || 0, // Salva o valor da cerveja para aparecer no PedidoCRUD
        status: 'pendente', // Status padrão
        data: new Date().toISOString(),
        criadoEm: new Date() // Para manter compatibilidade com o CRUD Admin
      });
      alert("Pedido enviado com sucesso!");
      navigate("/inicio");
    } catch (error) {
      console.error("Erro ao fazer pedido", error);
      alert("Erro ao enviar pedido.");
    }
  }

  function handleSelectFromCatalog(id) {
    setCerveja(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 122px)', padding: '2rem 0' }}>
      
      {/* Top Section: Form and Image */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5rem', flexWrap: 'wrap', padding: '0 2rem' }}>
        {/* Container do Formulário */}
        <div style={{ 
          background: 'rgba(0,0,0,0.4)', 
          padding: '3rem 4rem', 
          borderRadius: '20px', 
          backdropFilter: 'blur(10px)', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center', 
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <img src="/images/icons/logobranca.svg" alt="logomars" style={{ height: '70px', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '32px', color: '#ffb142', marginBottom: '2.5rem', fontFamily: 'Alata, sans-serif' }}>Adquira a sua</h2>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }} onSubmit={handleSubmit}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>Nome Completo</label>
              <input type="text" placeholder="Insira seu nome" value={nome} onChange={e => setNome(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>Email</label>
              <input type="email" placeholder="Insira seu email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>Cerveja Escolhida</label>
              <select value={cerveja} onChange={e => setCerveja(e.target.value)} required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(20,20,20,0.8)', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}>
                <option value="" disabled>Selecione uma cerveja...</option>
                {cervejasList.map(c => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.tipo}) - R$ {c.preco}</option>
                ))}
              </select>
            </div>
            
            <button type="submit" style={{ 
              marginTop: '1.5rem', 
              padding: '16px', 
              fontSize: '18px', 
              background: 'linear-gradient(135deg, #ffb700, #ff8c00)', 
              color: '#111', 
              fontWeight: 'bold',
              border: 'none', 
              borderRadius: '10px', 
              cursor: 'pointer',
              transition: 'transform 0.3s',
              boxShadow: '0 4px 15px rgba(255, 183, 0, 0.3)'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              CONFIRMAR PEDIDO
            </button>
          </form>
        </div>
        
        {/* Imagem das Cervejas */}
        <img src="/images/home/3_MARS_BEER.png" alt="cervejasmars" style={{ 
          maxWidth: '100%', 
          height: 'auto', 
          maxHeight: '600px', 
          filter: 'drop-shadow(20px 20px 20px rgba(0,0,0,0.5))',
          animation: 'fadeInUp 1s ease-out'
        }} />
      </div>

      {/* Catálogo Dinâmico Section */}
      <div style={{ marginTop: '5rem', padding: '0 4rem', width: '100%', maxWidth: '1200px', margin: '5rem auto 0' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', fontFamily: 'Alata, sans-serif' }}>Catálogo Mars</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {cervejasList.map(c => (
            <div key={c.id} style={{
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '15px',
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 177, 66, 0.2)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onClick={() => handleSelectFromCatalog(c.id)}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 177, 66, 0.3)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'; }}>
              
              <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: '#ffb142', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{c.tipo}</span>
                <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', fontFamily: 'Alata, sans-serif' }}>{c.nome}</h3>
                <p style={{ color: '#ddd', fontSize: '1.2rem', marginBottom: '1rem' }}>{c.abv}% ABV</p>
                <img 
                  src={
                    c.nome.toLowerCase() === 'blue dark' ? '/images/home/2_DARKBLUE.png' :
                    c.nome.toLowerCase() === 'forest' ? '/images/home/2_GREEN.png' :
                    '/images/home/MARS_BEER.png'
                  } 
                  alt={c.nome} 
                  style={{ height: '180px', objectFit: 'contain', marginTop: 'auto', marginBottom: '1rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }} 
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>R$ {c.preco}</span>
                <button style={{
                  background: 'transparent',
                  border: '2px solid #ffb142',
                  color: '#ffb142',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#ffb142'; e.currentTarget.style.color = '#111'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffb142'; }}>
                  Selecionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
