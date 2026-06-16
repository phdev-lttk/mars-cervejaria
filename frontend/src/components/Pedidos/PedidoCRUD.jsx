import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlitchText } from '../../UI/Animations';
import { getTodosPedidos, updateStatusPedido, deletePedido, STATUS_PEDIDO } from '../../services/pedidosService';
import '../../admin.css';

export default function PedidoCRUD() {
  const [pedidos, setPedidos] = useState([]);
  const [erro, setErro] = useState(null);
  const [expandidoId, setExpandidoId] = useState(null);

  async function carregar() {
    try {
      const dados = await getTodosPedidos();
      setPedidos(dados);
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function alterarStatus(id, novoStatus) {
    try {
      await updateStatusPedido(id, novoStatus);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  }

  async function excluir(id) {
    if (!window.confirm('Excluir este pedido?')) return;
    try {
      await deletePedido(id);
      carregar();
    } catch (e) {
      alert(e.message);
    }
  }

  function alternarExpandido(id) {
    setExpandidoId(prev => (prev === id ? null : id));
  }

  function formatarData(data) {
    if (!data) return '-';
    const d = new Date(data);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString('pt-BR');
  }

  const getStatusClass = (status) => {
    if (!status) return 'status-pendente';
    const s = status.toLowerCase();
    if (s.includes('pendente')) return 'status-pendente';
    if (s.includes('entregue') || s.includes('conclu')) return 'status-entregue';
    if (s.includes('cancelado')) return 'status-cancelado';
    if (s.includes('confirmado')) return 'status-confirmado';
    if (s.includes('preparo')) return 'status-em_preparo';
    if (s.includes('enviado')) return 'status-enviado';
    return 'status-default';
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
      <p className="admin-page-subtitle">Acompanhe e atualize o status dos pedidos</p>

      {erro && <p style={{ color: '#ff4d4d', marginBottom: '1rem' }}>{erro}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Status</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="staggered-list">
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-empty">Nenhum pedido encontrado.</td>
              </tr>
            ) : (
              pedidos.map(p => (
                <Fragment key={p.id}>
                  <tr>
                    <td><strong style={{ color: '#fff' }}>{p.usuarioNome}</strong></td>
                    <td>
                      <button
                        className="btn-detalhes"
                        onClick={() => alternarExpandido(p.id)}
                      >
                        {Array.isArray(p.itens) ? p.itens.length : 0} item(ns) {expandidoId === p.id ? '▲' : '▼'}
                      </button>
                    </td>
                    <td style={{ color: '#ffa800', fontWeight: '600' }}>
                      R$ {Number(p.total).toFixed(2).replace('.', ',')}
                    </td>
                    <td>
                      <select
                        value={p.status}
                        onChange={e => alterarStatus(p.id, e.target.value)}
                        className={`status-badge ${getStatusClass(p.status)}`}
                        style={{ cursor: 'pointer', border: 'none', fontWeight: '600', fontSize: '0.75rem' }}
                      >
                        {Object.values(STATUS_PEDIDO).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                      {formatarData(p.criadoEm)}
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => excluir(p.id)}>Excluir</button>
                    </td>
                  </tr>

                  {expandidoId === p.id && (
                    <tr className="detalhes-row">
                      <td colSpan="6" style={{ padding: '0 16px', borderBottom: 'none' }}>
                        <div className="detalhes-content">
                          <h4 style={{ color: '#ffa800', marginBottom: '10px', fontSize: '0.88rem' }}>
                            Itens do Pedido — ID: <code style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>{p.id}</code>
                          </h4>
                          <table className="admin-table" style={{ marginBottom: '10px' }}>
                            <thead>
                              <tr>
                                <th>Cerveja</th>
                                <th>Qtd</th>
                                <th>Preço unit.</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(p.itens || []).map((item, idx) => (
                                <tr key={`${p.id}-item-${idx}`}>
                                  <td><strong style={{ color: '#fff' }}>{item.nome}</strong></td>
                                  <td>{item.quantidade}</td>
                                  <td>R$ {Number(item.precoUnitario).toFixed(2).replace('.', ',')}</td>
                                  <td style={{ color: '#ffa800', fontWeight: '600' }}>
                                    R$ {(Number(item.quantidade) * Number(item.precoUnitario)).toFixed(2).replace('.', ',')}
                                  </td>
                                </tr>
                              ))}
                              {(!p.itens || p.itens.length === 0) && (
                                <tr>
                                  <td colSpan="4" className="admin-empty">Nenhum item registrado.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                            <strong>Criado em:</strong> {formatarData(p.criadoEm)}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}