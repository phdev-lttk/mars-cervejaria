import { Link } from 'react-router-dom';
import './SimOuNao.css';

export default function SimOuNao() {
  return (
    <div className="age-gate">

      <div className="age-gate__card">
        <div className="cartoon-inner">

          <img src="/images/icons/logobranca.svg" alt="Mars" className="age-gate__logo" />

          <p className="age-gate__eyebrow">A Mars se preocupa com o consumo consciente</p>
          <h1 className="age-gate__headline">Você tem<br />mais de<br />18 anos?</h1>

          <div className="age-gate__actions">
            <Link to="/inicio">
              <button className="btn-sim">Sim</button>
            </Link>
            <Link to="/nao">
              <button className="btn-nao">Não</button>
            </Link>
          </div>

        </div>
      </div>

      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico @</footer>
    </div>
  );
}