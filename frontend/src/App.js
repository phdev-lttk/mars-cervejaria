// App.js corrigido
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext'; // mova para cá se quiser
import About from './components/About/About';
import Contacts from './components/Contacts/Contacts';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      {/* TestConnection deve ficar DENTRO do BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contatos" element={<Contacts />} />
        <Route path="/login" element={<Login />} />
        {/* Adicione a rota /dashboard que o Login.jsx usa */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div>Dashboard Admin (crie o componente)</div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;