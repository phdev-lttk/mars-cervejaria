import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TabelaGenerica from './TabelaGenerica';
import { getUsuarios, updateUsuarioPorId, deleteUsuario } from '../../services/usuariosService';
import { mascararTelefone, mascararCep } from '../../utils/mascaras';

const ENDERECO_INICIAL = {
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
};

const FORM_INICIAL = {
  nome: '',
  email: '',
  telefone: '',
  endereco: ENDERECO_INICIAL,
};

export default function UsuarioCRUD() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState(null);

  async function carregar() {
    try {
      const dados = await getUsuarios();
      setUsuarios(dados);
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => { carregar(); }, []);

  function handleEnderecoChange(campo, valor) {
    setForm((prev) => ({ ...prev, endereco: { ...prev.endereco, [campo]: valor } }));
  }

  async function salvar() {
    if (!editandoId) {
      alert('Novos usuários são criados pelo próprio cliente ao se cadastrar (Login/Cadastro). Aqui você pode apenas editar ou excluir.');
      return;
    }
    if (!form.nome || !form.email || !form.telefone) {
      alert('Preencha nome, email e telefone.');
      return;
    }
    try {
      await updateUsuarioPorId(editandoId, form);
      setEditandoId(null);
      setForm(FORM_INICIAL);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  }

  async function excluir(id) {
    try {
      await deleteUsuario(id);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  }

  function editar(u) {
    setForm({
      nome: u.nome || '',
      email: u.email || '',
      telefone: u.telefone || '',
      endereco: { ...ENDERECO_INICIAL, ...(u.endereco || {}) },
    });
    setEditandoId(u.id);
  }

  function cancelar() {
    setEditandoId(null);
    setForm(FORM_INICIAL);
  }

  function formatarEndereco(u) {
    const e = u.endereco;
    if (!e) return '-';
    const partes = [
      e.rua && e.numero ? `${e.rua}, ${e.numero}` : (e.rua || ''),
      e.complemento,
      e.bairro,
      e.cidade && e.estado ? `${e.cidade} - ${e.estado}` : (e.cidade || e.estado || ''),
      e.cep,
    ].filter(Boolean);
    return partes.length > 0 ? partes.join(', ') : '-';
  }

  const colunasTabela = [
    { label: 'Nome', key: 'nome' },
    { label: 'Email', key: 'email' },
    { label: 'Telefone', key: 'telefone' },
    { label: 'Endereço', render: formatarEndereco },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar</Link>
      <h2>CRUD — Usuários</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {editandoId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px', marginBottom: '1rem' }}>
          <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Telefone (ex: (11) 91234-5678)" maxLength={15} value={form.telefone} onChange={e => setForm({ ...form, telefone: mascararTelefone(e.target.value) })} />

          <p style={{ marginTop: '0.5rem', marginBottom: 0 }}><strong>Endereço</strong></p>
          <input placeholder="Rua" value={form.endereco.rua} onChange={e => handleEnderecoChange('rua', e.target.value)} />
          <input placeholder="Número" value={form.endereco.numero} onChange={e => handleEnderecoChange('numero', e.target.value)} />
          <input placeholder="Complemento" value={form.endereco.complemento} onChange={e => handleEnderecoChange('complemento', e.target.value)} />
          <input placeholder="Bairro" value={form.endereco.bairro} onChange={e => handleEnderecoChange('bairro', e.target.value)} />
          <input placeholder="Cidade" value={form.endereco.cidade} onChange={e => handleEnderecoChange('cidade', e.target.value)} />
          <input placeholder="Estado (UF)" maxLength={2} value={form.endereco.estado} onChange={e => handleEnderecoChange('estado', e.target.value.toUpperCase())} />
          <input placeholder="CEP" maxLength={9} value={form.endereco.cep} onChange={e => handleEnderecoChange('cep', mascararCep(e.target.value))} />

          <button onClick={salvar}>Atualizar</button>
          <button onClick={cancelar}>Cancelar</button>
        </div>
      )}

      <TabelaGenerica
        colunas={colunasTabela}
        dados={usuarios}
        onEditar={editar}
        onExcluir={excluir}
      />
    </div>
  );
}
