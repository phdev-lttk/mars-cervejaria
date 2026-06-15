import Header from '../Header/Header';
import '../Home/Home.css';

export default function Adquira() {
    return (
        <div className="home" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <img className="particulas" src="/images/home/particulas.png" alt="particulas" />

            <Header />

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, zIndex: 2 }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem 4rem', borderRadius: '20px', backdropFilter: 'blur(10px)', textAlign: 'center', width: '400px' }}>
                    <img src="/images/icons/logobranca.svg" alt="logomars" style={{ height: '60px', marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '28px', color: '#ffb142', marginBottom: '2rem' }}>Adquira a sua</h2>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }} onSubmit={(e) => { e.preventDefault(); alert("Enviado com sucesso!"); }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome</label>
                            <input type="text" placeholder="Insira seu nome" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                            <input type="email" placeholder="Insira seu email" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cerveja</label>
                            <input type="text" placeholder="Escolha sua cerveja" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none' }} />
                        </div>

                        <button type="submit" style={{ marginTop: '1rem', padding: '12px', fontSize: '18px', background: '#ff6600', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Enviar</button>
                    </form>
                </div>

                <img src="/images/cerveja-ad.png" alt="cervejasmars" style={{ height: '500px', marginLeft: '4rem' }} />
            </div>

            <footer className="text-fot" style={{ marginTop: 'auto', zIndex: 2 }}>
                <hr style={{ marginBottom: '1rem' }} />
                Criado e desenvolvido por Mars Design Gráfico @
            </footer>
        </div>
    );
}