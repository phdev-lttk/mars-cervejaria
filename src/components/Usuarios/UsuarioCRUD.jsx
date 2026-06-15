import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import TabelaGenerica from './TabelaGenerica';

export default function UsuarioCRUD() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [editandoId, setEditandoId] = useState(null);

  const colecao = collection(db, 'usuarios');

  async function carregar() {
    const snap = await getDocs(colecao);
    setUsuarios(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  // eslint-disable-next-line
  useEffect(() => { carregar(); }, []);

  async function salvar() {
    if (!form.nome || !form.email || !form.telefone) {
      alert('Preencha todos os campos');
      return;
    }
    if (editandoId) {
      await updateDoc(doc(db, 'usuarios', editandoId), form);
      setEditandoId(null);
    } else {
      await addDoc(colecao, form);
    }
    setForm({ nome: '', email: '', telefone: '' });
    carregar();
  }

  async function excluir(id) {
    await deleteDoc(doc(db, 'usuarios', id));
    carregar();
  }

  function editar(u) {
    setForm({ nome: u.nome, email: u.email, telefone: u.telefone });
    setEditandoId(u.id);
  }

  const colunasTabela = [
    { label: 'Nome', key: 'nome' },
    { label: 'Email', key: 'email' },
    { label: 'Telefone', key: 'telefone' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Voltar ao Dashboard
      </Link>
      <h2>CRUD — Usuários</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '1rem' }}>
        <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
        <button onClick={salvar}>{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
        {editandoId && <button onClick={() => { setEditandoId(null); setForm({ nome: '', email: '', telefone: '' }); }}>Cancelar</button>}
      </div>

      <TabelaGenerica 
        colunas={colunasTabela} 
        dados={usuarios} 
        onEditar={editar} 
        onExcluir={excluir} 
      />
    </div>
  );
}