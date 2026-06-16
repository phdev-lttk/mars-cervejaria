import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthContext } from '../../context/AuthContext';
import beerBg from '../../assets/beer-bg.gif';
import './AdminLayout.css';

/* ── SVG ICONS ── */
const IconDashboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);
const IconBeer = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 11h1a3 3 0 0 1 0 6h-1" /><path d="M9 6l1-3h4l1 3" />
        <path d="M7 6h10l-1 12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L7 6z" />
        <path d="M7 10h10" />
    </svg>
);
const IconUsers = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const IconOrders = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);
const IconReport = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <path d="M2 20h20" />
    </svg>
);
const IconLogout = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);
const IconLogoMars = () => (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
        {/* Logotipo amarelo sobre o fundo preto */}
        <path d="M20 4L34 12V28L20 36L6 28V12L20 4Z" stroke="#ffa800" strokeWidth="2.5" fill="none" />
        <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="#ffa800" opacity="0.3" />
        <circle cx="20" cy="20" r="3" fill="#ffa800" />
    </svg>
);

const navItems = [
    { to: '/dashboard', icon: <IconDashboard />, label: 'Dashboard' },
    { to: '/cervejas', icon: <IconBeer />, label: 'Gerenciar Cervejas' },
    { to: '/usuarios', icon: <IconUsers />, label: 'Usuários' },
    { to: '/pedidos', icon: <IconOrders />, label: 'Pedidos' },
    { to: '/relatorio', icon: <IconReport />, label: 'Relatórios' },
];

export default function AdminLayout({ children }) {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    async function handleLogout() {
        await signOut(auth);
        navigate('/login');
    }

    const avatarLetter = user?.email?.[0]?.toUpperCase() || 'A';

    return (
        <div className="admin-layout">

            {/* ── GIF DE FUNDO GLOBAL (APLICA EM TODAS AS PÁGINAS) ── */}
            <div className="admin-bg-gif" style={{ backgroundImage: `url(${beerBg})` }} aria-hidden="true" />
            <div className="admin-bg-overlay" aria-hidden="true" />

            {/* ── SIDEBAR ── */}
            <aside className="admin-sidebar">

                {/* Logo */}
                <div className="admin-sidebar-logo">
                    <div className="admin-sidebar-logo-icon"><IconLogoMars /></div>
                    <div>
                        <span className="admin-sidebar-logo-title">MARS</span>
                        <span className="admin-sidebar-logo-sub">Cervejaria</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="admin-sidebar-nav">
                    <span className="admin-sidebar-nav-label">Menu</span>
                    {navItems.map(item => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`admin-sidebar-nav-item${location.pathname === item.to ? ' active' : ''}`}
                        >
                            <span className="admin-sidebar-nav-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="admin-sidebar-footer">
                    <div className="admin-sidebar-user">
                        <div className="admin-sidebar-avatar">{avatarLetter}</div>
                        <div className="admin-sidebar-user-info">
                            <span className="admin-sidebar-user-email">{user?.email}</span>
                            <span className="admin-sidebar-user-role">Administrador</span>
                        </div>
                    </div>
                    <button className="admin-sidebar-logout" onClick={handleLogout}>
                        <IconLogout /> Sair da conta
                    </button>
                </div>

            </aside>

            {/* ── CONTEÚDO PRINCIPAL ── */}
            <main className="admin-content">
                <div className="admin-content-inner">
                    {children}
                </div>
            </main>
        </div>
    );
}