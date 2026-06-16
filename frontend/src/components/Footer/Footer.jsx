import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-body">

                <nav className="footer-nav">
                    <a href="/inicio">Início</a>
                    <a href="/sobre">Sobre a Mars</a>
                    <a href="/contatos">Contatos</a>
                    <a href="/adquira">Adquira a sua</a>
                </nav>

                <div className="footer-contact">
                    <p className="footer-label">Contato</p>
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                        Instagram
                    </a>
                    <a href="https://web.whatsapp.com/" target="_blank" rel="noreferrer">
                        WhatsApp
                    </a>
                </div>

            </div>

            <div className="footer-logo-wrap" aria-hidden="true">
                <img
                    className="footer-logo"
                    src="/images/icons/logobranca.svg"
                    alt="Mars"
                />
            </div>

            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} Mars Cervejaria Artesanal</span>
                <span>Criado por Mars Design.</span>
            </div>

        </footer>
    );
}