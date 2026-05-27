import "./Header.css";

function Header() {
  return (
    <header className="cabecalho">
      <img
        className="cabecalho-img"
        src="/images/icons/logo.svg"
        alt="logo mars"
      />

      <nav className="cabecalho-txt">
        <a className="cabecalho-txt-it" href="/">
          INÍCIO |
        </a>
        <a className="cabecalho-txt-it" href="/sobre">
          SOBRE A MARS |
        </a>
        <a className="cabecalho-txt-it" href="/contatos">
          CONTATOS |
        </a>
        <a className="cabecalho-txt-it" href="/adquira">
          ADQUIRA A SUA |
        </a>
      </nav>
    </header>
  );
}

export default Header;