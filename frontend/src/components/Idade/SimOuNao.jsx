import { Link } from 'react-router-dom';

export default function SimOuNao() {
  return (
    <div className="home" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <img className="particulas" src="/images/home/particulas.png" alt="particulas" />
      
      <div style={{ zIndex: 2, textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '3rem', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
        <div>
          <img src="/images/icons/logobranca.svg" alt="logo mars" style={{ height: '80px', marginBottom: '2rem' }} />
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '1.5rem' }}>
          A MARS SE PREOCUPA <br />
          COM O CONSUMO <br />
          CONSCIENTE <br />
        </div>
        
        <h6 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '2rem', color: '#ffb142' }}>VOCÊ TEM MAIS DE 18 ANOS?</h6>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/inicio">
            <button style={{ padding: '10px 40px', fontSize: '20px' }}>SIM</button>
          </Link>
          <Link to="/nao">
            <button style={{ padding: '10px 40px', fontSize: '20px', backgroundColor: 'transparent', color: 'white', border: '2px solid white' }}>NÃO</button>
          </Link>
        </div>
      </div>
      
      <footer className="text-fot" style={{ position: 'absolute', bottom: '20px', zIndex: 2 }}>
        Criado e desenvolvido por Mars Design Gráfico @
      </footer>
    </div>
  );
}
