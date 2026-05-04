import { useEffect, useState } from 'react';
import { log_event } from '../physics/formulas.js';
import { useTranslation } from '../contexts/LanguageContext.jsx';

/* =============================================================
 * Componentes auxiliares para SVG didático
 * ============================================================= */

/**
 * Partícula animada (elétron ou lacuna) percorrendo um path nomeado.
 * type: 'e' -> elétron (azul), 'h' -> lacuna (laranja).
 */
function AnimParticle({ pathId, dur = 3, delay = 0, type = 'e', r = 5 }) {
  const isE = type === 'e';
  const fill = isE ? '#0b67c2' : '#f97316';
  const stroke = isE ? '#034f9e' : '#b45309';
  return (
    <circle r={r} fill={fill} stroke={stroke} strokeWidth="1">
      <animateMotion
        dur={`${dur}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
        rotate="auto"
      >
        <mpath xlinkHref={`#${pathId}`} />
      </animateMotion>
    </circle>
  );
}

/**
 * Gera N partículas distribuídas no tempo ao longo de um path.
 */
function ParticleStream({ pathId, count = 5, dur = 3, type = 'e', r = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <AnimParticle
          key={`${pathId}-${type}-${i}`}
          pathId={pathId}
          dur={dur}
          delay={(i * dur) / count}
          type={type}
          r={r}
        />
      ))}
    </>
  );
}

/**
 * Marcadores comuns para setas (proporcionais).
 * strokeColor define a cor do marcador.
 */
function ArrowDefs() {
  return (
    <defs>
      <marker id="arrHeadK" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,4 L0,8 Z" fill="#111827" />
      </marker>
      <marker id="arrHeadB" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,4 L0,8 Z" fill="#0b67c2" />
      </marker>
      <marker id="arrHeadO" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,4 L0,8 Z" fill="#c2410c" />
      </marker>
      <marker id="arrHeadV" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,4 L0,8 Z" fill="#6d28d9" />
      </marker>

      <linearGradient id="metalGrad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#f5f5f5" />
        <stop offset="45%" stopColor="#c9c9c9" />
        <stop offset="100%" stopColor="#8d8d8d" />
      </linearGradient>
      <linearGradient id="pGrad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#ffedd5" />
        <stop offset="50%" stopColor="#fdba74" />
        <stop offset="100%" stopColor="#ffedd5" />
      </linearGradient>
      <linearGradient id="nGrad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#bfdbfe" />
        <stop offset="50%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#bfdbfe" />
      </linearGradient>
      <linearGradient id="gateGrad" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#ede9fe" />
        <stop offset="50%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
      <linearGradient id="organicGrad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="50%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#fef3c7" />
      </linearGradient>
      <linearGradient id="algaasGrad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#e9d5ff" />
        <stop offset="50%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#e9d5ff" />
      </linearGradient>
      <linearGradient id="gaasGrad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#fce7f3" />
        <stop offset="50%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#fce7f3" />
      </linearGradient>
    </defs>
  );
}

/**
 * Terminal com contato metálico e rótulo.
 */
function Terminal({ x, y, w = 34, h = 18, label, leadTo, labelDx = 0, labelDy = -6 }) {
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill="url(#metalGrad)" stroke="#111827" strokeWidth="1" />
      <text x={cx} y={y + h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827">{label}</text>
      {leadTo && (
        <line x1={cx} y1={y + h} x2={leadTo.x} y2={leadTo.y} stroke="#111827" strokeWidth="1.5" />
      )}
    </g>
  );
}

/* =============================================================
 * Renderizadores de cada tipo de FET
 * viewBox padrão: 0 0 640 360
 * ============================================================= */

/* ---------- MOSFET PLANAR (nMOS) ---------- */
function MosfetPlanar() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      {/* substrato P */}
      <rect x="40" y="220" width="560" height="120" rx="8" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="310" y="300" textAnchor="middle" fontSize="13" fontWeight="700" fill="#7c2d12">SUBSTRATO P</text>

      {/* depleção */}
      <path d="M150 220 C190 240 230 250 270 250 C310 252 330 252 370 250 C410 250 450 240 490 220 Z"
        fill="#f1f5f9" opacity="0.8" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" />

      {/* source / drain N+ */}
      <rect x="90" y="170" width="120" height="70" rx="6" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" />
      <text x="150" y="210" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">N+ Source</text>

      <rect x="430" y="170" width="120" height="70" rx="6" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" />
      <text x="490" y="210" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">N+ Drain</text>

      {/* canal induzido */}
      <rect x="210" y="215" width="220" height="10" rx="5" fill="#0b67c2" opacity="0.85" />
      <text x="320" y="208" textAnchor="middle" fontSize="10" fill="#0b67c2" fontWeight="700">Canal N induzido</text>

      {/* óxido */}
      <rect x="205" y="180" width="230" height="14" fill="#fde68a" stroke="#92400e" strokeWidth="1.5" />
      <text x="320" y="191" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400e">SiO₂ (óxido)</text>

      {/* gate */}
      <rect x="220" y="130" width="200" height="46" rx="6" fill="url(#gateGrad)" stroke="#6d28d9" strokeWidth="2" />
      <text x="320" y="158" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">GATE</text>

      {/* terminais */}
      <Terminal x={133} y={90} label="S" leadTo={{ x: 150, y: 170 }} />
      <Terminal x={303} y={80} label="G" leadTo={{ x: 320, y: 130 }} />
      <Terminal x={473} y={90} label="D" leadTo={{ x: 490, y: 170 }} />

      {/* path do canal para elétrons */}
      <path id="ch-mosfet" d="M170 220 H470" fill="none" stroke="none" />
      <ParticleStream pathId="ch-mosfet" count={6} dur={2.5} type="e" />

      {/* seta de corrente convencional (proporcional) */}
      <path d="M470 252 H180" fill="none" stroke="#c2410c" strokeWidth="3" markerEnd="url(#arrHeadO)" />
      <text x="320" y="274" textAnchor="middle" fontSize="11" fill="#c2410c" fontWeight="700">I_D (corrente convencional)</text>

      {/* campo do gate */}
      <path d="M320 178 V214" stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrHeadV)" />
      <text x="352" y="200" fontSize="10" fill="#6d28d9">E (campo)</text>
    </svg>
  );
}

/* ---------- FINFET ---------- */
function FinFet() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      {/* substrato */}
      <rect x="40" y="280" width="560" height="60" rx="6" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="320" y="316" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7c2d12">SUBSTRATO P (bulk)</text>

      {/* fin vertical (Si) */}
      <rect x="280" y="120" width="80" height="160" rx="6" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" />
      <text x="320" y="266" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">FIN Si</text>

      {/* Source/Drain extensões (atrás e à frente) */}
      <rect x="120" y="180" width="140" height="80" rx="6" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" opacity="0.85" />
      <text x="190" y="222" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">Source N+</text>

      <rect x="380" y="180" width="140" height="80" rx="6" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" opacity="0.85" />
      <text x="450" y="222" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">Drain N+</text>

      {/* óxido envolvendo o fin (faixa fina lateral) */}
      <rect x="268" y="115" width="104" height="170" fill="none" stroke="#92400e" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="228" y="110" fontSize="10" fill="#92400e">high-κ + óxido</text>

      {/* gate envolvendo 3 lados do fin */}
      <path d="M240 105 H400 V280 H372 V135 H268 V280 H240 Z"
        fill="url(#gateGrad)" stroke="#6d28d9" strokeWidth="2" opacity="0.85" />
      <text x="320" y="100" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6d28d9">GATE (3 lados)</text>

      {/* terminais */}
      <Terminal x={173} y={140} label="S" leadTo={{ x: 190, y: 180 }} />
      <Terminal x={303} y={60} label="G" leadTo={{ x: 320, y: 105 }} />
      <Terminal x={433} y={140} label="D" leadTo={{ x: 450, y: 180 }} />

      {/* fluxo de elétrons através do fin */}
      <path id="ch-finfet" d="M200 220 C260 220 260 200 320 200 C380 200 380 220 440 220" fill="none" stroke="none" />
      <ParticleStream pathId="ch-finfet" count={6} dur={2.3} type="e" />

      {/* seta de corrente */}
      <path d="M450 250 H190" stroke="#c2410c" strokeWidth="3" markerEnd="url(#arrHeadO)" fill="none" />
      <text x="320" y="274" textAnchor="middle" fontSize="11" fill="#c2410c" fontWeight="700">I_D</text>
    </svg>
  );
}

/* ---------- GAAFET (Nanosheet) ---------- */
function GaaFet() {
  const sheets = [160, 200, 240];
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      <rect x="40" y="300" width="560" height="40" rx="6" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="320" y="326" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7c2d12">Substrato</text>

      {/* Source e Drain */}
      <rect x="80" y="140" width="120" height="160" rx="6" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" />
      <text x="140" y="225" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Source N+</text>

      <rect x="440" y="140" width="120" height="160" rx="6" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" />
      <text x="500" y="225" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Drain N+</text>

      {/* gate envolvendo totalmente (bloco) */}
      <rect x="200" y="110" width="240" height="200" rx="10" fill="url(#gateGrad)" stroke="#6d28d9" strokeWidth="2" opacity="0.55" />
      <text x="320" y="128" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6d28d9">GATE (all-around)</text>

      {/* nanosheets (canais) horizontais */}
      {sheets.map((y, i) => (
        <g key={i}>
          <rect x={204} y={y - 8} width={232} height={16} rx={8} fill="#bfdbfe" stroke="#1e40af" strokeWidth="1.5" />
          <path id={`ch-gaa-${i}`} d={`M200 ${y} H440`} fill="none" stroke="none" />
          <ParticleStream pathId={`ch-gaa-${i}`} count={4} dur={2.2 + i * 0.1} type="e" r={4} />
        </g>
      ))}
      <text x="320" y="175" textAnchor="middle" fontSize="10" fill="#1e40af" fontWeight="700">nanosheets (canais)</text>

      {/* terminais */}
      <Terminal x={123} y={90} label="S" leadTo={{ x: 140, y: 140 }} />
      <Terminal x={303} y={60} label="G" leadTo={{ x: 320, y: 110 }} />
      <Terminal x={483} y={90} label="D" leadTo={{ x: 500, y: 140 }} />

      {/* corrente */}
      <path d="M450 270 H190" stroke="#c2410c" strokeWidth="3" markerEnd="url(#arrHeadO)" fill="none" />
      <text x="320" y="290" textAnchor="middle" fontSize="11" fill="#c2410c" fontWeight="700">I_D (somada das nanosheets)</text>
    </svg>
  );
}

/* ---------- HEMT ---------- */
function Hemt() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      {/* substrato GaAs */}
      <rect x="40" y="260" width="560" height="80" rx="6" fill="url(#gaasGrad)" stroke="#be185d" strokeWidth="2" />
      <text x="320" y="310" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9d174d">GaAs (substrato / buffer intrínseco)</text>

      {/* AlGaAs dopado */}
      <rect x="40" y="200" width="560" height="60" rx="6" fill="url(#algaasGrad)" stroke="#6d28d9" strokeWidth="2" />
      <text x="320" y="236" textAnchor="middle" fontSize="12" fontWeight="700" fill="#5b21b6">AlGaAs dopado n (barreira)</text>

      {/* 2DEG na interface */}
      <line x1="40" y1="260" x2="600" y2="260" stroke="#0b67c2" strokeWidth="3" strokeDasharray="6 3" />
      <text x="460" y="258" fontSize="10" fontWeight="700" fill="#0b67c2">2DEG (gás de elétrons 2D)</text>

      {/* source/drain */}
      <rect x="60" y="170" width="110" height="50" rx="4" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="115" y="200" textAnchor="middle" fontSize="11" fontWeight="700">Source (ôhmico)</text>
      <rect x="470" y="170" width="110" height="50" rx="4" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="525" y="200" textAnchor="middle" fontSize="11" fontWeight="700">Drain (ôhmico)</text>

      {/* gate Schottky */}
      <rect x="260" y="140" width="120" height="60" rx="4" fill="#111827" />
      <text x="320" y="175" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fbbf24">GATE Schottky</text>

      {/* terminais */}
      <Terminal x={98} y={100} label="S" leadTo={{ x: 115, y: 170 }} />
      <Terminal x={303} y={80} label="G" leadTo={{ x: 320, y: 140 }} />
      <Terminal x={508} y={100} label="D" leadTo={{ x: 525, y: 170 }} />

      {/* 2DEG electron flow */}
      <path id="ch-hemt" d="M130 260 H520" fill="none" stroke="none" />
      <ParticleStream pathId="ch-hemt" count={8} dur={1.8} type="e" />

      {/* seta corrente */}
      <path d="M520 285 H130" stroke="#c2410c" strokeWidth="3.5" markerEnd="url(#arrHeadO)" fill="none" />
      <text x="320" y="302" textAnchor="middle" fontSize="11" fill="#c2410c" fontWeight="700">I_D (alta mobilidade)</text>
    </svg>
  );
}

/* ---------- IGBT ---------- */
function Igbt() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      {/* collector P+ (baixo) */}
      <rect x="40" y="290" width="560" height="40" rx="6" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="320" y="315" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7c2d12">Coletor P+ (substrato)</text>

      {/* N- drift */}
      <rect x="40" y="170" width="560" height="120" fill="#dbeafe" stroke="#1e40af" strokeWidth="2" />
      <text x="320" y="235" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e40af">N⁻ drift (alta tensão)</text>

      {/* P body (esquerda e direita) */}
      <rect x="40" y="120" width="220" height="50" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="150" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7c2d12">P-body</text>
      <rect x="380" y="120" width="220" height="50" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="490" y="150" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7c2d12">P-body</text>

      {/* N+ emissores */}
      <rect x="80" y="100" width="100" height="30" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="1.5" />
      <text x="130" y="120" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">N+ emitter</text>
      <rect x="460" y="100" width="100" height="30" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="1.5" />
      <text x="510" y="120" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">N+ emitter</text>

      {/* gate + óxido */}
      <rect x="260" y="108" width="120" height="14" fill="#fde68a" stroke="#92400e" strokeWidth="1.5" />
      <rect x="260" y="82" width="120" height="26" fill="url(#gateGrad)" stroke="#6d28d9" strokeWidth="2" />
      <text x="320" y="100" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">GATE (MOS)</text>

      {/* terminais */}
      <Terminal x={113} y={56} label="E" leadTo={{ x: 130, y: 100 }} />
      <Terminal x={303} y={44} label="G" leadTo={{ x: 320, y: 82 }} />
      <Terminal x={493} y={56} label="E" leadTo={{ x: 510, y: 100 }} />
      <Terminal x={303} y={340} label="C" leadTo={{ x: 320, y: 330 }} />

      {/* fluxo elétrons (emitter → drift → coletor), fluxo lacunas (coletor → drift) */}
      <path id="ch-igbt-e" d="M130 132 V180 C150 220 260 240 320 260 V295" fill="none" stroke="none" />
      <path id="ch-igbt-h" d="M320 295 V260 C260 240 220 220 200 200 V170" fill="none" stroke="none" />
      <ParticleStream pathId="ch-igbt-e" count={4} dur={3} type="e" />
      <ParticleStream pathId="ch-igbt-h" count={4} dur={3.2} type="h" />

      {/* corrente principal vertical (grossa) */}
      <path d="M320 58 V294" stroke="#c2410c" strokeWidth="4" markerEnd="url(#arrHeadO)" fill="none" opacity="0.35" />
      <text x="336" y="206" fontSize="11" fill="#c2410c" fontWeight="700">I_C (alta potência)</text>
    </svg>
  );
}

/* ---------- JFET ---------- */
function Jfet() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      {/* canal N */}
      <rect x="80" y="150" width="480" height="70" rx="10" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" />
      <text x="320" y="192" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">CANAL N</text>

      {/* gate P (superior e inferior) */}
      <rect x="220" y="110" width="200" height="40" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="320" y="136" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7c2d12">GATE P (topo)</text>
      <rect x="220" y="220" width="200" height="40" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="320" y="246" textAnchor="middle" fontSize="12" fontWeight="700" fill="#7c2d12">GATE P (base)</text>

      {/* regiões de depleção (estreitam o canal) */}
      <path d="M220 150 C260 170 380 170 420 150 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" />
      <path d="M220 220 C260 200 380 200 420 220 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" />

      {/* source/drain (contatos ôhmicos) */}
      <rect x="40" y="150" width="50" height="70" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="65" y="190" textAnchor="middle" fontSize="11" fontWeight="700">S</text>
      <rect x="550" y="150" width="50" height="70" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="575" y="190" textAnchor="middle" fontSize="11" fontWeight="700">D</text>

      {/* terminais */}
      <Terminal x={48} y={90} label="S" leadTo={{ x: 65, y: 150 }} />
      <Terminal x={303} y={60} label="G" leadTo={{ x: 320, y: 110 }} />
      <Terminal x={558} y={90} label="D" leadTo={{ x: 575, y: 150 }} />
      <Terminal x={303} y={300} label="G" leadTo={{ x: 320, y: 260 }} />

      {/* fluxo elétrons */}
      <path id="ch-jfet" d="M95 190 H555" fill="none" stroke="none" />
      <ParticleStream pathId="ch-jfet" count={6} dur={2.4} type="e" />

      {/* corrente */}
      <path d="M545 280 H95" stroke="#c2410c" strokeWidth="3" markerEnd="url(#arrHeadO)" fill="none" />
      <text x="320" y="298" textAnchor="middle" fontSize="11" fill="#c2410c" fontWeight="700">I_D</text>
    </svg>
  );
}

/* ---------- MESFET ---------- */
function Mesfet() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      {/* substrato GaAs semi-isolante */}
      <rect x="40" y="240" width="560" height="100" rx="6" fill="url(#gaasGrad)" stroke="#be185d" strokeWidth="2" />
      <text x="320" y="300" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9d174d">GaAs semi-isolante</text>

      {/* canal N dopado */}
      <rect x="40" y="190" width="560" height="50" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" />
      <text x="320" y="220" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">Canal N (GaAs:n)</text>

      {/* depleção sob o gate */}
      <path d="M250 190 C280 215 360 215 390 190 Z" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" />

      {/* source / drain ôhmicos */}
      <rect x="60" y="150" width="120" height="40" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="120" y="175" textAnchor="middle" fontSize="11" fontWeight="700">S (ôhmico)</text>
      <rect x="460" y="150" width="120" height="40" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="520" y="175" textAnchor="middle" fontSize="11" fontWeight="700">D (ôhmico)</text>

      {/* gate Schottky direto no canal */}
      <rect x="250" y="160" width="140" height="30" fill="#111827" />
      <text x="320" y="180" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf24">GATE Schottky</text>

      <Terminal x={103} y={110} label="S" leadTo={{ x: 120, y: 150 }} />
      <Terminal x={303} y={110} label="G" leadTo={{ x: 320, y: 160 }} />
      <Terminal x={503} y={110} label="D" leadTo={{ x: 520, y: 150 }} />

      <path id="ch-mesfet" d="M130 215 H510" fill="none" stroke="none" />
      <ParticleStream pathId="ch-mesfet" count={6} dur={2.0} type="e" />

      <path d="M510 265 H130" stroke="#c2410c" strokeWidth="3" markerEnd="url(#arrHeadO)" fill="none" />
      <text x="320" y="283" textAnchor="middle" fontSize="11" fill="#c2410c" fontWeight="700">I_D</text>
    </svg>
  );
}

/* ---------- MODFET (essencialmente HEMT com destaque à modulação de dopagem) ---------- */
function Modfet() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      <rect x="40" y="270" width="560" height="70" rx="6" fill="url(#gaasGrad)" stroke="#be185d" strokeWidth="2" />
      <text x="320" y="312" textAnchor="middle" fontSize="12" fontWeight="700" fill="#9d174d">GaAs intrínseco (canal)</text>

      {/* espaçador não dopado */}
      <rect x="40" y="250" width="560" height="20" fill="#ede9fe" stroke="#6d28d9" strokeWidth="1" />
      <text x="320" y="264" textAnchor="middle" fontSize="10" fontWeight="700" fill="#5b21b6">AlGaAs não dopado (spacer)</text>

      {/* AlGaAs dopado n (longe do canal) */}
      <rect x="40" y="200" width="560" height="50" fill="url(#algaasGrad)" stroke="#6d28d9" strokeWidth="2" />
      <text x="320" y="232" textAnchor="middle" fontSize="12" fontWeight="700" fill="#5b21b6">AlGaAs dopado n  (+ ⁺ ⁺ ⁺ doadores)</text>

      {/* 2DEG */}
      <line x1="40" y1="270" x2="600" y2="270" stroke="#0b67c2" strokeWidth="3" strokeDasharray="6 3" />
      <text x="440" y="288" fontSize="10" fontWeight="700" fill="#0b67c2">2DEG (sem impurezas → alta mobilidade)</text>

      {/* S/D ôhmicos */}
      <rect x="60" y="170" width="110" height="32" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="115" y="191" textAnchor="middle" fontSize="11" fontWeight="700">Source</text>
      <rect x="470" y="170" width="110" height="32" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="525" y="191" textAnchor="middle" fontSize="11" fontWeight="700">Drain</text>

      {/* gate Schottky */}
      <rect x="260" y="150" width="120" height="50" fill="#111827" />
      <text x="320" y="180" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fbbf24">GATE</text>

      <Terminal x={98} y={110} label="S" leadTo={{ x: 115, y: 170 }} />
      <Terminal x={303} y={100} label="G" leadTo={{ x: 320, y: 150 }} />
      <Terminal x={508} y={110} label="D" leadTo={{ x: 525, y: 170 }} />

      <path id="ch-modfet" d="M130 270 H520" fill="none" stroke="none" />
      <ParticleStream pathId="ch-modfet" count={8} dur={1.7} type="e" />

      {/* setas verticais de doadores caindo no canal (ilustração de transferência) */}
      {[150, 250, 350, 450].map((x, i) => (
        <path key={i} d={`M${x} 248 V268`} stroke="#6d28d9" strokeWidth="1.5" strokeDasharray="2 3" markerEnd="url(#arrHeadV)" />
      ))}
    </svg>
  );
}

/* ---------- OFET ---------- */
function Ofet() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      {/* substrato flexível */}
      <rect x="40" y="290" width="560" height="50" rx="6" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
      <text x="320" y="320" textAnchor="middle" fontSize="12" fontWeight="700" fill="#374151">Substrato flexível (plástico/vidro)</text>

      {/* gate bottom */}
      <rect x="200" y="250" width="240" height="40" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="320" y="274" textAnchor="middle" fontSize="12" fontWeight="700">GATE (bottom)</text>

      {/* dielétrico */}
      <rect x="150" y="220" width="340" height="30" fill="#fde68a" stroke="#92400e" strokeWidth="1.5" />
      <text x="320" y="240" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e">Dielétrico (polímero)</text>

      {/* semicondutor orgânico */}
      <rect x="90" y="190" width="460" height="30" rx="4" fill="url(#organicGrad)" stroke="#b45309" strokeWidth="2" />
      <text x="320" y="210" textAnchor="middle" fontSize="12" fontWeight="700" fill="#78350f">Semicondutor orgânico (π-conjugado)</text>

      {/* source/drain (top contacts) */}
      <rect x="90" y="160" width="120" height="30" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="150" y="180" textAnchor="middle" fontSize="11" fontWeight="700">Source</text>
      <rect x="430" y="160" width="120" height="30" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="490" y="180" textAnchor="middle" fontSize="11" fontWeight="700">Drain</text>

      <Terminal x={133} y={120} label="S" leadTo={{ x: 150, y: 160 }} />
      <Terminal x={303} y={300} label="G" leadTo={{ x: 320, y: 290 }} />
      <Terminal x={473} y={120} label="D" leadTo={{ x: 490, y: 160 }} />

      {/* fluxo de lacunas (p-type comum em OFET) */}
      <path id="ch-ofet" d="M160 205 H480" fill="none" stroke="none" />
      <ParticleStream pathId="ch-ofet" count={6} dur={3.2} type="h" />
      <text x="320" y="154" textAnchor="middle" fontSize="10" fill="#c2410c" fontWeight="700">fluxo de lacunas (típico p-OFET)</text>

      <path d="M160 154 H480" stroke="#c2410c" strokeWidth="2.5" markerEnd="url(#arrHeadO)" fill="none" opacity="0.7" />
    </svg>
  );
}

/* ---------- TFET ---------- */
function Tfet() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      <rect x="40" y="220" width="560" height="120" rx="8" fill="#f5f3ff" stroke="#6d28d9" strokeWidth="2" />
      <text x="320" y="300" textAnchor="middle" fontSize="12" fontWeight="700" fill="#5b21b6">Canal intrínseco (i)</text>

      {/* source P+ */}
      <rect x="40" y="220" width="180" height="120" rx="8" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="130" y="284" textAnchor="middle" fontSize="13" fontWeight="700" fill="#7c2d12">Source P+</text>

      {/* drain N+ */}
      <rect x="420" y="220" width="180" height="120" rx="8" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" />
      <text x="510" y="284" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">Drain N+</text>

      {/* óxido */}
      <rect x="205" y="200" width="230" height="14" fill="#fde68a" stroke="#92400e" strokeWidth="1.5" />
      <text x="320" y="211" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400e">high-κ</text>

      {/* gate */}
      <rect x="220" y="150" width="200" height="48" rx="6" fill="url(#gateGrad)" stroke="#6d28d9" strokeWidth="2" />
      <text x="320" y="178" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">GATE</text>

      <Terminal x={113} y={170} label="S" leadTo={{ x: 130, y: 220 }} />
      <Terminal x={303} y={100} label="G" leadTo={{ x: 320, y: 150 }} />
      <Terminal x={493} y={170} label="D" leadTo={{ x: 510, y: 220 }} />

      {/* tunelamento banda-banda na junção Source-canal */}
      <rect x="210" y="228" width="14" height="40" fill="#fbbf24" opacity="0.6">
        <animate attributeName="opacity" values="0.2;0.9;0.2" dur="1.4s" repeatCount="indefinite" />
      </rect>
      <text x="170" y="210" fontSize="10" fontWeight="700" fill="#92400e">BTBT (tunelamento)</text>

      {/* elétrons emergem após o tunelamento e vão até o drain */}
      <path id="ch-tfet" d="M224 240 H420" fill="none" stroke="none" />
      <ParticleStream pathId="ch-tfet" count={5} dur={2.4} type="e" />

      {/* lacunas retornam no source */}
      <path id="ch-tfet-h" d="M224 270 H80" fill="none" stroke="none" />
      <ParticleStream pathId="ch-tfet-h" count={3} dur={3.5} type="h" />

      {/* corrente proporcional menor (TFET = baixa I_on mas SS < 60 mV/dec) */}
      <path d="M420 300 H220" stroke="#c2410c" strokeWidth="2" markerEnd="url(#arrHeadO)" fill="none" />
      <text x="320" y="318" textAnchor="middle" fontSize="10" fill="#c2410c" fontWeight="700">I_D (pequena, subthreshold abrupta)</text>
    </svg>
  );
}

/* ---------- TFT / Thin-Film FET ---------- */
function Tft() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      {/* substrato vidro */}
      <rect x="40" y="290" width="560" height="50" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
      <text x="320" y="320" textAnchor="middle" fontSize="12" fontWeight="700" fill="#475569">Substrato de vidro / plástico</text>

      {/* gate bottom */}
      <rect x="200" y="250" width="240" height="40" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="320" y="274" textAnchor="middle" fontSize="12" fontWeight="700">GATE (metal)</text>

      {/* dielétrico */}
      <rect x="150" y="220" width="340" height="30" fill="#fde68a" stroke="#92400e" strokeWidth="1.5" />
      <text x="320" y="240" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e">SiO₂ / SiNx</text>

      {/* camada semicondutora fina (a-Si, IGZO, poli-Si) */}
      <rect x="90" y="190" width="460" height="30" fill="#bfdbfe" stroke="#1e40af" strokeWidth="2" />
      <text x="320" y="210" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e3a8a">Filme fino semicondutor (a-Si / IGZO)</text>

      {/* source/drain */}
      <rect x="90" y="160" width="120" height="30" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="150" y="180" textAnchor="middle" fontSize="11" fontWeight="700">Source</text>
      <rect x="430" y="160" width="120" height="30" fill="url(#metalGrad)" stroke="#111827" strokeWidth="1.5" />
      <text x="490" y="180" textAnchor="middle" fontSize="11" fontWeight="700">Drain</text>

      <Terminal x={133} y={120} label="S" leadTo={{ x: 150, y: 160 }} />
      <Terminal x={303} y={300} label="G" leadTo={{ x: 320, y: 290 }} />
      <Terminal x={473} y={120} label="D" leadTo={{ x: 490, y: 160 }} />

      <path id="ch-tft" d="M160 205 H480" fill="none" stroke="none" />
      <ParticleStream pathId="ch-tft" count={6} dur={2.8} type="e" />

      <path d="M480 154 H160" stroke="#c2410c" strokeWidth="2.5" markerEnd="url(#arrHeadO)" fill="none" />
      <text x="320" y="150" textAnchor="middle" fontSize="10" fill="#c2410c" fontWeight="700">I_D (modesta — aplicações em displays)</text>
    </svg>
  );
}

/* ---------- Transistor Vertical de Alta Potência (GaAs/GaN) ---------- */
function VerticalPower() {
  return (
    <svg viewBox="0 0 640 360" className="fet-svg">
      <ArrowDefs />
      <rect width="640" height="360" fill="#f7fafc" />

      {/* N+ substrato (drain) */}
      <rect x="40" y="300" width="560" height="40" rx="6" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="2" />
      <text x="320" y="325" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">N+ substrato (dreno)</text>

      {/* N- drift */}
      <rect x="40" y="180" width="560" height="120" fill="#dbeafe" stroke="#1e40af" strokeWidth="2" />
      <text x="320" y="246" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e40af">N⁻ drift (suporta V_DS alto)</text>

      {/* P body regions + N+ source */}
      <rect x="40" y="140" width="220" height="40" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="150" y="164" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7c2d12">P-body</text>
      <rect x="380" y="140" width="220" height="40" fill="url(#pGrad)" stroke="#c2410c" strokeWidth="2" />
      <text x="490" y="164" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7c2d12">P-body</text>

      <rect x="60" y="115" width="120" height="25" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="1.5" />
      <text x="120" y="132" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">N+ source</text>
      <rect x="460" y="115" width="120" height="25" fill="url(#nGrad)" stroke="#1e40af" strokeWidth="1.5" />
      <text x="520" y="132" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">N+ source</text>

      {/* trench gate central */}
      <rect x="280" y="140" width="80" height="70" fill="url(#gateGrad)" stroke="#6d28d9" strokeWidth="2" />
      <rect x="272" y="132" width="96" height="10" fill="#fde68a" stroke="#92400e" strokeWidth="1" />
      <text x="320" y="180" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">GATE trench</text>

      <Terminal x={103} y={70} label="S" leadTo={{ x: 120, y: 115 }} />
      <Terminal x={303} y={80} label="G" leadTo={{ x: 320, y: 140 }} />
      <Terminal x={503} y={70} label="S" leadTo={{ x: 520, y: 115 }} />
      <Terminal x={303} y={345} label="D" leadTo={{ x: 320, y: 340 }} />

      {/* fluxo vertical de elétrons */}
      <path id="ch-vp-l" d="M120 140 V160 C150 175 240 195 320 220 V300" fill="none" stroke="none" />
      <path id="ch-vp-r" d="M520 140 V160 C490 175 400 195 320 220 V300" fill="none" stroke="none" />
      <ParticleStream pathId="ch-vp-l" count={5} dur={2.6} type="e" />
      <ParticleStream pathId="ch-vp-r" count={5} dur={2.6} type="e" />

      {/* corrente grossa vertical (alta potência) */}
      <path d="M320 320 V80" stroke="#c2410c" strokeWidth="5" markerEnd="url(#arrHeadO)" fill="none" opacity="0.25" />
      <text x="360" y="220" fontSize="11" fill="#c2410c" fontWeight="700">I_D vertical alta</text>
    </svg>
  );
}

/* =============================================================
 * Catálogo de FETs
 * ============================================================= */

/* =============================================================
 * Metadados estáticos por FET (cor, função de render).
 * O conteúdo textual (name, tag, summary, operation, layers, etc.)
 * vem das traduções via t('fetTypes.catalog.<id>.*').
 * ============================================================= */
const FET_META = [
  { id: 'mosfet', color: '#3b82f6', render: MosfetPlanar },
  { id: 'finfet', color: '#22c55e', render: FinFet },
  { id: 'gaafet', color: '#8b5cf6', render: GaaFet },
  { id: 'hemt',   color: '#06b6d4', render: Hemt },
  { id: 'igbt',   color: '#ef4444', render: Igbt },
  { id: 'jfet',   color: '#f59e0b', render: Jfet },
  { id: 'mesfet', color: '#a855f7', render: Mesfet },
  { id: 'modfet', color: '#0ea5e9', render: Modfet },
  { id: 'ofet',   color: '#fb923c', render: Ofet },
  { id: 'tfet',   color: '#ec4899', render: Tfet },
  { id: 'tft',    color: '#14b8a6', render: Tft },
  { id: 'vpower', color: '#dc2626', render: VerticalPower }
];


/* =============================================================
 * Painel principal
 * ============================================================= */

export default function FetTypesPanel() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(FET_META[0].id);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    log_event('START', 'Painel de Tipos de FET iniciado');
    return () => log_event('END', 'Painel de Tipos de FET encerrado');
  }, []);

  useEffect(() => {
    log_event('INFO', 'FET selecionado', { id: selectedId });
  }, [selectedId]);

  const selectedMeta = FET_META.find((f) => f.id === selectedId) || FET_META[0];
  const RenderFn = selectedMeta.render;

  // Helpers para obter campos traduzidos do FET por id, com fallback ao próprio key.
  const fet = (id, field) => {
    const v = t(`fetTypes.catalog.${id}.${field}`);
    return v === `fetTypes.catalog.${id}.${field}` ? '' : v;
  };
  const layers = (id) => {
    const v = t(`fetTypes.catalog.${id}.layers`);
    return Array.isArray(v) ? v : [];
  };

  const selectedLayers = layers(selectedId);

  return (
    <div className="transistor-tech-panel fet-types-panel">
      <div className="panel-header">
        <h2>{t('fetTypes.ui.title')}</h2>
        <p className="intro-text">{t('fetTypes.ui.intro')}</p>
      </div>

      <div className="panel-controls">
        <button
          className={`control-btn ${animating ? 'active' : ''}`}
          onClick={() => setAnimating((v) => !v)}
        >
          {animating ? t('fetTypes.ui.pause') : t('fetTypes.ui.resume')}
        </button>
      </div>

      <div className="fet-cards">
        {FET_META.map((meta) => (
          <button
            key={meta.id}
            className={`fet-card ${selectedId === meta.id ? 'selected' : ''}`}
            onClick={() => setSelectedId(meta.id)}
            style={{
              borderColor: selectedId === meta.id ? meta.color : 'var(--bg-3)',
              boxShadow: selectedId === meta.id ? `0 0 0 2px ${meta.color}55` : 'none'
            }}
          >
            <span className="fet-card-name" style={{ color: meta.color }}>{fet(meta.id, 'name')}</span>
            <span className="fet-card-tag">{fet(meta.id, 'tag')}</span>
            <span className="fet-card-summary">{fet(meta.id, 'summary')}</span>
          </button>
        ))}
      </div>

      <div className="fet-detail" key={selectedId}>
        <div className="fet-detail-header">
          <h3 style={{ color: selectedMeta.color }}>{fet(selectedId, 'name')}</h3>
          <span className="fet-tag">{fet(selectedId, 'tag')}</span>
        </div>

        <div className={`fet-svg-wrap ${animating ? '' : 'paused'}`}>
          <RenderFn />
          <div className="fet-legend">
            <span><span className="dot e" /> {t('fetTypes.ui.legend.electron')}</span>
            <span><span className="dot h" /> {t('fetTypes.ui.legend.hole')}</span>
            <span><span className="bar" /> {t('fetTypes.ui.legend.current')}</span>
          </div>
        </div>

        <div className="fet-explain">
          <section>
            <h4>{t('fetTypes.ui.sections.operation')}</h4>
            <p>{fet(selectedId, 'operation')}</p>
          </section>
          <section>
            <h4>{t('fetTypes.ui.sections.advantages')}</h4>
            <p>{fet(selectedId, 'advantages')}</p>
          </section>
          <section>
            <h4>{t('fetTypes.ui.sections.applications')}</h4>
            <p>{fet(selectedId, 'applications')}</p>
          </section>
          {fet(selectedId, 'why') && (
            <section>
              <h4>{t('fetTypes.ui.sections.why')}</h4>
              <p>{fet(selectedId, 'why')}</p>
            </section>
          )}
        </div>

        {selectedLayers.length > 0 && (
          <div className="fet-layers">
            <h4>{t('fetTypes.ui.layersTitle')}</h4>
            <p className="fet-layers-intro">{t('fetTypes.ui.layersIntro')}</p>
            <div className="fet-layers-table" role="table">
              <div className="fet-layers-row fet-layers-head" role="row">
                <span role="columnheader">{t('fetTypes.ui.layersTable.layer')}</span>
                <span role="columnheader">{t('fetTypes.ui.layersTable.material')}</span>
                <span role="columnheader">{t('fetTypes.ui.layersTable.doping')}</span>
                <span role="columnheader">{t('fetTypes.ui.layersTable.role')}</span>
                <span role="columnheader">{t('fetTypes.ui.layersTable.impact')}</span>
              </div>
              {selectedLayers.map((layer, idx) => (
                <div className="fet-layers-row" role="row" key={idx}>
                  <span role="cell"><strong>{layer.name}</strong></span>
                  <span role="cell">{layer.material}</span>
                  <span role="cell">{layer.doping}</span>
                  <span role="cell">{layer.role}</span>
                  <span role="cell">{layer.impact}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="info-section">
        <h3>{t('fetTypes.ui.quickRef')}</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>{t('fetTypes.ui.info.whatIs.title')}</h4>
            <p>{t('fetTypes.ui.info.whatIs.body')}</p>
          </div>
          <div className="info-card">
            <h4>{t('fetTypes.ui.info.isolation.title')}</h4>
            <p>{t('fetTypes.ui.info.isolation.body')}</p>
          </div>
          <div className="info-card">
            <h4>{t('fetTypes.ui.info.trends.title')}</h4>
            <p>{t('fetTypes.ui.info.trends.body')}</p>
          </div>
          <div className="info-card">
            <h4>{t('fetTypes.ui.info.reading.title')}</h4>
            <p>{t('fetTypes.ui.info.reading.body')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
