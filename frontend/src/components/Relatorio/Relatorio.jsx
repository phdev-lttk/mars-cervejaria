import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTodosPedidos } from '../../services/pedidosService';
import { getUsuarios } from '../../services/usuariosService';

export default function Relatorio() {
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const pedidos = await getTodosPedidos();
        const usuarios = await getUsuarios();

        // JOIN: pedidos + usuarios pelo usuarioId
        const resultado = pedidos.map(pedido => {
          const usuario = usuarios.find(u => u.id === pedido.usuarioId);
          return {
            ...pedido,
            emailCliente: usuario?.email || 'N/A',
            telefoneCliente: usuario?.telefone || 'N/A',
          };
        });

        setDados(resultado);
      } catch (e) {
        setErro(e.message);
      }
    }
    carregar();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar</Link>
      <h2>Relatório — Pedidos por Cliente</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dados.map(d => (
            <tr key={d.id}>
              <td>{d.usuarioNome}</td>
              <td>{d.emailCliente}</td>
              <td>{d.telefoneCliente}</td>
              <td>R$ {d.total}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}