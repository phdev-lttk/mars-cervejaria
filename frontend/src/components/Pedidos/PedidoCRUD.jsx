import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTodosPedidos, updateStatusPedido, deletePedido, STATUS_PEDIDO } from '../../services/pedidosService';

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

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar</Link>
      <h2>CRUD — Pedidos</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <table border="1" cellPadding="8">
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
        <tbody>
          {pedidos.map(p => (
            <Fragment key={p.id}>
              <tr>
                <td>{p.usuarioNome}</td>
                <td>
                  <button onClick={() => alternarExpandido(p.id)}>
                    {Array.isArray(p.itens) ? p.itens.length : 0} item(ns) {expandidoId === p.id ? '▲' : '▼'}
                  </button>
                </td>
                <td>R$ {Number(p.total).toFixed(2)}</td>
                <td>
                  <select value={p.status} onChange={e => alterarStatus(p.id, e.target.value)}>
                    {Object.values(STATUS_PEDIDO).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>{formatarData(p.criadoEm)}</td>
                <td>
                  <button onClick={() => excluir(p.id)}>Excluir</button>
                </td>
              </tr>
              {expandidoId === p.id && (
                <tr key={`${p.id}-detalhes`}>
                  <td colSpan={6}>
                    <table border="1" cellPadding="6" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Cerveja</th>
                          <th>Quantidade</th>
                          <th>Preço unitário</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(p.itens || []).map((item, idx) => (
                          <tr key={`${p.id}-item-${idx}`}>
                            <td>{item.nome}</td>
                            <td>{item.quantidade}</td>
                            <td>R$ {Number(item.precoUnitario).toFixed(2)}</td>
                            <td>R$ {(Number(item.quantidade) * Number(item.precoUnitario)).toFixed(2)}</td>
                          </tr>
                        ))}
                        {(!p.itens || p.itens.length === 0) && (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center' }}>Nenhum item.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
          {pedidos.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>Nenhum pedido encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
