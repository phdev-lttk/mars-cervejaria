import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

export default function CervejaCRUD() {
  const [cervejas, setCervejas] = useState([]);
  const [form, setForm] = useState({ nome: '', tipo: '', abv: '', preco: '' });
  const [editandoId, setEditandoId] = useState(null);

  const colecao = collection(db, 'cervejas');

  async function carregar() {
    const snap = await getDocs(colecao);
    setCervejas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

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
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar</Link>
      <h2>CRUD — Cervejas</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '1rem' }}>
        <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        <input placeholder="Tipo (ex: IPA, Lager)" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} />
        <input placeholder="ABV (%)" type="number" value={form.abv} onChange={e => setForm({ ...form, abv: e.target.value })} />
        <input placeholder="Preço (R$)" type="number" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} />
        <button onClick={salvar}>{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
        {editandoId && <button onClick={() => { setEditandoId(null); setForm({ nome: '', tipo: '', abv: '', preco: '' }); }}>Cancelar</button>}
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Nome</th><th>Tipo</th><th>ABV</th><th>Preço</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {cervejas.map(c => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.tipo}</td>
              <td>{c.abv}%</td>
              <td>R$ {c.preco}</td>
              <td>
                <button onClick={() => editar(c)}>Editar</button>
                <button onClick={() => excluir(c.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}