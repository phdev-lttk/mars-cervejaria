import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { GlitchText } from '../UI/Animations';
import '../admin.css';

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

  return (
    <div className="admin-page">

      <Link to="/dashboard" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Voltar ao Dashboard
      </Link>

      <h2 className="admin-page-title">Gerenciar <GlitchText>Usuários</GlitchText></h2>
      <p className="admin-page-subtitle">Cadastre e gerencie clientes da plataforma</p>

      {/* ── FORMULÁRIO ── */}
      <div className="admin-form">
        <p className="admin-form-title">
          {editandoId ? '✏️ Editando usuário' : '+ Novo Usuário'}
        </p>
        <input
          placeholder="Nome completo"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />
        <input
          placeholder="E-mail"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Telefone"
          value={form.telefone}
          onChange={e => setForm({ ...form, telefone: e.target.value })}
        />
        <div className="admin-form-btns">
          <button className="btn-primary" onClick={salvar}>
            {editandoId ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editandoId && (
            <button
              className="btn-secondary"
              onClick={() => { setEditandoId(null); setForm({ nome: '', email: '', telefone: '' }); }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* ── TABELA ── */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="staggered-list">
            {usuarios.length === 0 ? (
              <tr><td colSpan="4" className="admin-empty">Nenhum usuário cadastrado ainda.</td></tr>
            ) : (
              usuarios.map(u => (
                <tr key={u.id}>
                  <td><strong style={{ color: '#fff' }}>{u.nome}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.telefone}</td>
                  <td>
                    <button className="btn-edit" onClick={() => editar(u)}>Editar</button>
                    <button className="btn-delete" onClick={() => excluir(u.id)}>Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}