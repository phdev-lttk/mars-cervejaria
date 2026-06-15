import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import './Relatorio.css';

export default function Relatorio() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const snapPedidos = await getDocs(collection(db, 'pedidos'));
        const snapUsuarios = await getDocs(collection(db, 'usuarios'));
        const snapCervejas = await getDocs(collection(db, 'cervejas')); // Busca as cervejas também

        const pedidos = snapPedidos.docs.map(d => ({ id: d.id, ...d.data() }));
        const usuarios = snapUsuarios.docs.map(d => ({ id: d.id, ...d.data() }));
        const cervejas = snapCervejas.docs.map(d => ({ id: d.id, ...d.data() }));

        /* 
          =======================================================================
          SIMULAÇÃO DE JOIN (Relacionamento: Pedidos + Usuários + Cervejas)
          =======================================================================
          Utilizamos o map para adicionar infos sobre os pedidos e o find para buscar
          os registros correspondentes em outras tabelas.
        */
        const resultadoJoin = pedidos.map(pedido => {
          // Busca o cliente dono do pedido
          const cliente = usuarios.find(u => u.id === pedido.usuarioId);
          // Busca a cerveja atrelada ao pedido (caso tenha vindo da tela Adquira)
          const cerveja = cervejas.find(c => c.id === pedido.cervejaId);
          
          // O total pode vir preenchido do CRUD Admin ou calculado pela cerveja escolhida no Adquira
          const totalCalculado = pedido.total || cerveja?.preco || '0';

          return {
            ...pedido,
            clienteNome: cliente?.nome || pedido.usuarioNome || 'Cliente Não Encontrado',
            emailCliente: cliente?.email || 'N/A',
            telefoneCliente: cliente?.telefone || 'N/A',
            cervejaNome: cerveja?.nome || null,
            cervejaPreco: cerveja?.preco || null,
            totalCalculado: totalCalculado
          };
        });

        setDados(resultadoJoin);
      } catch (error) {
        console.error("Erro ao carregar os dados para o relatório:", error);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const getStatusClass = (status) => {
    if (!status) return 'status-pendente'; // Assume pendente se não houver status (pedidos da tela Adquira)
    const s = status.toLowerCase();
    if (s.includes('pendente')) return 'status-pendente';
    if (s.includes('entregue') || s.includes('conclu')) return 'status-entregue';
    if (s.includes('cancelado')) return 'status-cancelado';
    return 'status-default';
  };

  const formatCurrency = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue);
  };

  const toggleExpandir = (id) => {
    if (expandido === id) {
      setExpandido(null);
    } else {
      setExpandido(id);
    }
  };

  return (
    <div className="relatorio-container">
      <div className="relatorio-header">
        <Link to="/dashboard" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Voltar ao Dashboard
        </Link>
      </div>
      
      <h2 style={{ marginBottom: '30px', background: 'linear-gradient(90deg, #fff, #ffe6d5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Relatório de Pedidos Consolidados
      </h2>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando dados e processando JOIN...</p>
        </div>
      ) : dados.length === 0 ? (
        <div className="empty-state">
          Nenhum pedido encontrado.
        </div>
      ) : (
        <div className="relatorio-table-wrapper">
          <table className="relatorio-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Total do Pedido</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados.map(d => (
                <React.Fragment key={d.id}>
                  <tr>
                    <td style={{ fontWeight: '500' }}>{d.clienteNome}</td>
                    <td>{d.emailCliente}</td>
                    <td>{d.telefoneCliente}</td>
                    <td style={{ color: '#ffcc80', fontWeight: 'bold' }}>{formatCurrency(d.totalCalculado)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(d.status)}`}>
                        {d.status || 'Pendente'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-detalhes" onClick={() => toggleExpandir(d.id)}>
                        {expandido === d.id ? 'Ocultar' : 'Ver Pedido'}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Linha expansível com os detalhes do pedido */}
                  {expandido === d.id && (
                    <tr className="detalhes-row">
                      <td colSpan="6" style={{ padding: '0 20px', borderBottom: 'none' }}>
                        <div className="detalhes-content">
                          <h4 style={{ color: '#ffcc80', marginBottom: '10px' }}>Detalhes do Pedido (ID: {d.id})</h4>
                          
                          {/* Exibe a cerveja vinculada ao pedido via tela Adquira */}
                          {d.cervejaNome ? (
                            <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                              <li>
                                1x <strong>{d.cervejaNome}</strong> — {formatCurrency(d.cervejaPreco)}
                              </li>
                            </ul>
                          ) : d.itens && d.itens.length > 0 ? (
                            <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
                              {d.itens.map((item, idx) => (
                                <li key={idx}>
                                  {item.quantidade}x {item.nome} - {formatCurrency(item.preco)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                              Nenhum item específico foi registrado no banco de dados para este pedido. Apenas o valor total (<strong>{formatCurrency(d.totalCalculado)}</strong>) foi salvo via painel administrativo.
                            </p>
                          )}
                          
                          <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                            <strong>Data de Criação:</strong> {
                              d.data ? new Date(d.data).toLocaleString('pt-BR') : 
                              d.criadoEm?.seconds ? new Date(d.criadoEm.seconds * 1000).toLocaleString('pt-BR') : 
                              'Data não registrada'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}