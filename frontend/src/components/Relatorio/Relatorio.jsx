import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

export default function Relatorio() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function carregar() {
      const snapPedidos = await getDocs(collection(db, 'pedidos'));
      const snapUsuarios = await getDocs(collection(db, 'usuarios'));

      const pedidos = snapPedidos.docs.map(d => ({ id: d.id, ...d.data() }));
      const usuarios = snapUsuarios.docs.map(d => ({ id: d.id, ...d.data() }));

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
    }
    carregar();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar</Link>
      <h2>Relatório — Pedidos por Cliente</h2>

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