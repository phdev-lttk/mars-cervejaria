import Header from '../Header/Header';
import './About.css';
import BeerScroll from './BeerScroll';

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

      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico @</footer>
    </div>
  );
}

export default About;

{
  /**
         * <!DOCTYPE html>
                <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" type="text/css" href="style.css">
                    <link rel="shortcut icon" href="logo.svg" type="image/x-icon">
                    <title>Contatos</title>
                </head>
                <body><img class="particulas" src="particulas.png" alt="particulas">
                    <header class="cabecalho">
                        <img class="cabecalho-img" src="logobranca.svg" alt="logo mars">
                        <nav class="cabecalho-txt">
                            <a class="cabecalho-txt-it" href="inicio.html">INÍCIO |</a>
                            <a class="cabecalho-txt-it" href="sobre.html">SOBRE A MARS |</a>
                            <a class="cabecalho-txt-it" href="contatos.html">CONTATOS |</a>
                            <a class="cabecalho-txt-it" href="adquiraasua.html">ADQUIRA A SUA |</a>
                        </nav>
                    </header>
                    <hr>
                    <br><br><br><br>
                    <iframe class="mapa" src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d61415.35107865831!2d-48.10150281774389!3d-15.832431940589649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e2!4m0!4m5!1s0x935a3321354999e9%3A0x881fa531a22a3f88!2sSt.%20B%20Norte%20Centro%20Universit%C3%A1rio%20Proje%C3%A7%C3%A3o%20-%20Taguatinga%20-%20Taguatinga%2C%20Bras%C3%ADlia%20-%20DF%2C%2070297-400!3m2!1d-15.8193551!2d-48.0652797!5e0!3m2!1spt-BR!2sbr!4v1667759768794!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                    <div class="icones">
                        <a href="https://www.instagram.com/_marsdesigner/"><img class="instagram" src="INSTA.svg" alt="instagram"></a>
                        <a href="https://whatsa.me/5561983731359"><img class="whatsapp" src="WHATSAPP.svg" alt="whatsapp"></a>
                    </div>
                    <section class="text-cont">
                    <a class="instawpp" href="https://www.instagram.com/seuinstagram/">INSTAGRAM<br><br></a>
                    <a class="instawpp" href="https://whatsa.me/5561seucelular">WHATSAPP</a>
                    </section><hr>
                    <footer class="text-fot">
                        Criado e desenvolvido por Mars Design Gráfico @
                    </footer>
                </body>
            </html>
         */
}
