import './App.css';
import TestConnection from './components/Database/testConnection';
import Home from './components/Home/Home';
import About from './components/About/About';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <TestConnection />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
