import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { GlitchText } from '../UI/Animations';
import '../admin.css';

export default function CervejaCRUD() {
  const [cervejas, setCervejas] = useState([]);
  const [form, setForm] = useState({ nome: '', tipo: '', abv: '', preco: '' });
  const [editandoId, setEditandoId] = useState(null);

  const colecao = collection(db, 'cervejas');

  async function carregar() {
    const snap = await getDocs(colecao);
    setCervejas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  // eslint-disable-next-line
  useEffect(() => { carregar(); }, []);

  async function salvar() {
    if (!form.nome || !form.tipo || !form.abv || !form.preco) {
      alert('Preencha todos os campos');
      return;
    }
    if (editandoId) {
      await updateDoc(doc(db, 'cervejas', editandoId), form);
      setEditandoId(null);
    } else {
      await addDoc(colecao, { ...form, disponivel: true });
    }
    setForm({ nome: '', tipo: '', abv: '', preco: '' });
    carregar();
  }

  async function excluir(id) {
    await deleteDoc(doc(db, 'cervejas', id));
    carregar();
  }

  function editar(cerveja) {
    setForm({ nome: cerveja.nome, tipo: cerveja.tipo, abv: cerveja.abv, preco: cerveja.preco });
    setEditandoId(cerveja.id);
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

      <h2 className="admin-page-title">Gerenciar <GlitchText>Cervejas</GlitchText></h2>
      <p className="admin-page-subtitle">Cadastre, edite ou remova produtos do catálogo</p>

      {/* ── FORMULÁRIO ── */}
      <div className="admin-form">
        <p className="admin-form-title">
          {editandoId ? '✏️ Editando cerveja' : '+ Nova Cerveja'}
        </p>
        <input
          placeholder="Nome da cerveja"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />
        <input
          placeholder="Tipo (ex: IPA, Lager, Red Ale)"
          value={form.tipo}
          onChange={e => setForm({ ...form, tipo: e.target.value })}
        />
        <input
          placeholder="ABV (%)"
          type="number"
          value={form.abv}
          onChange={e => setForm({ ...form, abv: e.target.value })}
        />
        <input
          placeholder="Preço (R$)"
          type="number"
          value={form.preco}
          onChange={e => setForm({ ...form, preco: e.target.value })}
        />
        <div className="admin-form-btns">
          <button className="btn-primary" onClick={salvar}>
            {editandoId ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editandoId && (
            <button
              className="btn-secondary"
              onClick={() => { setEditandoId(null); setForm({ nome: '', tipo: '', abv: '', preco: '' }); }}
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
              <th>Tipo</th>
              <th>ABV</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="staggered-list">
            {cervejas.length === 0 ? (
              <tr><td colSpan="5" className="admin-empty">Nenhuma cerveja cadastrada ainda.</td></tr>
            ) : (
              cervejas.map(c => (
                <tr key={c.id}>
                  <td><strong style={{ color: '#fff' }}>{c.nome}</strong></td>
                  <td>{c.tipo}</td>
                  <td>{c.abv}%</td>
                  <td style={{ color: '#ffa800', fontWeight: '600' }}>R$ {c.preco}</td>
                  <td>
                    <button className="btn-edit" onClick={() => editar(c)}>Editar</button>
                    <button className="btn-delete" onClick={() => excluir(c.id)}>Excluir</button>
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