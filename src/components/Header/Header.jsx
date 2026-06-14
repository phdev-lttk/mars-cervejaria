import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="header">
      <header className="cabecalho">
        <img className="cabecalho-img" src="/images/icons/logobranca.svg" alt="logo mars" />

        <nav className="cabecalho-txt">
          <Link className="cabecalho-txt-it" to="/">
            INÍCIO |
          </Link>
          <Link className="cabecalho-txt-it" to="/sobre">
            SOBRE A MARS |
          </Link>
          <Link className="cabecalho-txt-it" to="/contatos">
            CONTATOS |
          </Link>
          <Link className="cabecalho-txt-it" to="/adquira-a-sua">
            ADQUIRA A SUA |
          </Link>
        </nav>
      </header>

      <hr />
    </div>
  );
}

export default Header;
