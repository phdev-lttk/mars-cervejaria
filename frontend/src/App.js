import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './components/About/About';
import Contacts from './components/Contacts/Contacts';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
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
          <Route path="/" element={<SimOuNao />} />
          <Route path="/nao" element={<Nao />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/adquira" element={<ProtectedRoute><Adquira /></ProtectedRoute>} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contatos" element={<Layout><Contacts /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/cervejas" element={<ProtectedRoute><Layout><CervejaCRUD /></Layout></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><Layout><UsuarioCRUD /></Layout></ProtectedRoute>} />
          <Route path="/pedidos" element={<ProtectedRoute><Layout><PedidoCRUD /></Layout></ProtectedRoute>} />
          <Route path="/relatorio" element={<ProtectedRoute><Layout><Relatorio /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;