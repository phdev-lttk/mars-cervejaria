import { useRef, useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";

// ─── Cursor ───────────────────────────────────────────────────────────────────
function Cursor({ position }) {
  return <motion.li animate={position} className="nav-cursor" />;
}

// ─── Tab ──────────────────────────────────────────────────────────────────────
function Tab({ children, setPosition, to, onClick, isButton, highlight }) {
  const ref = useRef(null);
  function handleMouseEnter() {
    if (!ref.current) return;
    const { width } = ref.current.getBoundingClientRect();
    setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
  }
  const liClass = ["nav-tab", highlight ? "nav-tab--highlight" : ""].join(" ").trim();
  return (
    <li ref={ref} className={liClass} onMouseEnter={handleMouseEnter}>
      {isButton ? (
        <span onClick={onClick} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onClick?.()}>
          {children}
        </span>
      ) : (
        <Link to={to}>{children}</Link>
      )}
    </li>
  );
}

// ─── NavHeader ────────────────────────────────────────────────────────────────
function NavHeader({ user, handleLogout, isLight }) {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });
  return (
    <ul
      className={["nav-pill", isLight ? "nav-pill--light" : ""].join(" ").trim()}
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      <Tab to="/inicio" setPosition={setPosition}>Início</Tab>
      <Tab to="/sobre" setPosition={setPosition}>Sobre a Mars</Tab>
      <Tab to="/contatos" setPosition={setPosition}>Contatos</Tab>
      <Tab to="/adquira" setPosition={setPosition}>Adquira a sua</Tab>
      {user ? (
        <Tab isButton highlight onClick={handleLogout} setPosition={setPosition}>Sair</Tab>
      ) : (
        <Tab to="/login" highlight setPosition={setPosition}>Entrar</Tab>
      )}
      <Cursor position={position} />
    </ul>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
export default function Header() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isLight = pathname === "/sobre" || pathname === "/contatos" || pathname === "/adquira";

  // Estados para controlar o scroll e a visibilidade
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        // Se estiver bem no topo da página, sempre mostre o header
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Se a rolagem atual for maior que a anterior (rolando para baixo), esconde
        setIsVisible(false);
      } else {
        // Se for menor (rolando para cima), mostra novamente
        setIsVisible(true);
      }

      // Atualiza a última posição do scroll
      setLastScrollY(currentScrollY);
    };

    // Adiciona o evento de scroll quando o componente monta
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Remove o evento quando o componente desmonta para evitar bugs
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  async function handleLogout() {
    await signOut(auth);
    navigate("/inicio");
  }

  // Se isVisible for falso, adiciona a classe que esconde o header
  const headerClass = `site-header ${!isVisible ? "site-header--hidden" : ""}`.trim();

  return (
    <header className={headerClass}>
      <Link to="/inicio" className="site-logo">
        <img src="/images/icons/logobranca.svg" alt="Mars" />
      </Link>
      <NavHeader user={user} handleLogout={handleLogout} isLight={isLight} />
    </header>
  );
}