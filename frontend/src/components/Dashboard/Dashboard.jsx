import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate('/login');
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard — Mars Cervejaria</h1>
      <p>Logado como: <strong>{user?.email}</strong></p>
      <h2>Painel Administrativo</h2>
      <p style={{ marginBottom: "20px" }}>Gerencie cervejas, usuários e pedidos.</p>

      <nav className="dashboard-nav">
        <Link to="/cervejas">
          <button>Gerenciar Cervejas</button>
        </Link>
        <Link to="/usuarios">Usuários</Link>
        <Link to="/pedidos">Pedidos</Link>
        <Link to="/relatorio">Relatório</Link>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}