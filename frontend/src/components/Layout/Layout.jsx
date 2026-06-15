import Header from '../Header/Header';
import '../Home/Home.css'; // reaproveitar animações e background

export default function Layout({ children }) {
  return (
    <div className="home">
      <img className="particulas" src="/images/home/particulas.png" alt="partículas" />
      
      <Header />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>

      <footer className="text-fot" style={{ marginTop: 'auto' }}>
        <hr />
        Criado e desenvolvido por Pablo H. & Gustavo A.
      </footer>
    </div>
  );
}
