import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/inicio');
  };

  return (
    <div className="header">
      <header className="cabecalho">
        <Link to="/inicio">
          <img className="cabecalho-img" src="/images/icons/logobranca.svg" alt="logo mars" />
        </Link>

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
          {user ? (
            <span
              className="cabecalho-txt-it"
              style={{ color: '#ffb142', cursor: 'pointer' }}
              onClick={handleLogout}
            >
              SAIR
            </span>
          ) : (
            <Link className="cabecalho-txt-it" to="/login" style={{ color: '#ffb142' }}>
              ENTRAR
            </Link>
          )}
        </nav>
      </header>

      <hr />
    </div>
  );
}

export default Header;