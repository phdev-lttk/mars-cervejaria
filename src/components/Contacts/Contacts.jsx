import React from 'react';

function Contacts() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        background: 'rgba(0,0,0,0.4)', 
        padding: '3rem', 
        borderRadius: '20px', 
        backdropFilter: 'blur(10px)', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: '900px',
        width: '100%',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        
        <h2 style={{ fontFamily: 'Alata, sans-serif', fontSize: '2.5rem', color: '#ffb142', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Onde nos encontrar
        </h2>

        <iframe
          className="mapa"
          src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d61415.35107865831!2d-48.10150281774389!3d-15.832431940589649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e2!4m0!4m5!1s0x935a3321354999e9%3A0x881fa531a22a3f88!2sSt.%20B%20Norte%20Centro%20Universit%C3%A1rio%20Proje%C3%A7%C3%A3o%20-%20Taguatinga%20-%20Taguatinga%2C%20Bras%C3%ADlia%20-%20DF%2C%2070297-400!3m2!1d-15.8193551!2d-48.0652797!5e0!3m2!1spt-BR!2sbr!4v1667759768794!5m2!1spt-BR!2sbr"
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização Mars Design"
        />

        <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem', alignItems: 'center', justifyContent: 'center' }}>
          <a href="https://www.instagram.com/_marsdesigner/" target="_blank" rel="noreferrer" style={{ textAlign: 'center', textDecoration: 'none' }}>
            <img src="/images/icons/INSTA.svg" alt="instagram" style={{ height: '60px', transition: 'transform 0.3s', marginBottom: '10px' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
            <div style={{ color: '#ffb142', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: '0.1em' }}>INSTAGRAM</div>
          </a>

          <div style={{ width: '2px', height: '80px', background: 'rgba(255,255,255,0.2)' }}></div>

          <a href="https://whatsa.me/5561983731359" target="_blank" rel="noreferrer" style={{ textAlign: 'center', textDecoration: 'none' }}>
            <img src="/images/icons/WHATSAPP.svg" alt="whatsapp" style={{ height: '60px', transition: 'transform 0.3s', marginBottom: '10px' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
            <div style={{ color: '#ffb142', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', letterSpacing: '0.1em' }}>WHATSAPP</div>
          </a>
        </div>

      </div>
    </div>
  );
}

export default Contacts;
