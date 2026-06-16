import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GlitchText } from '../../UI/Animations';
import { getCervejas, addCerveja, updateCerveja, deleteCerveja } from '../../services/cervejasService';
import '../../admin.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [uploadando, setUploadando] = useState(false);
  const fileInputRef = useRef(null);

  // No CervejaCRUD.jsx, troque a função carregar():

  async function carregar() {
    try {
      const dados = await getCervejas();
      setCervejas(dados);
      // Persiste no localStorage como cache
      localStorage.setItem('cervejas_cache', JSON.stringify(dados));
    } catch (e) {
      // Se falhar, tenta carregar do cache
      const cache = localStorage.getItem('cervejas_cache');
      if (cache) {
        setCervejas(JSON.parse(cache));
        setErro('Usando dados em cache (offline).');
      } else {
        setErro(e.message);
      }
    }
  }

  useEffect(() => { carregar(); }, []);

  function handleImagemChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Valida tipo e tamanho (máx 5MB)
    const tiposAceitos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposAceitos.includes(file.type)) {
      alert('Formato inválido. Use JPG, PNG ou WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB.');
      return;
    }

    setImagemFile(file);
    setImagemPreview(URL.createObjectURL(file));
    // Limpa a URL manual se o usuário escolheu um arquivo
    setForm(prev => ({ ...prev, imagemUrl: '' }));
  }

  function limparImagem() {
    setImagemFile(null);
    setImagemPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function fazerUpload(file) {
    const formData = new FormData();
    formData.append('imagem', file);

    const res = await fetch(`${API}/api/upload`, {
      method: 'POST',
      body: formData,
      // Não setar Content-Type — o browser define com o boundary do multipart
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erro no upload da imagem');
    }

    const data = await res.json();
    return data.url; // Ex: "/uploads/cervejas/nome-do-arquivo.webp"
  }

  async function salvar() {
    if (!form.nome || !form.tipo || !form.preco) {
      alert('Preencha ao menos nome, tipo e preço.');
      return;
    }

    try {
      setUploadando(true);
      let imagemFinal = form.imagemUrl;

      // Se tem arquivo novo, faz upload primeiro
      if (imagemFile) {
        imagemFinal = await fazerUpload(imagemFile);
      }

      const payload = { ...form, imagemUrl: imagemFinal };

      if (editandoId) {
        await updateCerveja(editandoId, payload);
        setEditandoId(null);
      } else {
        await addCerveja(payload);
      }

      setForm(FORM_INICIAL);
      limparImagem();
      carregar();
    } catch (e) {
      alert(e.message);
    } finally {
      setUploadando(false);
    }
  }

  async function excluir(id) {
    if (!window.confirm('Excluir esta cerveja?')) return;
    try {
      await deleteCerveja(id);
      localStorage.removeItem('cervejas_cache'); // limpa cache ao modificar
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
    // Mostra preview da imagem atual ao editar
    setImagemFile(null);
    setImagemPreview(cerveja.imagemUrl ? `${API}${cerveja.imagemUrl}` : null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function cancelar() {
    setEditandoId(null);
    setForm(FORM_INICIAL);
    limparImagem();
    localStorage.removeItem('cervejas_cache'); // limpa cache ao modificar
    carregar();
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

      {erro && <p style={{ color: '#ff4d4d', marginBottom: '1rem' }}>{erro}</p>}

      {/* ── FORMULÁRIO ── */}
      <div className="admin-form">
        <p className="admin-form-title">
          {editandoId ? '✏️ Editando cerveja' : '+ Nova Cerveja'}
        </p>

        <input
          placeholder="Nome da cerveja *"
          maxLength={100}
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />
        <input
          placeholder="Tipo (ex: IPA, Lager, Red Ale) *"
          maxLength={50}
          value={form.tipo}
          onChange={e => setForm({ ...form, tipo: e.target.value })}
        />
        <input
          placeholder="Preço (R$) *"
          type="number"
          step="0.01"
          min="0"
          max="100000"
          value={form.preco}
          onChange={e => setForm({ ...form, preco: e.target.value })}
        />
        <input
          placeholder="ABV (%)"
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={form.abv}
          onChange={e => setForm({ ...form, abv: e.target.value })}
        />
        <input
          placeholder="IBU"
          type="number"
          step="1"
          min="0"
          max="200"
          value={form.ibu}
          onChange={e => setForm({ ...form, ibu: e.target.value })}
        />
        <textarea
          placeholder="Descrição"
          rows={3}
          maxLength={1000}
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
        />

        {/* ── CAMPO DE IMAGEM ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: 0 }}>
            Imagem — envie um arquivo <strong>ou</strong> cole uma URL
          </p>

          {/* Preview */}
          {imagemPreview && (
            <div style={{ position: 'relative', width: '120px' }}>
              <img
                src={imagemPreview}
                alt="Preview"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,184,0,0.3)',
                }}
              />
              <button
                type="button"
                onClick={limparImagem}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ff4d4d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  lineHeight: '22px',
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Input de arquivo */}
          {/* <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px dashed rgba(255,184,0,0.4)',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.88rem',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.borderColor = '#ffa800'}
            onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,184,0,0.4)'}
          >
            📁 {imagemFile ? imagemFile.name : 'Escolher arquivo (JPG, PNG, WebP — máx. 5MB)'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImagemChange}
              style={{ display: 'none' }}
            />
          </label> */}

          {/* Separador */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* URL manual */}
          <input
            placeholder="URL da imagem (https://...)"
            value={form.imagemUrl}
            disabled={!!imagemFile}
            onChange={e => {
              setForm({ ...form, imagemUrl: e.target.value });
              if (e.target.value) {
                setImagemPreview(e.target.value);
              } else {
                setImagemPreview(null);
              }
            }}
            style={{ opacity: imagemFile ? 0.4 : 1 }}
          />
        </div>

        {/* <label style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={form.disponivel}
            onChange={e => setForm({ ...form, disponivel: e.target.checked })}
          />
          Disponível no catálogo
        </label> */}

        <div className="admin-form-btns">
          <button className="btn-primary" onClick={salvar} disabled={uploadando}>
            {uploadando ? 'Enviando...' : editandoId ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editandoId && (
            <button className="btn-secondary" onClick={cancelar} disabled={uploadando}>
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
              <th>Imagem</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>ABV</th>
              <th>IBU</th>
              <th>Preço</th>
              <th>Descrição</th>
              <th>Disponível</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="staggered-list">
            {cervejas.length === 0 ? (
              <tr>
                <td colSpan="9" className="admin-empty">Nenhuma cerveja cadastrada ainda.</td>
              </tr>
            ) : (
              cervejas.map(c => (
                <tr key={c.id}>
                  <td>
                    {c.imagemUrl ? (
                      <img
                        src={c.imagemUrl.startsWith('http') ? c.imagemUrl : `${API}${c.imagemUrl}`}
                        alt={c.nome}
                        style={{
                          width: '48px',
                          height: '48px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid rgba(255,184,0,0.2)',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '48px', height: '48px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>🍺</div>
                    )}
                  </td>
                  <td><strong style={{ color: '#fff' }}>{c.nome}</strong></td>
                  <td>{c.tipo}</td>
                  <td>{c.abv}%</td>
                  <td>{c.ibu || '—'}</td>
                  <td style={{ color: '#ffa800', fontWeight: '600' }}>
                    R$ {parseFloat(c.preco).toFixed(2).replace('.', ',')}
                  </td>
                  <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.descricao || '—'}
                  </td>
                  <td>{c.disponivel ? '✅' : '❌'}</td>
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