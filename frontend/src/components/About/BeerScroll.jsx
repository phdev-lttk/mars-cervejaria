import React from 'react';
import './BeerScroll.css';

const beers = [
  {
    id: 0,
    eyebrow: 'Dark Ale',
    name: 'Blue Dark',
    desc: 'Uma cerveja de personalidade intensa — malte torrado, notas de cacau e um amargor elegante que fica. Para quem aprecia profundidade em cada gole.',
    ibu: '42 IBU',
    abv: '6,2% ABV',
    tipo: 'Dark Ale',
    img: '/images/home/2 DARKBLUE.png',
    accent: '#1a3a5c',
  },
  {
    id: 1,
    eyebrow: 'Lager Artesanal',
    name: 'Sol da Tarde',
    desc: 'O estilo de cerveja artesanal Pilsen ou Pilsner surgiu na República Tcheca. Como características marcantes, a bebida apresenta aroma e sabor acentuados pelo lúpulo, além da cor dourada. Seu teor alcoólico varia entre 4,6% e 5% em média. As mais famosas são a cerveja de origem Pilsner Urquell (primeira Pilsen produzida) e a German Pilsner.',
    ibu: '18 IBU',
    abv: '4,8% ABV',
    tipo: 'Lager',
    img: '/images/home/MARS_BEER.png',
    accent: '#c97d00',
  },
  {
    id: 2,
    eyebrow: 'IPA Herbal',
    name: 'Forest',
    desc: 'Inspirada nas matas cerradas — lúpulos verdes, aroma herbáceo e uma refrescância que remete à natureza bruta. Complexa, selvagem, indomável.',
    ibu: '55 IBU',
    abv: '5,5% ABV',
    tipo: 'IPA',
    img: '/images/home/2 GREEN.png',
    accent: '#1e4a2a',
  },
];

export default function BeerScroll() {
  return (
    <div className="bs-section">
      {beers.map((beer, i) => (
        <React.Fragment key={beer.id}>
          {i !== 0 && <hr className="bs-hr" />}
          <div className="bs-card" style={{ zIndex: i + 1 }}>
            <div className="bs-card__left">
              <span className="bs-eyebrow">{beer.eyebrow}</span>
              <h2 className="bs-name">{beer.name}</h2>
              <p className="bs-desc">{beer.desc}</p>
              <a className="bs-btn" href="/adquira-a-sua">
                Adquira a sua
              </a>
              <div className="bs-specs">
                <div className="bs-spec">
                  <span className="bs-spec-label">Amargor</span>
                  <span className="bs-spec-val">{beer.ibu}</span>
                </div>
                <div className="bs-spec">
                  <span className="bs-spec-label">Teor Alc.</span>
                  <span className="bs-spec-val">{beer.abv}</span>
                </div>
                <div className="bs-spec">
                  <span className="bs-spec-label">Estilo</span>
                  <span className="bs-spec-val">{beer.tipo}</span>
                </div>
              </div>
            </div>
            <div className="bs-card__right" style={{ backgroundColor: beer.accent }}>
              <img src={beer.img} alt={beer.name} className="bs-img" />
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
