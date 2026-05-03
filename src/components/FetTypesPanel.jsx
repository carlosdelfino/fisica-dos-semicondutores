import { useEffect, useState } from 'react';
import { log_event } from '../physics/formulas.js';

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

const FET_CATALOG = [
  {
    id: 'mosfet',
    name: 'MOSFET Planar',
    tag: 'CMOS clássico',
    color: '#3b82f6',
    summary: 'Gate isolado por óxido sobre substrato P/N.',
    render: MosfetPlanar,
    operation:
      'Um canal condutor é induzido na superfície do semicondutor quando V_GS > V_TH. O óxido de gate isola eletricamente o terminal de controle, permitindo alta impedância de entrada. A corrente flui lateralmente entre source e drain através do canal.',
    advantages: 'Alta impedância de entrada, fabricação CMOS madura, baixo consumo estático.',
    applications: 'Base de todo o CMOS digital, memórias, amplificadores analógicos.'
  },
  {
    id: 'finfet',
    name: 'FinFET',
    tag: '3D, 22nm–5nm',
    color: '#22c55e',
    summary: 'Fin vertical de silício com gate envolvendo 3 lados.',
    render: FinFet,
    operation:
      'O canal é uma "barbatana" (fin) de silício vertical. O gate o envolve em três lados, multiplicando o controle eletrostático e reduzindo efeitos de canal curto (leakage, DIBL). A corrente soma-se sobre as três superfícies do fin.',
    advantages: 'Melhor controle do canal, menor leakage, mais corrente por área que o planar.',
    applications: 'Processadores de 22nm a 5nm (Intel, TSMC, Samsung).'
  },
  {
    id: 'gaafet',
    name: 'GAAFET (Nanosheet)',
    tag: '3nm e abaixo',
    color: '#8b5cf6',
    summary: 'Gate envolve totalmente nanosheets horizontais.',
    render: GaaFet,
    operation:
      'Várias nanosheets de silício empilhadas formam canais paralelos, e o gate as envolve em todos os lados (gate-all-around). O controle eletrostático é máximo: o gate "fecha" o canal por inteiro quando desligado.',
    advantages: 'Melhor controle do que FinFET, largura efetiva ajustável, ideal para ≤3nm.',
    applications: 'Samsung 3nm GAA, TSMC N2 e futuras gerações.'
  },
  {
    id: 'hemt',
    name: 'HEMT',
    tag: 'RF / alta velocidade',
    color: '#06b6d4',
    summary: 'Heteroestrutura AlGaAs/GaAs com 2DEG.',
    render: Hemt,
    operation:
      'A junção de materiais com bandas diferentes (AlGaAs/GaAs ou AlGaN/GaN) gera um gás de elétrons bidimensional (2DEG) na interface. Os elétrons ficam separados espacialmente dos doadores, reduzindo espalhamento por impurezas → altíssima mobilidade.',
    advantages: 'Mobilidade elevadíssima, ganho em microondas/mm-wave.',
    applications: 'Rádio 5G/6G, amplificadores de potência GaN, satélite, radar.'
  },
  {
    id: 'igbt',
    name: 'IGBT',
    tag: 'Alta potência',
    color: '#ef4444',
    summary: 'Híbrido MOSFET + BJT para correntes altas.',
    render: Igbt,
    operation:
      'A entrada é um gate MOS (alta impedância) que controla a injeção de elétrons em uma base de BJT vertical. Um segundo terminal P+ (coletor) injeta lacunas no drift, causando modulação da condutividade e I-V tipo bipolar com queda de tensão baixa.',
    advantages: 'Alta tensão de bloqueio e corrente, controle por tensão (MOS).',
    applications: 'Inversores industriais, tração veicular, energia solar/eólica.'
  },
  {
    id: 'jfet',
    name: 'JFET',
    tag: 'Junção PN como gate',
    color: '#f59e0b',
    summary: 'Depleção de PN estrangula o canal N.',
    render: Jfet,
    operation:
      'O gate é uma junção PN reversamente polarizada. A região de depleção se expande dentro do canal N conforme V_GS fica mais negativo, estrangulando a passagem de corrente. Não há óxido.',
    advantages: 'Ruído baixo, simplicidade, boa linearidade.',
    applications: 'Pré-amplificadores de áudio de baixo ruído, instrumentação.'
  },
  {
    id: 'mesfet',
    name: 'MESFET',
    tag: 'GaAs, microondas',
    color: '#a855f7',
    summary: 'Gate Schottky direto no canal N (sem óxido).',
    render: Mesfet,
    operation:
      'O gate é um contato Schottky metal–semicondutor feito diretamente sobre um canal GaAs dopado n. A barreira Schottky cria depleção que modula o canal. Usado onde GaAs não forma óxido estável.',
    advantages: 'Alta frequência em GaAs, processo simples sem óxido.',
    applications: 'Microondas, comunicação via satélite, amplificadores LNA.'
  },
  {
    id: 'modfet',
    name: 'MODFET',
    tag: 'Dopagem modulada',
    color: '#0ea5e9',
    summary: 'Variante do HEMT com ênfase na modulação de dopagem.',
    render: Modfet,
    operation:
      'Os átomos doadores ficam em uma camada (AlGaAs:n) afastada do canal (GaAs:i) por um espaçador não dopado. Os elétrons "caem" para o GaAs, formando o 2DEG, mas as impurezas ficam para trás — mobilidade extremamente alta.',
    advantages: 'Mobilidade superior, frequências de corte f_T muito elevadas.',
    applications: 'Front-end de RF, radioastronomia, receptores criogênicos.'
  },
  {
    id: 'ofet',
    name: 'OFET',
    tag: 'Eletrônica orgânica',
    color: '#fb923c',
    summary: 'Semicondutor orgânico π-conjugado.',
    render: Ofet,
    operation:
      'Canal formado por moléculas/polímeros conjugados (pentaceno, P3HT, etc.). A condução se dá tipicamente por hopping entre estados π. Fabricação por impressão em substratos flexíveis a baixa temperatura.',
    advantages: 'Baixo custo, flexível, área grande, biocompatível.',
    applications: 'Displays flexíveis, sensores biomédicos, RFID impresso.'
  },
  {
    id: 'tfet',
    name: 'TFET',
    tag: 'Tunelamento',
    color: '#ec4899',
    summary: 'Injeção por tunelamento banda-a-banda.',
    render: Tfet,
    operation:
      'Em vez de termionicamente injetar portadores sobre uma barreira, o TFET utiliza tunelamento banda-a-banda (BTBT) na junção source P+/canal. Isso permite inclinação subthreshold menor que 60 mV/dec (limite Boltzmann).',
    advantages: 'Operação em baixíssimas tensões (<0,5 V), baixíssimo consumo.',
    applications: 'Futuros CIs ultra-baixo consumo, IoT, sensores autônomos.'
  },
  {
    id: 'tft',
    name: 'TFT (Thin-Film)',
    tag: 'Displays',
    color: '#14b8a6',
    summary: 'Transistor em filme fino sobre vidro/plástico.',
    render: Tft,
    operation:
      'Uma camada fina de semicondutor (a-Si, LTPS ou IGZO) é depositada sobre um substrato isolante (vidro). Gate bottom-gate com dielétrico (SiNx/SiO₂). Baixa temperatura de processo permite áreas muito grandes.',
    advantages: 'Área grande, processo em vidro/plástico, baixo custo.',
    applications: 'Backplane de LCD/OLED, AMOLED, e-paper, raios-X digital.'
  },
  {
    id: 'vpower',
    name: 'Vertical GaAs/GaN Power',
    tag: 'Potência vertical',
    color: '#dc2626',
    summary: 'Corrente vertical através de drift N⁻ espesso.',
    render: VerticalPower,
    operation:
      'Estrutura vertical: source e gate no topo, drain no fundo. O drift N⁻ espesso suporta alta tensão bloqueada. Quando o gate inverte o canal no P-body, elétrons fluem verticalmente até o drain.',
    advantages: 'Suporta V_DS muito alto, densidade de corrente elevada.',
    applications: 'Conversão de energia em veículos elétricos, fontes industriais, GaN/SiC de potência.'
  }
];

/* =============================================================
 * Painel principal
 * ============================================================= */

export default function FetTypesPanel() {
  const [selectedId, setSelectedId] = useState(FET_CATALOG[0].id);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    log_event('START', 'Painel de Tipos de FET iniciado');
    return () => log_event('END', 'Painel de Tipos de FET encerrado');
  }, []);

  useEffect(() => {
    log_event('INFO', 'FET selecionado', { id: selectedId });
  }, [selectedId]);

  const selected = FET_CATALOG.find((f) => f.id === selectedId) || FET_CATALOG[0];
  const RenderFn = selected.render;

  return (
    <div className="transistor-tech-panel fet-types-panel">
      <div className="panel-header">
        <h2>🔬 Tipos de Transistores FET — Painel Didático</h2>
        <p className="intro-text">
          Explore os principais tipos de transistores de efeito de campo. Cada painel mostra a estrutura
          em corte com <strong>animação da mobilidade de elétrons e lacunas</strong> e setas proporcionais
          indicando o sentido da corrente.
        </p>
      </div>

      <div className="panel-controls">
        <button
          className={`control-btn ${animating ? 'active' : ''}`}
          onClick={() => setAnimating((v) => !v)}
        >
          {animating ? '⏸️ Pausar animações' : '▶️ Retomar animações'}
        </button>
      </div>

      <div className="fet-cards">
        {FET_CATALOG.map((fet) => (
          <button
            key={fet.id}
            className={`fet-card ${selectedId === fet.id ? 'selected' : ''}`}
            onClick={() => setSelectedId(fet.id)}
            style={{
              borderColor: selectedId === fet.id ? fet.color : 'var(--bg-3)',
              boxShadow: selectedId === fet.id ? `0 0 0 2px ${fet.color}55` : 'none'
            }}
          >
            <span className="fet-card-name" style={{ color: fet.color }}>{fet.name}</span>
            <span className="fet-card-tag">{fet.tag}</span>
            <span className="fet-card-summary">{fet.summary}</span>
          </button>
        ))}
      </div>

      <div className="fet-detail" key={selectedId}>
        <div className="fet-detail-header">
          <h3 style={{ color: selected.color }}>{selected.name}</h3>
          <span className="fet-tag">{selected.tag}</span>
        </div>

        <div className={`fet-svg-wrap ${animating ? '' : 'paused'}`}>
          <RenderFn />
          <div className="fet-legend">
            <span><span className="dot e" /> elétron</span>
            <span><span className="dot h" /> lacuna</span>
            <span><span className="bar" /> corrente convencional</span>
          </div>
        </div>

        <div className="fet-explain">
          <section>
            <h4>🔎 Funcionamento</h4>
            <p>{selected.operation}</p>
          </section>
          <section>
            <h4>✅ Vantagens</h4>
            <p>{selected.advantages}</p>
          </section>
          <section>
            <h4>🏭 Aplicações</h4>
            <p>{selected.applications}</p>
          </section>
        </div>
      </div>

      <div className="info-section">
        <h3>📚 Referência rápida</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>🎯 O que é um FET?</h4>
            <p>Dispositivo em que a corrente entre <em>source</em> e <em>drain</em> é modulada por um <strong>campo elétrico</strong> aplicado ao <em>gate</em>, sem corrente significativa pelo próprio gate (alta impedância de entrada).</p>
          </div>
          <div className="info-card">
            <h4>⚙️ Princípios de isolação do gate</h4>
            <p><strong>MOSFET/IGBT:</strong> óxido. <strong>JFET:</strong> junção PN. <strong>MESFET:</strong> barreira Schottky. <strong>HEMT/MODFET:</strong> heterojunção + Schottky.</p>
          </div>
          <div className="info-card">
            <h4>🚀 Tendências</h4>
            <p>Do planar → FinFET → GAAFET/Nanosheet para lógica; HEMT GaN e vertical SiC para potência; TFET para ultra baixa potência; OFET/TFT para displays e eletrônica flexível.</p>
          </div>
          <div className="info-card">
            <h4>📐 Leitura das figuras</h4>
            <p>As cores são simbólicas: azul = região N / elétrons, laranja = região P / lacunas, roxo = gate, amarelo = óxido. As setas têm espessura proporcional à corrente típica do dispositivo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
