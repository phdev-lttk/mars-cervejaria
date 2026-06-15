import Header from '../Header/Header';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <img className="particulas" src="/images/home/particulas.png" alt="partículas" />

      {/* <header className="cabecalho">
        <img className="cabecalho-img" src="/images/icons/logobranca.svg" alt="logo mars" />

        <nav className="cabecalho-txt">
          <a className="cabecalho-txt-it" href="/">INÍCIO |</a>
          <a className="cabecalho-txt-it" href="/sobre">SOBRE A MARS |</a>
          <a className="cabecalho-txt-it" href="/contatos">CONTATOS |</a>
          <a className="cabecalho-txt-it" href="/adquira-a-sua">ADQUIRA A SUA |</a>
        </nav>
      </header>

      <hr /> */}

      <Header />

      <img className="sol" src="/images/home/sol.png" alt="sol" />

      <section className="inicio">
        <img className="inicio-img" src="/images/icons/logobranca.svg" alt="logo mars" />

        <p className="inicio-txt">
          A CADA
          <br />
          GOLE
          <br />
          UMA SENSAÇÃO
          <br />
          ÚNICA
        </p>

        <img className="cervejas" src="/images/home/MARS_BEER.png" alt="cervejas mars" />
      </section>

      <hr />

      <footer className="text-fot">Criado e desenvolvido por Pablo H. & Gustavo A.</footer>
    </div>
  );
}

export default Home;
