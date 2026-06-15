import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './components/About/About';
import Contacts from './components/Contacts/Contacts';
import TestConnection from './components/Database/testConnection';
import Home from './components/Home/Home';
import Login from './components/Login/Login';

function App() {
  return (
    <>
      <TestConnection />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contatos" element={<Contacts />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
