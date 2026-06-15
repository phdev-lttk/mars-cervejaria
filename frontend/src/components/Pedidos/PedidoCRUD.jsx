import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

export default function PedidoCRUD() {
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ usuarioId: '', usuarioNome: '', total: '', status: 'pendente' });
  const [editandoId, setEditandoId] = useState(null);

  async function carregar() {
    const snapP = await getDocs(collection(db, 'pedidos'));
    setPedidos(snapP.docs.map(d => ({ id: d.id, ...d.data() })));
    const snapU = await getDocs(collection(db, 'usuarios'));
    setUsuarios(snapU.docs.map(d => ({ id: d.id, ...d.data() })));
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

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar</Link>
      <h2>CRUD — Pedidos</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '1rem' }}>
        <select value={form.usuarioId} onChange={e => selecionarUsuario(e.target.value)}>
          <option value="">Selecione um usuário</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
        <input placeholder="Total (R$)" type="number" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          <option value="pendente">Pendente</option>
          <option value="confirmado">Confirmado</option>
          <option value="em_preparo">Em preparo</option>
          <option value="enviado">Enviado</option>
          <option value="entregue">Entregue</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button onClick={salvar}>{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
        {editandoId && <button onClick={() => { setEditandoId(null); setForm({ usuarioId: '', usuarioNome: '', total: '', status: 'pendente' }); }}>Cancelar</button>}
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Cliente</th><th>Total</th><th>Status</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {pedidos.map(p => (
            <tr key={p.id}>
              <td>{p.usuarioNome}</td>
              <td>R$ {p.total}</td>
              <td>{p.status}</td>
              <td>
                <button onClick={() => editar(p)}>Editar</button>
                <button onClick={() => excluir(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}