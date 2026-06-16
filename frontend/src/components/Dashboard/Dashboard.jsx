import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './Dashboard.css';

/* ══════════════════════════════════
   SVG ICONS
══════════════════════════════════ */
const IconBeer = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 11h1a3 3 0 0 1 0 6h-1" /><path d="M9 6l1-3h4l1 3" />
    <path d="M7 6h10l-1 12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L7 6z" />
    <path d="M7 10h10" />
  </svg>
);
const IconUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconOrders = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const IconReport = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" /><path d="M2 20h20" />
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ══════════════════════════════════
   FLIP COUNTER
══════════════════════════════════ */
function FlipCounter({ end, prefix = '', duration = 1400 }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!end && end !== 0) return;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.floor(ease * end));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration]);

  const formatted = end > 999 ? display.toLocaleString('pt-BR') : display;
  return <>{prefix}{formatted}</>;
}

/* ══════════════════════════════════
   GLITCH TEXT
══════════════════════════════════ */
function GlitchText({ children }) {
  return (
    <span className="glitch-wrap" data-text={children}>{children}</span>
  );
}

/* ══════════════════════════════════
   ACTION CARDS CONFIG
══════════════════════════════════ */
const actionCards = [
  { to: '/cervejas', icon: <IconBeer />, label: 'Cervejas', desc: 'Cadastre e edite produtos' },
  { to: '/usuarios', icon: <IconUsers />, label: 'Usuários', desc: 'Gerencie clientes' },
  { to: '/pedidos', icon: <IconOrders />, label: 'Pedidos', desc: 'Acompanhe os pedidos' },
  { to: '/relatorio', icon: <IconReport />, label: 'Relatório', desc: 'Veja o consolidado' },
];

/* ══════════════════════════════════
   DASHBOARD
══════════════════════════════════ */
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ cervejas: 0, pedidos: 0, usuarios: 0, receita: 0 });
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [snapC, snapP, snapU] = await Promise.all([
          getDocs(collection(db, 'cervejas')),
          getDocs(collection(db, 'pedidos')),
          getDocs(collection(db, 'usuarios')),
        ]);
        const receita = snapP.docs.reduce((acc, d) => acc + (parseFloat(d.data().total) || 0), 0);
        setStats({ cervejas: snapC.size, pedidos: snapP.size, usuarios: snapU.size, receita });
      } catch (e) { console.error(e); }
      finally {
        setLoading(false);
        setTimeout(() => setVisible(true), 80);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className={`dash-content ${visible ? 'dash-visible' : ''}`}>

      {/* ── HERO ── */}
      <header className="dash-hero">
        <div className="dash-hero-tag">
          <span className="dash-hero-tag-dot" />
          PAINEL ADMINISTRATIVO
        </div>
        <h1 className="dash-hero-title">
          BEM-VINDO,{' '}
          <GlitchText>ADMIN.</GlitchText>
        </h1>
        <p className="dash-hero-sub">{user?.email}</p>
      </header>

      {/* ── STATS ── */}
      <div className="dash-stats-row">
        <div className="stat-block">
          <div className="stat-block-num">
            {loading ? <span className="stat-loading">···</span> : <FlipCounter end={stats.cervejas} />}
          </div>
          <div className="stat-block-bar" />
          <div className="stat-block-label">Cervejas<br />cadastradas</div>
        </div>

        <div className="stat-block">
          <div className="stat-block-num">
            {loading ? <span className="stat-loading">···</span> : <FlipCounter end={stats.pedidos} />}
          </div>
          <div className="stat-block-bar" />
          <div className="stat-block-label">Pedidos<br />no sistema</div>
        </div>

        <div className="stat-block stat-block-gold">
          <div className="stat-block-num">
            {loading ? <span className="stat-loading">···</span> : <FlipCounter end={Math.round(stats.receita)} prefix="R$ " />}
          </div>
          <div className="stat-block-bar" />
          <div className="stat-block-label">Receita<br />acumulada</div>
        </div>

        <div className="stat-block">
          <div className="stat-block-num">
            {loading ? <span className="stat-loading">···</span> : <FlipCounter end={stats.usuarios} />}
          </div>
          <div className="stat-block-bar" />
          <div className="stat-block-label">Clientes<br />registrados</div>
        </div>
      </div>

      {/* ── DIVISOR ── */}
      <div className="dash-sep">
        <span>GERENCIAMENTO</span>
      </div>

      {/* ── ACTION CARDS ── */}
      <div className="dash-action-grid">
        {actionCards.map((card, i) => (
          <Link
            key={card.to}
            to={card.to}
            className="dash-action-card"
            style={{ '--delay': `${i * 80}ms` }}
          >
            <div className="dash-action-card-icon">{card.icon}</div>
            <div className="dash-action-card-body">
              <div className="dash-action-card-label">{card.label}</div>
              <div className="dash-action-card-desc">{card.desc}</div>
            </div>
            <span className="dash-action-card-arrow"><IconArrow /></span>
            <span className="card-border-top" />
            <span className="card-border-right" />
            <span className="card-border-bottom" />
            <span className="card-border-left" />
          </Link>
        ))}
      </div>

    </div>
  );
}