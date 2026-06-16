import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { GlitchText } from '../UI/Animations';
import '../admin.css';

export default function PedidoCRUD() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ usuarioId: '', usuarioNome: '', total: '', status: 'pendente' });
  const [editandoId, setEditandoId] = useState(null);

  async function carregar() {
    const snapU = await getDocs(collection(db, 'usuarios'));
    const listaUsuarios = snapU.docs.map(d => ({ id: d.id, ...d.data() }));
    setUsuarios(listaUsuarios);

    const snapP = await getDocs(collection(db, 'pedidos'));
    const listaPedidos = snapP.docs.map(d => {
      const data = d.data();
      // Tenta achar o nome do usuário pelo usuarioId se não tiver salvo diretamente (retrocompatibilidade)
      const userDoc = listaUsuarios.find(u => u.id === data.usuarioId);
      return {
        id: d.id,
        ...data,
        usuarioNome: data.usuarioNome || userDoc?.nome || 'Cliente Desconhecido',
        total: data.total || '0'
      };
    });
    setPedidos(listaPedidos);
  }

  useEffect(() => { carregar(); }, []);

  function selecionarUsuario(id) {
    const u = usuarios.find(u => u.id === id);
    setForm({ ...form, usuarioId: id, usuarioNome: u?.nome || '' });
  }

  async function salvar() {
    if (!form.usuarioId || !form.total) {
      alert('Selecione um usuário e informe o total');
      return;
    }
    if (editandoId) {
      await updateDoc(doc(db, 'pedidos', editandoId), form);
      setEditandoId(null);
    } else {
      await addDoc(collection(db, 'pedidos'), { ...form, criadoEm: new Date() });
    }
    setForm({ usuarioId: '', usuarioNome: '', total: '', status: 'pendente' });
    carregar();
  }

  async function excluir(id) {
    await deleteDoc(doc(db, 'pedidos', id));
    carregar();
  }

  function editar(p) {
    setForm({ usuarioId: p.usuarioId, usuarioNome: p.usuarioNome, total: p.total, status: p.status });
    setEditandoId(p.id);
  }

  const statusClass = (s) => {
    if (!s) return 'status-pendente';
    const key = s.toLowerCase().replace(' ', '_');
    return `status-${key}`;
  };

  return (
    <div className="admin-page">

      <Link to="/dashboard" className="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Voltar ao Dashboard
      </Link>

      <h2 className="admin-page-title">Gerenciar <GlitchText>Pedidos</GlitchText></h2>
      <p className="admin-page-subtitle">Registre e acompanhe o status dos pedidos</p>

      {/* ── FORMULÁRIO ── */}
      <div className="admin-form">
        <p className="admin-form-title">
          {editandoId ? '✏️ Editando pedido' : '+ Novo Pedido'}
        </p>
        <select value={form.usuarioId} onChange={e => selecionarUsuario(e.target.value)}>
          <option value="">Selecione um cliente</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
        <input
          placeholder="Total (R$)"
          type="number"
          value={form.total}
          onChange={e => setForm({ ...form, total: e.target.value })}
        />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="em_preparo">Em preparo</option>
          <option value="enviado">Enviado</option>
          <option value="entregue">Entregue</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <div className="admin-form-btns">
          <button className="btn-primary" onClick={salvar}>
            {editandoId ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editandoId && (
            <button
              className="btn-secondary"
              onClick={() => { setEditandoId(null); setForm({ usuarioId: '', usuarioNome: '', total: '', status: 'pendente' }); }}
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
              <th>Cliente</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="staggered-list">
            {pedidos.length === 0 ? (
              <tr><td colSpan="4" className="admin-empty">Nenhum pedido registrado ainda.</td></tr>
            ) : (
              pedidos.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong style={{ color: '#fff' }}>{p.usuarioNome}</strong>
                    {p.cervejaNome && <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', marginLeft: '6px' }}>({p.cervejaNome})</span>}
                  </td>
                  <td style={{ color: '#ffa800', fontWeight: '600' }}>R$ {p.total}</td>
                  <td>
                    <span className={`status-badge ${statusClass(p.status)}`}>
                      {p.status || 'pendente'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => editar(p)}>Editar</button>
                    <button className="btn-delete" onClick={() => excluir(p.id)}>Excluir</button>
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