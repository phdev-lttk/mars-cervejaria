import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './components/About/About';
import Contacts from './components/Contacts/Contacts';
import TestConnection from './components/Database/testConnection';
import Home from './components/Home/Home';

function App() {
  return (
    <>
      <TestConnection />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contatos" element={<Contacts />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
