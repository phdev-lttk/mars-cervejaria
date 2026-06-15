import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCervejas, addCerveja, updateCerveja, deleteCerveja } from '../../services/cervejasService';

const FORM_INICIAL = {
  nome: '',
  tipo: '',
  abv: '',
  ibu: '',
  descricao: '',
  imagemUrl: '',
  preco: '',
  disponivel: true,
};

export default function CervejaCRUD() {
  const [cervejas, setCervejas] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState(null);

  async function carregar() {
    try {
      const dados = await getCervejas();
      setCervejas(dados);
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function salvar() {
    if (!form.nome || !form.tipo || !form.preco) {
      alert('Preencha ao menos nome, tipo e preço.');
      return;
    }
    try {
      if (editandoId) {
        await updateCerveja(editandoId, form);
        setEditandoId(null);
      } else {
        await addCerveja(form);
      }
      setForm(FORM_INICIAL);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  }

  async function excluir(id) {
    try {
      await deleteCerveja(id);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  }

  function editar(cerveja) {
    setForm({
      nome: cerveja.nome || '',
      tipo: cerveja.tipo || '',
      abv: cerveja.abv ?? '',
      ibu: cerveja.ibu ?? '',
      descricao: cerveja.descricao || '',
      imagemUrl: cerveja.imagemUrl || '',
      preco: cerveja.preco ?? '',
      disponivel: cerveja.disponivel ?? true,
    });
    setEditandoId(cerveja.id);
  }

  function cancelar() {
    setEditandoId(null);
    setForm(FORM_INICIAL);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar</Link>
      <h2>CRUD — Cervejas</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '1rem' }}>
        <input placeholder="Nome" maxLength={100} value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
        <input placeholder="Tipo (ex: IPA, Lager)" maxLength={50} value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} />
        <input placeholder="ABV (%)" type="number" step="0.1" min="0" max="100" value={form.abv} onChange={e => setForm({ ...form, abv: e.target.value })} />
        <input placeholder="IBU" type="number" step="1" min="0" max="200" value={form.ibu} onChange={e => setForm({ ...form, ibu: e.target.value })} />
        <input placeholder="Preço (R$)" type="number" step="0.01" min="0" max="100000" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} />
        <textarea placeholder="Descrição" rows={3} maxLength={1000} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
        <input placeholder="URL da imagem" value={form.imagemUrl} onChange={e => setForm({ ...form, imagemUrl: e.target.value })} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={form.disponivel}
            onChange={e => setForm({ ...form, disponivel: e.target.checked })}
          />
          Disponível
        </label>
        <button onClick={salvar}>{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
        {editandoId && <button onClick={cancelar}>Cancelar</button>}
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nome</th><th>Tipo</th><th>ABV</th><th>IBU</th><th>Preço</th>
            <th>Descrição</th><th>Imagem</th><th>Disponível</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cervejas.map(c => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.tipo}</td>
              <td>{c.abv}%</td>
              <td>{c.ibu}</td>
              <td>R$ {c.preco}</td>
              <td>{c.descricao}</td>
              <td>{c.imagemUrl ? <a href={c.imagemUrl} target="_blank" rel="noreferrer">link</a> : '-'}</td>
              <td>{c.disponivel ? 'Sim' : 'Não'}</td>
              <td>
                <button onClick={() => editar(c)}>Editar</button>
                <button onClick={() => excluir(c.id)}>Excluir</button>
              </td>
            </tr>
          ))}
          {cervejas.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center' }}>Nenhuma cerveja cadastrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
