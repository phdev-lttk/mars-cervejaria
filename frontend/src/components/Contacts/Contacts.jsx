import React from 'react';
import Header from '../Header/Header';
import './Contacts.css';

function Contacts() {
  return (
    <div className="contacts">

      {/* ── Hero ── */}
      <section className="contacts-hero">
        <p className="contacts-eyebrow">Fale com a gente:</p>
        <h1 className="contacts-headline">
          Nos conheça
          <br />
          nas
          <br />
          redes.
        </h1>
      </section>

      <hr />

      {/* ── Split: Mapa + Redes Sociais ── */}
      <section className="contacts-split">
        <div className="contacts-split__left">
          <span className="contacts-label">Onde estamos</span>
          <iframe
            className="mapa"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12345.6789!2d-47.9292!3d-15.7801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1234567890"
            width="100%"
            height="100%"
            style={{ borderRadius: 0, border: 'none' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização Mars Design"
          />
        </div>

        <div className="contacts-split__right">
          <span className="contacts-label">Redes sociais</span>

          <a
            href="https://www.instagram.com/_marsdesigner/"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            <img src="/images/icons/INSTA.svg" alt="" className="social-icon" aria-hidden="true" />
            <div className="social-info">
              <span className="social-name">Instagram</span>
              <span className="social-handle">@_marsdesigner</span>
            </div>
            <span className="social-arrow">↗</span>
          </a>

          <a
            href="https://whatsa.me/5561983731359"
            target="_blank"
            rel="noreferrer"
            className="social-link"
          >
            <img src="/images/icons/WHATSAPP.svg" alt="" className="social-icon" aria-hidden="true" />
            <div className="social-info">
              <span className="social-name">WhatsApp</span>
              <span className="social-handle">+55 (61) 98373-1359</span>
            </div>
            <span className="social-arrow">↗</span>
          </a>

          <a
            href="mailto:contato@marsdesign.com"
            className="social-link"
          >
            <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
            <div className="social-info">
              <span className="social-name">E-mail</span>
              <span className="social-handle">contato@marsdesign.com</span>
            </div>
            <span className="social-arrow">↗</span>
          </a>

        </div>
      </section>

      <hr />

      {/* ── Cards de Atendimento ── */}
      <section className="contacts-cards-section">
        <span className="contacts-label">Canais de atendimento</span>
        <div className="contacts-cards">

          <div className="cartoon-card-wrap">
            <div className="cartoon-outer" />
            <div className="cartoon-inner">
              <div className="contacts-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#f0bc00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <h3>Endereço</h3>
              <p>Brasília, DF<br />Brasil</p>
            </div>
          </div>

          <div className="cartoon-card-wrap">
            <div className="cartoon-outer" />
            <div className="cartoon-inner">
              <div className="contacts-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#f0bc00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>WhatsApp</h3>
              <a href="https://whatsa.me/5561983731359" target="_blank" rel="noreferrer">
                +55 (61) 98373-1359
              </a>
            </div>
          </div>

          <div className="cartoon-card-wrap">
            <div className="cartoon-outer" />
            <div className="cartoon-inner">
              <div className="contacts-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#f0bc00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
              </div>
              <h3>E-mail</h3>
              <a href="mailto:contato@marsdesign.com">
                contato@marsdesign.com
              </a>
            </div>
          </div>

          <div className="cartoon-card-wrap">
            <div className="cartoon-outer" />
            <div className="cartoon-inner">
              <div className="contacts-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#f0bc00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Horário</h3>
              <p>Seg – Sex<br />09h – 18h</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Contacts;
