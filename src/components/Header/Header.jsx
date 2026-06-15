import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="header">
      <header className="cabecalho">
        <img className="cabecalho-img" src="/images/icons/logobranca.svg" alt="logo mars" />

        <nav className="cabecalho-txt">
          <Link className="cabecalho-txt-it" to="/inicio">
            INÍCIO |
          </Link>
          <Link className="cabecalho-txt-it" to="/sobre">
            SOBRE A MARS |
          </Link>
          <Link className="cabecalho-txt-it" to="/contatos">
            CONTATOS |
          </Link>
          <Link className="cabecalho-txt-it" to="/adquira">
            ADQUIRA A SUA |
          </Link>
          <Link className="cabecalho-txt-it" to="/login" style={{ fontSize: '14px', marginLeft: '20px', color: '#ffb142' }}>
            ADMIN
          </Link>
        </nav>
      </header>

      <hr />
    </div>
  );
}

export default Header;
