import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../Header/Header';
import { criarPedido } from '../../services/pedidosService';
import { getUsuario } from '../../services/usuariosService';
import { getCervejas } from '../../services/cervejasService';
import './Adquira.css';
import './Animations.css';
import Footer from '../Footer/Footer';

/* ─── helpers ─────────────────────────────────── */
function getImagemCerveja(c) {
    if (c.imagemUrl) return c.imagemUrl;
    const n = c.nome.toLowerCase();
    if (n.includes('blue dark') || n.includes('dark')) return '/images/home/2 DARKBLUE.png';
    if (n.includes('forest')) return '/images/home/2 GREEN.png';
    if (n.includes('sol')) return '/images/home/SOL DA TARDE.png';
    return '/images/home/MARS_BEER.png';
}

function calcularIdade(dataNasc) {
    if (!dataNasc) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
}

function formatarEndereco(end) {
    if (!end) return null;
    const partes = [
        end.rua && `${end.rua}${end.numero ? ', ' + end.numero : ''}`,
        end.complemento,
        end.bairro,
        end.cidade && end.estado ? `${end.cidade} — ${end.estado}` : (end.cidade || end.estado),
        end.cep,
    ].filter(Boolean);
    return partes.join(' · ');
}

/* ─── Ripple util ──────────────────────────────── */
function addRipple(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    circle.className = 'ripple';
    circle.style.cssText = `
        width:${diameter}px; height:${diameter}px;
        left:${e.clientX - rect.left - diameter / 2}px;
        top:${e.clientY - rect.top - diameter / 2}px;
    `;
    btn.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
}

/* ─── Hook: scroll reveal ──────────────────────── */
function useScrollReveal() {
    useEffect(() => {
        const targets = document.querySelectorAll('[data-reveal]');
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const delay = Number(el.dataset.delay || 0);
                        setTimeout(() => el.classList.add('revealed'), delay);
                        io.unobserve(el);
                    }
                });
            },
            { threshold: 0.12 }
        );
        targets.forEach((el) => io.observe(el));
        return () => io.disconnect();
    });
}

/* ─── Hook: progress bar ───────────────────────── */
function useScrollProgress() {
    useEffect(() => {
        const bar = document.getElementById('aq-progress');
        if (!bar) return;
        const onScroll = () => {
            const max = document.body.scrollHeight - window.innerHeight;
            bar.style.transform = `scaleX(${window.scrollY / max})`;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
}

/* ─── Hook: stagger cards ──────────────────────── */
const _animatedCards = new Set();

function useCardStagger(cervejasList) {
    useEffect(() => {
        if (!cervejasList.length) return;
        const cards = document.querySelectorAll('.aq-card');
        cards.forEach((el) => {
            const key = el.dataset.idx;
            if (_animatedCards.has(key)) {
                el.classList.remove('card-entering');
                el.classList.add('card-visible');
            } else {
                el.classList.add('card-entering');
            }
        });
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const key = el.dataset.idx;
                        const idx = Number(key || 0);
                        setTimeout(() => {
                            el.classList.remove('card-entering');
                            el.classList.add('card-visible');
                            _animatedCards.add(key);
                        }, idx * 100);
                        io.unobserve(el);
                    }
                });
            },
            { threshold: 0.1 }
        );
        cards.forEach((el) => {
            if (!_animatedCards.has(el.dataset.idx)) io.observe(el);
        });
        return () => io.disconnect();
    }, [cervejasList]);
}

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════ */
export default function Adquira() {
    const [cervejasList, setCervejasList] = useState([]);
    const [carrinho, setCarrinho] = useState({});
    const [perfil, setPerfil] = useState(null);
    const [loadingPerfil, setLoadingPerfil] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderH2Ref = useRef(null);

    /* ── animações ── */
    useScrollReveal();
    useScrollProgress();
    useCardStagger(cervejasList);

    /* ── reveal do h2 de order ── */
    useEffect(() => {
        if (!orderH2Ref.current) return;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                orderH2Ref.current.classList.add('revealed');
                io.disconnect();
            }
        }, { threshold: 0.3 });
        io.observe(orderH2Ref.current);
        return () => io.disconnect();
    }, []);

    /* ── busca perfil do usuário logado ── */
    useEffect(() => {
        async function fetchPerfil() {
            try {
                const dados = await getUsuario();
                setPerfil(dados);
            } catch (err) {
                console.error('Erro ao buscar perfil:', err);
            } finally {
                setLoadingPerfil(false);
            }
        }
        if (user) fetchPerfil();
        else setLoadingPerfil(false);
    }, [user]);

    /* ── fetch cervejas ── */
    useEffect(() => {
        async function fetchCervejas() {
            try {
                const list = await getCervejas();
                setCervejasList(list);
                
                const paramId = searchParams.get('cerveja');
                const paramNome = searchParams.get('nome');
                if (paramId && list.find(c => c.id === paramId)) {
                    setCarrinho({ [paramId]: 1 });
                } else if (paramNome) {
                    const found = list.find(c => c.nome.toLowerCase() === paramNome.toLowerCase());
                    if (found) setCarrinho({ [found.id]: 1 });
                }
            } catch (err) {
                console.error("Erro ao carregar cervejas", err);
            }
        }
        fetchCervejas();
    }, [searchParams]);

    /* ── carrinho ── */
    function alterarQtd(id, delta) {
        setCarrinho(prev => {
            const nova = (prev[id] || 0) + delta;
            if (nova <= 0) { const { [id]: _, ...rest } = prev; return rest; }
            return { ...prev, [id]: nova };
        });
    }

    function totalCarrinho() {
        return Object.entries(carrinho).reduce((acc, [id, qtd]) => {
            const c = cervejasList.find(c => c.id === id);
            return acc + (c ? parseFloat(c.preco) * qtd : 0);
        }, 0);
    }

    const itensCarrinho = Object.entries(carrinho).filter(([, q]) => q > 0);
    const temItens = itensCarrinho.length > 0;

    /* ── submit ── */
    async function handleSubmit(e) {
        e.preventDefault();
        if (!temItens) return;

        // Sem login → redireciona para /login
        if (!user) {
            navigate('/login');
            return;
        }

        // Verifica idade mínima de 18 anos
        const idade = calcularIdade(perfil?.dataNascimento);
        if (idade !== null && idade < 18) {
            alert('Você precisa ter 18 anos ou mais para finalizar um pedido.');
            return;
        }

        const usuarioNome = perfil?.nome || user?.email || 'Usuário';
        const itens = itensCarrinho.map(([id, quantidade]) => {
            const c = cervejasList.find(c => c.id === id);
            return { cervejaId: c.id, nome: c.nome, quantidade, precoUnitario: c.preco };
        });
        try {
            await criarPedido({ usuarioNome, itens, total: totalCarrinho().toFixed(2) });
            alert('Pedido enviado com sucesso!');
            navigate('/inicio');
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar pedido. Verifique se o servidor backend está rodando!');
        }
    }

    const enderecoFormatado = perfil?.endereco ? formatarEndereco(perfil.endereco) : null;

    /* ══════════════════════════════════════════
       RENDER
    ══════════════════════════════════════════ */
    return (
        <div className="aq-page">
            <div className="aq-progress-bar" id="aq-progress" />

            <Header />

            {/* ── HERO ── */}
            <section className="aq-hero">
                <div className="aq-hero__particles" aria-hidden="true">
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className="aq-particle" />
                    ))}
                </div>

                <p className="aq-hero__eyebrow">Cervejaria Mars — Linha Artesanal</p>

                <h1 className="aq-hero__h1">
                    <span className="line-1"><span className="line-inner">Escolha</span></span>
                    <span className="line-2"><span className="line-inner"><span className="aq-gold">sua</span></span></span>
                    <span className="line-3"><span className="line-inner">cerveja.</span></span>
                </h1>

                <p className="aq-hero__sub">
                    Três estilos, um propósito. Da seleção do malte ao último gole —
                    feito com intenção, bebido com prazer.
                </p>
                <a href="#catalog" className="aq-hero__scroll">Ver catálogo ↓</a>
            </section>

            {/* ── CATALOG ── */}
            <section className="aq-catalog" id="catalog">
                <div className="aq-catalog__header" data-reveal="fade-up" data-delay="0">
                    <div>
                        <span className="aq-catalog__label">Linha completa</span>
                        <span className="aq-catalog__count">
                            <span className="aq-catalog__number">{cervejasList.length}</span> produtos
                        </span>
                    </div>
                    <a href="#order" className="aq-catalog__link">Fazer pedido →</a>
                </div>

                <div className="aq-grid">
                    {cervejasList.map((c, idx) => {
                        const qtd = carrinho[c.id] || 0;
                        return (
                            <div
                                key={c.id}
                                data-nome={c.nome}
                                data-idx={idx}
                                className={`aq-card ${qtd > 0 ? 'aq-card--sel' : ''}`}
                            >
                                <div className="aq-card__img-wrap">
                                    <span className="aq-card__badge">{c.tipo}</span>
                                    <img
                                        src={encodeURI(getImagemCerveja(c))}
                                        alt={c.nome}
                                        className="aq-card__img"
                                    />
                                </div>

                                <div className="aq-card__content">
                                    <div className="aq-card__info">
                                        <p className="aq-card__abv">{c.abv}% ABV</p>
                                        <h3 className="aq-card__nome">{c.nome}</h3>
                                    </div>

                                    <div className="aq-card__footer">
                                        <span className="aq-card__price">
                                            R$ {parseFloat(c.preco).toFixed(2).replace('.', ',')}
                                        </span>

                                        {qtd === 0 ? (
                                            <button
                                                className="aq-add-btn"
                                                onClick={() => alterarQtd(c.id, 1)}
                                            >
                                                Adicionar ao carrinho
                                            </button>
                                        ) : (
                                            <div className="aq-qty">
                                                <button className="aq-qty__btn" onClick={() => alterarQtd(c.id, -1)}>−</button>
                                                <span className="aq-qty__val">{qtd}</span>
                                                <button className="aq-qty__btn" onClick={() => alterarQtd(c.id, 1)}>+</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── PILL FLUTUANTE ── */}
            {temItens && (
                <a href="#order" className="aq-float-cart">
                    <span className="aq-float-cart__lbl">
                        {itensCarrinho.reduce((a, [, q]) => a + q, 0)} itens
                    </span>
                    <span className="aq-float-cart__sep">·</span>
                    <span className="aq-float-cart__total">
                        R$ {totalCarrinho().toFixed(2).replace('.', ',')}
                    </span>
                    <span className="aq-float-cart__arr"> Finalizar →</span>
                </a>
            )}

            {/* ── ORDER ── */}
            <section className="aq-order" id="order">
                <div className="aq-order__head">
                    <h2 className="aq-order__h2" ref={orderH2Ref}>
                        <span style={{ display: 'block', overflow: 'hidden' }}>
                            <span>Finalize</span>
                        </span>
                        <span style={{ display: 'block', overflow: 'hidden' }}>
                            <span>seu pedido.</span>
                        </span>
                    </h2>
                    <p className="aq-order__sub" data-reveal="fade-up" data-delay="200">
                        {temItens
                            ? `${itensCarrinho.reduce((a, [, q]) => a + q, 0)} produto(s) selecionado(s)`
                            : 'Selecione cervejas acima'}
                    </p>
                </div>

                <div className="aq-order__inner">
                    {/* ── Resumo do pedido ── */}
                    <div className="aq-order__summary" data-reveal="fade-right" data-delay="100">
                        <p className="aq-order__col-label">Resumo do pedido</p>

                        {!temItens ? (
                            <div className="aq-empty">
                                <p className="aq-empty__txt">
                                    Nenhum item selecionado ainda.<br />
                                    Escolha suas cervejas no catálogo acima.
                                </p>
                            </div>
                        ) : (
                            <div className="aq-cart">
                                {itensCarrinho.map(([id, qtd]) => {
                                    const c = cervejasList.find(c => c.id === id);
                                    if (!c) return null;
                                    return (
                                        <div key={id} className="aq-cart__row">
                                            <div className="aq-cart__info">
                                                <span className="aq-cart__name">{c.nome}</span>
                                                <span className="aq-cart__tipo">{c.tipo}</span>
                                            </div>
                                            <div className="aq-qty aq-qty--sm">
                                                <button type="button" className="aq-qty__btn" onClick={() => alterarQtd(id, -1)}>−</button>
                                                <span className="aq-qty__val">{qtd}</span>
                                                <button type="button" className="aq-qty__btn" onClick={() => alterarQtd(id, 1)}>+</button>
                                            </div>
                                            <span className="aq-cart__price">
                                                R$ {(parseFloat(c.preco) * qtd).toFixed(2).replace('.', ',')}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div className="aq-cart__total-row">
                                    <span className="aq-cart__total-lbl">Total</span>
                                    <span className="aq-cart__total-val">
                                        R$ {totalCarrinho().toFixed(2).replace('.', ',')}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Dados do pedido (substituindo o form de nome/email) ── */}
                    <div className="aq-order__form-wrap" data-reveal="fade-left" data-delay="200">
                        <p className="aq-order__col-label">Seus dados</p>

                        {/* Aviso quando não logado */}
                        {!user && (
                            <div className="aq-login-aviso">
                                <span className="aq-login-aviso__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </span>
                                <p>Faça <a href="/login" className="aq-login-aviso__link">login</a> ou <a href="/login" className="aq-login-aviso__link">cadastre-se</a> para finalizar seu pedido.</p>
                            </div>
                        )}

                        {/* Aviso de menor de 18 */}
                        {user && perfil && calcularIdade(perfil.dataNascimento) !== null && calcularIdade(perfil.dataNascimento) < 18 && (
                            <div className="aq-login-aviso aq-login-aviso--menor">
                                <span className="aq-login-aviso__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </span>
                                <p>Você precisa ter <strong>18 anos ou mais</strong> para fazer pedidos de bebidas alcoólicas.</p>
                            </div>
                        )}

                        {loadingPerfil ? (
                            <div className="aq-perfil-loading">
                                <span className="aq-perfil-loading__dot" />
                                <span className="aq-perfil-loading__dot" />
                                <span className="aq-perfil-loading__dot" />
                            </div>
                        ) : (
                            <form className="aq-form" onSubmit={handleSubmit}>
                                {/* Card de identificação do usuário */}
                                {user && (
                                    <div className="aq-user-card">
                                        <div className="aq-user-card__avatar" aria-hidden="true">
                                            {perfil?.nome
                                                ? perfil.nome.trim().split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
                                                : (user?.email?.[0] || '?').toUpperCase()
                                            }
                                        </div>
                                        <div className="aq-user-card__info">
                                            <span className="aq-user-card__nome">
                                                {perfil?.nome || 'Usuário'}
                                            </span>
                                            <span className="aq-user-card__email">
                                                {user?.email}
                                            </span>
                                            {perfil?.telefone && (
                                                <span className="aq-user-card__tel">
                                                    {perfil.telefone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Endereço de entrega */}
                                {enderecoFormatado && (
                                    <div className="aq-user-endereco">
                                        <span className="aq-user-endereco__label">Entrega</span>
                                        <span className="aq-user-endereco__val">{enderecoFormatado}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="aq-submit"
                                    disabled={!temItens || (!user) || (perfil && calcularIdade(perfil.dataNascimento) !== null && calcularIdade(perfil.dataNascimento) < 18)}
                                    onClick={addRipple}
                                >
                                    <span>Confirmar pedido</span>
                                    <span className="aq-submit__arr">→</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}