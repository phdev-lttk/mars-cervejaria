import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './components/About/About';
import Contacts from './components/Contacts/Contacts';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/AdminLayout/AdminLayout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import CervejaCRUD from './components/Cervejas/CervejaCRUD';
import UsuarioCRUD from './components/Usuarios/UsuarioCRUD';
import PedidoCRUD from './components/Pedidos/PedidoCRUD';
import Relatorio from './components/Relatorio/Relatorio';
import SimOuNao from './components/Idade/SimOuNao';
import Nao from './components/Idade/Nao';
import Adquira from './components/Adquira/Adquira';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Rotas públicas ── */}
          <Route path="/" element={<SimOuNao />} />
          <Route path="/nao" element={<Nao />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contatos" element={<Contacts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adquira" element={<ProtectedRoute><Adquira /></ProtectedRoute>} />

          {/* ── Rotas admin — todas usam AdminLayout com sidebar ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><Dashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/cervejas" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><CervejaCRUD /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/usuarios" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><UsuarioCRUD /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/pedidos" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><PedidoCRUD /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/relatorio" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><Relatorio /></AdminLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;