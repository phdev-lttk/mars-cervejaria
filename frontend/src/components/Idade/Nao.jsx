import { Link } from 'react-router-dom';
import './SimOuNao.css';

export default function Nao() {
  return (
    <div className="age-gate">

      <div className="age-gate__card">
        <div className="cartoon-inner">

          <img src="/images/icons/logobranca.svg" alt="Mars" className="age-gate__logo" />

          <p className="age-gate__eyebrow">Acesso restrito</p>
          <h1 className="age-gate__headline">Você não<br />pode<br />acessar.</h1>

          <div className="age-gate__actions">
            <Link to="/">
              <button className="btn-sim">Voltar</button>
            </Link>
          </div>

        </div>
      </div>

      <footer className="text-fot">Criado e desenvolvido por Mars Design Gráfico @</footer>
    </div>
  );
}
