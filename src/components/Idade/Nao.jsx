import { Link } from 'react-router-dom';

export default function Nao() {
  return (
    <div className="home" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <img className="particulas" src="/images/home/particulas.png" alt="particulas" />
      
      <div style={{ zIndex: 2, textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '3rem', borderRadius: '20px', backdropFilter: 'blur(10px)', position: 'relative' }}>
        <div>
          <img src="/images/icons/logobranca.svg" alt="logo mars" style={{ height: '80px', marginBottom: '2rem' }} />
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '2rem' }}>
          INFELIZMENTE <br />
          VOCÊ NÃO PODE <br />
          ACESSAR A ESSE<br />
          SITE<br />
        </div>
        
        <Link to="/">
          <button style={{ padding: '10px 40px', fontSize: '20px' }}>VOLTAR</button>
        </Link>
        
        <img src="/images/icons/cara triste.svg" alt="caratriste" style={{ position: 'absolute', right: '-80px', bottom: '-40px', height: '150px' }} />
      </div>
      
      <footer className="text-fot" style={{ position: 'absolute', bottom: '20px', zIndex: 2 }}>
        Criado e desenvolvido por Mars Design Gráfico @
      </footer>
    </div>
  );
}
