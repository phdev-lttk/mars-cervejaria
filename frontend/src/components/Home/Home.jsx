import Header from '../Header/Header';
import './Home.css';
import Footer from '../Footer/Footer';

function Home() {
  return (
    <div className="home">

      <Header />
      <section className="home-hero">
        <div className="home-hero__left">
          <span className="home-eyebrow">Cerveja Artesanal</span>
          <h1 className="home-headline">
                        A CADA GOLE<br />
            UMA SENSAÇÃO<br />

            <span className="home-headline--accent">única.</span>
          </h1>
          <a className="home-btn" href="/sobre">Conheça a Mars</a>
        </div>

        <div className="home-hero__right">
          <img
            className="home-beer"
            src="/images/home/MARS_BEER.png"
            alt="cervejas mars"
          />
        </div>
      </section>

      <hr className="home-divider" />

      <Footer />
    </div>
  );
}

export default Home;