import React, { useState, useEffect, useRef } from 'react';
import './Animations.css';

/* ══════════════════════════════════
   FLIP COUNTER
══════════════════════════════════ */
export function FlipCounter({ end, prefix = '', duration = 1400 }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!end && end !== 0) return;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
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
export function GlitchText({ children, className = '' }) {
  return (
    <span className={`glitch-wrap ${className}`} data-text={children}>
      {children}
    </span>
  );
}

/* ══════════════════════════════════
   STAGGERED LIST (Efeito cascata para as tabelas)
══════════════════════════════════ */
export function StaggeredList({ children, staggerDelay = 60, as: Component = 'tbody', className = '' }) {
  return (
    <Component className={`staggered-list ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          className: `${child.props.className || ''} stagger-item`,
          style: { ...child.props.style, '--stagger-idx': index, '--stagger-delay': `${staggerDelay}ms` }
        });
      })}
    </Component>
  );
}

/* ══════════════════════════════════
   SHINY TEXT (Brilho dinâmico)
══════════════════════════════════ */
export function ShinyText({ children, className = '' }) {
  return (
    <span className={`shiny-text ${className}`}>{children}</span>
  );
}

/* ══════════════════════════════════
   LOADER ANIMADO
══════════════════════════════════ */
export function AnimatedLoader({ text = "Carregando dados..." }) {
  return (
    <div className="loader-wrap">
      <div className="loader-circle" />
      <div className="loader-text"><ShinyText>{text}</ShinyText></div>
    </div>
  );
}
