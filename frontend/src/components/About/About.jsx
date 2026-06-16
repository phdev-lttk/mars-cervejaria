import Header from '../Header/Header';
import './About.css';
import BeerScroll from './BeerScroll';
import Footer from '../Footer/Footer';

function About() {
  return (
    <div className="about">
      <Header />
      {/* <img className="particulas" src="/images/home/particulas.png" alt="partículas" /> */}

      {/* <header className="cabecalho">
                <img className="cabecalho-img" src="/images/icons/logobranca.svg" alt="logo mars" />

                <nav className="cabecalho-txt">
                    <Link className="cabecalho-txt-it" to="/">INÍCIO |</Link>
                    <Link className="cabecalho-txt-it" to="/sobre">SOBRE A MARS |</Link>
                    <Link className="cabecalho-txt-it" to="/contatos">CONTATOS |</Link>
                    <Link className="cabecalho-txt-it" to="/adquira-a-sua">ADQUIRA A SUA |</Link>
                </nav>
            </header>

            <hr /> */}

      <section className="hero-services">
        <p className="hero-eyebrow">Sobre Nós:</p>
        <h1 className="hero-headline">
          Da seleção do malte
          <br />
          ao
          <img
            className="hero-icon"
            src="/images/about/prancheta_forest.png"
            alt=""
            aria-hidden="true"
          />{' '}
          último gole.
        </h1>
      </section>

      <section className="sobre-historia">
        <p>
          Acreditamos que uma cerveja artesanal de verdade não deve apenas fazer parte do momento,
          ela deve marcar a memória. Com a seleção rigorosa de maltes nobres, lúpulos selecionados e
          um processo de fermentação artesanal meticuloso, criamos receitas únicas para quem busca
          mais do que um gole. Porque em um mundo cheio de sabores comuns, a Mars foi feita para se
          destacar e ser inesquecível.
        </p>
      </section>

      <hr />

      <BeerScroll />

      <hr />

      <Footer />

    </div>
  );
}

export default About;