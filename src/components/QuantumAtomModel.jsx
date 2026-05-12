import { useTranslation } from '../contexts/LanguageContext.jsx';
import './QuantumAtomModel.css';

export default function QuantumAtomModel() {
  const { t } = useTranslation();

  return (
    <div className="quantum-atom-container">
      <div className="quantum-atom-header">
        <h2>{t('quantumAtom.title')}</h2>
        <p className="subtitle">{t('quantumAtom.subtitle')}</p>
      </div>

      <div className="quantum-atom-content">
        <div className="svg-container">
          <svg className="quantum-atom-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 950" width="1400" height="950">
            <defs>
              <radialGradient id="electronCloud" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4a90d9" stopOpacity="0.85"/>
                <stop offset="35%" stopColor="#4a90d9" stopOpacity="0.45"/>
                <stop offset="70%" stopColor="#4a90d9" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#4a90d9" stopOpacity="0"/>
              </radialGradient>

              <radialGradient id="orbitalS" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7ed321" stopOpacity="0.85"/>
                <stop offset="55%" stopColor="#7ed321" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#7ed321" stopOpacity="0"/>
              </radialGradient>

              <radialGradient id="orbitalPx" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85"/>
                <stop offset="55%" stopColor="#c084fc" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0"/>
              </radialGradient>

              <radialGradient id="orbitalPy" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85"/>
                <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
              </radialGradient>

              <radialGradient id="orbitalPz" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f87171" stopOpacity="0.85"/>
                <stop offset="55%" stopColor="#f87171" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#f87171" stopOpacity="0"/>
              </radialGradient>

              <radialGradient id="orbitalD" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.85"/>
                <stop offset="55%" stopColor="#fbbf24" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
              </radialGradient>

              <radialGradient id="protonGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ff6b6b"/>
                <stop offset="100%" stopColor="#c92a2a"/>
              </radialGradient>

              <radialGradient id="neutronGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#adb5bd"/>
                <stop offset="100%" stopColor="#495057"/>
              </radialGradient>

              <linearGradient id="energyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee"/>
                <stop offset="100%" stopColor="#1e40af"/>
              </linearGradient>

              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <style>
                {`
                  @keyframes pulse {
                    0%, 100% { opacity: 0.6; r: 3; }
                    50% { opacity: 1; r: 4; }
                  }
                  @keyframes wave {
                    0%, 100% { transform: scale(1); opacity: 0.45; }
                    50% { transform: scale(1.08); opacity: 0.7; }
                  }
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  .electron { animation: pulse 2s ease-in-out infinite; }
                  .orbital-wave { animation: wave 3s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
                  .orbit-line { stroke-dasharray: 4 4; opacity: 0.25; }
                `}
              </style>
            </defs>

            {/* Fundo */}
            <rect width="1400" height="950" fill="#0f1020"/>
            <rect x="0" y="0" width="1400" height="950" fill="url(#bgPattern)" opacity="0.03"/>

            {/* Título */}
            <text x="700" y="42" textAnchor="middle" fill="#ffffff" fontSize="30" fontWeight="bold" fontFamily="Arial, sans-serif">
              MODELO ATÔMICO QUÂNTICO
            </text>
            <text x="700" y="68" textAnchor="middle" fill="#94a3b8" fontSize="15" fontFamily="Arial, sans-serif">
              Mecânica Quântica · Funções de Onda · Orbitais Atômicos
            </text>
            <line x1="500" y1="78" x2="900" y2="78" stroke="#4a90d9" strokeWidth="1" opacity="0.5"/>

            {/* ===== ÁTOMO PRINCIPAL (esquerda) ===== */}
            <g transform="translate(380, 360)">
              {/* Camadas de probabilidade */}
              <circle cx="0" cy="0" r="240" fill="none" stroke="#4a90d9" strokeWidth="1" className="orbit-line"/>
              <circle cx="0" cy="0" r="180" fill="none" stroke="#4a90d9" strokeWidth="1" className="orbit-line"/>
              <circle cx="0" cy="0" r="120" fill="none" stroke="#4a90d9" strokeWidth="1" className="orbit-line"/>

              {/* Nuvem eletrônica */}
              <circle cx="0" cy="0" r="240" fill="url(#electronCloud)" className="orbital-wave"/>

              {/* Elétrons como pontos de probabilidade */}
              <g fill="#00d4ff" filter="url(#glow)">
                <circle cx="-180" cy="-90" r="3" className="electron" style={{animationDelay: '0s'}}/>
                <circle cx="-130" cy="60" r="3" className="electron" style={{animationDelay: '0.3s'}}/>
                <circle cx="100" cy="-140" r="3" className="electron" style={{animationDelay: '0.6s'}}/>
                <circle cx="160" cy="80" r="3" className="electron" style={{animationDelay: '0.9s'}}/>
                <circle cx="-65" cy="-165" r="3" className="electron" style={{animationDelay: '1.2s'}}/>
                <circle cx="50" cy="155" r="3" className="electron" style={{animationDelay: '1.5s'}}/>
                <circle cx="-220" cy="30" r="2.5" className="electron" style={{animationDelay: '0.2s'}}/>
                <circle cx="210" cy="-50" r="2.5" className="electron" style={{animationDelay: '0.5s'}}/>
                <circle cx="-30" cy="-100" r="2.5" className="electron" style={{animationDelay: '0.8s'}}/>
                <circle cx="80" cy="125" r="2.5" className="electron" style={{animationDelay: '1.1s'}}/>
                <circle cx="-90" cy="180" r="2.5" className="electron" style={{animationDelay: '1.4s'}}/>
                <circle cx="190" cy="160" r="2.5" className="electron" style={{animationDelay: '0.4s'}}/>
                <circle cx="-200" cy="-150" r="2.5" className="electron" style={{animationDelay: '0.7s'}}/>
              </g>

              {/* Núcleo */}
              <g filter="url(#softGlow)">
                <circle cx="-12" cy="-8" r="15" fill="url(#protonGradient)" stroke="#8b0000" strokeWidth="1"/>
                <text x="-12" y="-4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">p+</text>
                <circle cx="12" cy="-8" r="15" fill="url(#protonGradient)" stroke="#8b0000" strokeWidth="1"/>
                <text x="12" y="-4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">p+</text>
                <circle cx="0" cy="10" r="15" fill="url(#protonGradient)" stroke="#8b0000" strokeWidth="1"/>
                <text x="0" y="14" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">p+</text>
                <circle cx="-9" cy="13" r="15" fill="url(#protonGradient)" stroke="#8b0000" strokeWidth="1"/>
                <text x="-9" y="17" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">p+</text>
                <circle cx="9" cy="13" r="15" fill="url(#protonGradient)" stroke="#8b0000" strokeWidth="1"/>
                <text x="9" y="17" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">p+</text>
                <circle cx="-21" cy="5" r="15" fill="url(#neutronGradient)" stroke="#343a40" strokeWidth="1"/>
                <text x="-21" y="9" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">n</text>
                <circle cx="21" cy="5" r="15" fill="url(#neutronGradient)" stroke="#343a40" strokeWidth="1"/>
                <text x="21" y="9" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">n</text>
                <circle cx="0" cy="-16" r="15" fill="url(#neutronGradient)" stroke="#343a40" strokeWidth="1"/>
                <text x="0" y="-12" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">n</text>
                <circle cx="-16" cy="-21" r="15" fill="url(#neutronGradient)" stroke="#343a40" strokeWidth="1"/>
                <text x="-16" y="-17" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">n</text>
                <circle cx="16" cy="-21" r="15" fill="url(#neutronGradient)" stroke="#343a40" strokeWidth="1"/>
                <text x="16" y="-17" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">n</text>
              </g>

              {/* Linha de chamada para o núcleo */}
              <line x1="35" y1="0" x2="120" y2="-50" stroke="#fbbf24" strokeWidth="1.5"/>
              <circle cx="120" cy="-50" r="3" fill="#fbbf24"/>
              <text x="128" y="-58" fill="#fbbf24" fontSize="13" fontWeight="bold">NÚCLEO</text>
              <text x="128" y="-44" fill="#fde68a" fontSize="10">prótons (p+) + nêutrons (n)</text>
              <text x="128" y="-30" fill="#94a3b8" fontSize="10">~ 99,9% da massa atômica</text>
              <text x="128" y="-16" fill="#94a3b8" fontSize="10">diâmetro ~ 10⁻¹⁵ m</text>

              {/* Linha de chamada para nuvem */}
              <line x1="-200" y1="-130" x2="-280" y2="-200" stroke="#4a90d9" strokeWidth="1.5"/>
              <circle cx="-280" cy="-200" r="3" fill="#4a90d9"/>
              <text x="-360" y="-208" fill="#4a90d9" fontSize="13" fontWeight="bold">NUVEM ELETRÔNICA</text>
              <text x="-360" y="-194" fill="#94a3b8" fontSize="10">|ψ(r)|² → densidade</text>
              <text x="-360" y="-180" fill="#94a3b8" fontSize="10">de probabilidade</text>

              {/* Linha de chamada para elétron */}
              <line x1="160" y1="80" x2="240" y2="180" stroke="#00d4ff" strokeWidth="1.5"/>
              <circle cx="240" cy="180" r="3" fill="#00d4ff"/>
              <text x="248" y="184" fill="#00d4ff" fontSize="13" fontWeight="bold">ELÉTRON (e⁻)</text>
              <text x="248" y="198" fill="#94a3b8" fontSize="10">posição = probabilidade</text>
              <text x="248" y="212" fill="#94a3b8" fontSize="10">massa ~ 1/1836 do próton</text>
            </g>

            {/* Aviso "não há órbitas" */}
            <g transform="translate(650, 660)">
              <rect x="0" y="0" width="400" height="40" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" rx="20"/>
              <circle cx="22" cy="20" r="11" fill="none" stroke="#fca5a5" strokeWidth="2"/>
              <line x1="14" y1="12" x2="30" y2="28" stroke="#fca5a5" strokeWidth="2"/>
              <text x="42" y="25" fill="#fecaca" fontSize="12" fontWeight="bold">Não há órbitas fixas como no modelo de Bohr</text>
            </g>

            {/* ===== GALERIA DE ORBITAIS (direita) ===== */}
            <text x="1080" y="120" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">GALERIA DE ORBITAIS</text>
            <text x="1080" y="138" textAnchor="middle" fill="#94a3b8" fontSize="11">Formas determinadas pelo número quântico ℓ</text>

            {/* Orbital s */}
            <g transform="translate(900, 220)">
              <circle cx="0" cy="0" r="48" fill="url(#orbitalS)" className="orbital-wave"/>
              <circle cx="0" cy="0" r="30" fill="url(#orbitalS)" opacity="0.55"/>
              <circle cx="0" cy="0" r="12" fill="url(#orbitalS)" opacity="0.85"/>
              {/* eixos */}
              <line x1="-55" y1="0" x2="55" y2="0" stroke="#475569" strokeWidth="0.8"/>
              <line x1="0" y1="-55" x2="0" y2="55" stroke="#475569" strokeWidth="0.8"/>
              <text x="0" y="78" textAnchor="middle" fill="#7ed321" fontSize="14" fontWeight="bold">s</text>
              <text x="0" y="94" textAnchor="middle" fill="#94a3b8" fontSize="9">esférico · ℓ=0</text>
              <text x="0" y="106" textAnchor="middle" fill="#64748b" fontSize="8">2 elétrons</text>
            </g>

            {/* Orbital pₓ (lobos no eixo x) */}
            <g transform="translate(1080, 220)">
              <ellipse cx="-28" cy="0" rx="32" ry="20" fill="url(#orbitalPx)" className="orbital-wave"/>
              <ellipse cx="28" cy="0" rx="32" ry="20" fill="url(#orbitalPx)" className="orbital-wave"/>
              <line x1="-65" y1="0" x2="65" y2="0" stroke="#94a3b8" strokeWidth="1"/>
              <line x1="0" y1="-55" x2="0" y2="55" stroke="#475569" strokeWidth="0.8"/>
              <text x="60" y="-6" fill="#94a3b8" fontSize="9">x</text>
              <text x="-6" y="-58" fill="#64748b" fontSize="9">y</text>
              <text x="0" y="78" textAnchor="middle" fill="#c084fc" fontSize="14" fontWeight="bold">pₓ</text>
              <text x="0" y="94" textAnchor="middle" fill="#94a3b8" fontSize="9">halter no eixo x</text>
              <text x="0" y="106" textAnchor="middle" fill="#64748b" fontSize="8">ℓ=1, m=±1</text>
            </g>

            {/* Orbital py (lobos no eixo y) */}
            <g transform="translate(1260, 220)">
              <ellipse cx="0" cy="-28" rx="20" ry="32" fill="url(#orbitalPy)" className="orbital-wave"/>
              <ellipse cx="0" cy="28" rx="20" ry="32" fill="url(#orbitalPy)" className="orbital-wave"/>
              <line x1="-55" y1="0" x2="55" y2="0" stroke="#475569" strokeWidth="0.8"/>
              <line x1="0" y1="-65" x2="0" y2="65" stroke="#94a3b8" strokeWidth="1"/>
              <text x="50" y="-6" fill="#64748b" fontSize="9">x</text>
              <text x="6" y="-58" fill="#94a3b8" fontSize="9">y</text>
              <text x="0" y="92" textAnchor="middle" fill="#38bdf8" fontSize="14" fontWeight="bold">p_y</text>
              <text x="0" y="108" textAnchor="middle" fill="#94a3b8" fontSize="9">halter no eixo y</text>
              <text x="0" y="120" textAnchor="middle" fill="#64748b" fontSize="8">ℓ=1, m=0</text>
            </g>

            {/* Orbital pz (lobos diagonais simulando z) */}
            <g transform="translate(900, 410)">
              <ellipse cx="-22" cy="-22" rx="32" ry="20" transform="rotate(45 -22 -22)" fill="url(#orbitalPz)" className="orbital-wave"/>
              <ellipse cx="22" cy="22" rx="32" ry="20" transform="rotate(45 22 22)" fill="url(#orbitalPz)" className="orbital-wave"/>
              <line x1="-55" y1="0" x2="55" y2="0" stroke="#475569" strokeWidth="0.8"/>
              <line x1="0" y1="-55" x2="0" y2="55" stroke="#475569" strokeWidth="0.8"/>
              <line x1="-50" y1="50" x2="50" y2="-50" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2"/>
              <text x="52" y="-46" fill="#94a3b8" fontSize="9">z</text>
              <text x="0" y="78" textAnchor="middle" fill="#f87171" fontSize="14" fontWeight="bold">p_z</text>
              <text x="0" y="94" textAnchor="middle" fill="#94a3b8" fontSize="9">halter no eixo z</text>
              <text x="0" y="106" textAnchor="middle" fill="#64748b" fontSize="8">ℓ=1, m=±1</text>
            </g>

            {/* Orbital d_xy (4 lóbulos) */}
            <g transform="translate(1080, 410)">
              <ellipse cx="-22" cy="-22" rx="22" ry="12" transform="rotate(45 -22 -22)" fill="url(#orbitalD)" className="orbital-wave"/>
              <ellipse cx="22" cy="-22" rx="22" ry="12" transform="rotate(-45 22 -22)" fill="url(#orbitalD)" className="orbital-wave"/>
              <ellipse cx="-22" cy="22" rx="22" ry="12" transform="rotate(-45 -22 22)" fill="url(#orbitalD)" className="orbital-wave"/>
              <ellipse cx="22" cy="22" rx="22" ry="12" transform="rotate(45 22 22)" fill="url(#orbitalD)" className="orbital-wave"/>
              <line x1="-55" y1="0" x2="55" y2="0" stroke="#475569" strokeWidth="0.8"/>
              <line x1="0" y1="-55" x2="0" y2="55" stroke="#475569" strokeWidth="0.8"/>
              <text x="0" y="78" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">d_xy</text>
              <text x="0" y="94" textAnchor="middle" fill="#94a3b8" fontSize="9">4 lóbulos</text>
              <text x="0" y="106" textAnchor="middle" fill="#64748b" fontSize="8">ℓ=2 · 10 elétrons</text>
            </g>

            {/* Orbital d_z² (toroidal) */}
            <g transform="translate(1260, 410)">
              <ellipse cx="0" cy="-30" rx="14" ry="22" fill="url(#orbitalD)" className="orbital-wave"/>
              <ellipse cx="0" cy="30" rx="14" ry="22" fill="url(#orbitalD)" className="orbital-wave"/>
              <ellipse cx="0" cy="0" rx="40" ry="10" fill="url(#orbitalD)" opacity="0.7"/>
              <line x1="-55" y1="0" x2="55" y2="0" stroke="#475569" strokeWidth="0.8"/>
              <line x1="0" y1="-65" x2="0" y2="65" stroke="#475569" strokeWidth="0.8"/>
              <text x="0" y="92" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold">d_z²</text>
              <text x="0" y="108" textAnchor="middle" fill="#94a3b8" fontSize="9">toroidal + lóbulos</text>
              <text x="0" y="120" textAnchor="middle" fill="#64748b" fontSize="8">ℓ=2, m=0</text>
            </g>

            {/* ===== DIAGRAMA DE NÍVEIS DE ENERGIA ===== */}
            <g transform="translate(80, 740)">
              <rect x="0" y="0" width="380" height="200" fill="#1e293b" stroke="#334155" strokeWidth="1" rx="8"/>
              <text x="190" y="22" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">NÍVEIS DE ENERGIA QUANTIZADOS</text>

              {/* Eixo */}
              <line x1="40" y1="180" x2="40" y2="40" stroke="#94a3b8" strokeWidth="1.5"/>
              <polygon points="40,32 36,42 44,42" fill="#94a3b8"/>
              <text x="20" y="38" fill="#94a3b8" fontSize="10">E</text>

              {/* Níveis */}
              <line x1="50" y1="170" x2="120" y2="170" stroke="#22d3ee" strokeWidth="2"/>
              <text x="125" y="174" fill="#22d3ee" fontSize="10">n=1 (1s)</text>
              <text x="220" y="174" fill="#94a3b8" fontSize="9">2 e⁻</text>

              <line x1="50" y1="140" x2="120" y2="140" stroke="#22d3ee" strokeWidth="2"/>
              <line x1="135" y1="140" x2="200" y2="140" stroke="#22d3ee" strokeWidth="2"/>
              <text x="125" y="144" fill="#22d3ee" fontSize="10">2s</text>
              <text x="205" y="144" fill="#22d3ee" fontSize="10">2p</text>
              <text x="270" y="144" fill="#94a3b8" fontSize="9">8 e⁻ (n=2)</text>

              <line x1="50" y1="105" x2="100" y2="105" stroke="#22d3ee" strokeWidth="2"/>
              <line x1="115" y1="105" x2="175" y2="105" stroke="#22d3ee" strokeWidth="2"/>
              <line x1="190" y1="105" x2="250" y2="105" stroke="#22d3ee" strokeWidth="2"/>
              <text x="105" y="109" fill="#22d3ee" fontSize="10">3s</text>
              <text x="180" y="109" fill="#22d3ee" fontSize="10">3p</text>
              <text x="255" y="109" fill="#22d3ee" fontSize="10">3d</text>
              <text x="290" y="109" fill="#94a3b8" fontSize="9">18 e⁻ (n=3)</text>

              <line x1="50" y1="70" x2="100" y2="70" stroke="#22d3ee" strokeWidth="2" opacity="0.6"/>
              <line x1="115" y1="70" x2="175" y2="70" stroke="#22d3ee" strokeWidth="2" opacity="0.6"/>
              <line x1="190" y1="70" x2="250" y2="70" stroke="#22d3ee" strokeWidth="2" opacity="0.6"/>
              <line x1="265" y1="70" x2="325" y2="70" stroke="#22d3ee" strokeWidth="2" opacity="0.6"/>
              <text x="105" y="74" fill="#22d3ee" fontSize="10" opacity="0.6">4s</text>
              <text x="180" y="74" fill="#22d3ee" fontSize="10" opacity="0.6">4p</text>
              <text x="255" y="74" fill="#22d3ee" fontSize="10" opacity="0.6">4d</text>
              <text x="330" y="74" fill="#22d3ee" fontSize="10" opacity="0.6">4f</text>

              <text x="50" y="195" fill="#64748b" fontSize="9">níveis discretos · ΔE = hν · transições emitem fótons</text>
            </g>

            {/* ===== EQUAÇÃO DE SCHRÖDINGER ===== */}
            <g transform="translate(490, 740)">
              <rect x="0" y="0" width="430" height="200" fill="#1e293b" stroke="#334155" strokeWidth="1" rx="8"/>
              <text x="215" y="22" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">EQUAÇÃO DE SCHRÖDINGER</text>

              <text x="215" y="65" textAnchor="middle" fill="#22d3ee" fontSize="22" fontFamily="serif" fontStyle="italic">
                Ĥψ = Eψ
              </text>
              <text x="215" y="90" textAnchor="middle" fill="#94a3b8" fontSize="11">forma independente do tempo</text>

              <text x="215" y="118" textAnchor="middle" fill="#7ed321" fontSize="14" fontFamily="serif" fontStyle="italic">
                [-ℏ²/2m ∇² + V(r)] ψ(r) = E ψ(r)
              </text>

              <text x="20" y="148" fill="#fbbf24" fontSize="11" fontWeight="bold">Soluções:</text>
              <text x="20" y="164" fill="#cbd5e1" fontSize="10">ψ_n,ℓ,m(r,θ,φ) — funções de onda</text>
              <text x="20" y="178" fill="#cbd5e1" fontSize="10">|ψ|² → densidade de probabilidade</text>
              <text x="20" y="192" fill="#cbd5e1" fontSize="10">interpretação de Born (1926)</text>
            </g>

            {/* ===== NÚMEROS QUÂNTICOS ===== */}
            <g transform="translate(950, 740)">
              <rect x="0" y="0" width="370" height="200" fill="#1e293b" stroke="#334155" strokeWidth="1" rx="8"/>
              <text x="185" y="22" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">NÚMEROS QUÂNTICOS</text>

              <g transform="translate(20, 40)">
                <circle cx="8" cy="8" r="6" fill="#22d3ee"/>
                <text x="22" y="12" fill="#22d3ee" fontSize="11" fontWeight="bold">n</text>
                <text x="40" y="12" fill="#cbd5e1" fontSize="10">principal · 1, 2, 3, ... · energia &amp; tamanho</text>
              </g>
              <g transform="translate(20, 70)">
                <circle cx="8" cy="8" r="6" fill="#7ed321"/>
                <text x="22" y="12" fill="#7ed321" fontSize="11" fontWeight="bold">ℓ</text>
                <text x="40" y="12" fill="#cbd5e1" fontSize="10">azimutal · 0..n-1 · forma (s,p,d,f)</text>
              </g>
              <g transform="translate(20, 100)">
                <circle cx="8" cy="8" r="6" fill="#c084fc"/>
                <text x="22" y="12" fill="#c084fc" fontSize="11" fontWeight="bold">m_ℓ</text>
                <text x="50" y="12" fill="#cbd5e1" fontSize="10">magnético · -ℓ..+ℓ · orientação</text>
              </g>
              <g transform="translate(20, 130)">
                <circle cx="8" cy="8" r="6" fill="#f87171"/>
                <text x="22" y="12" fill="#f87171" fontSize="11" fontWeight="bold">m_s</text>
                <text x="50" y="12" fill="#cbd5e1" fontSize="10">spin · ±½ · momento angular intrínseco</text>
              </g>

              <line x1="20" y1="155" x2="350" y2="155" stroke="#334155" strokeWidth="1"/>
              <text x="20" y="172" fill="#fbbf24" fontSize="10" fontWeight="bold">Princípio de Pauli:</text>
              <text x="20" y="187" fill="#94a3b8" fontSize="10">2 elétrons jamais têm os 4 números iguais</text>
            </g>

            {/* ===== LEGENDA INFERIOR ===== */}
            <g transform="translate(80, 690)">
              <text x="0" y="0" fill="#94a3b8" fontSize="11" fontWeight="bold">LEGENDA</text>
              <circle cx="80" cy="-4" r="6" fill="url(#protonGradient)"/>
              <text x="92" y="0" fill="#cbd5e1" fontSize="10">Próton (+)</text>
              <circle cx="170" cy="-4" r="6" fill="url(#neutronGradient)"/>
              <text x="182" y="0" fill="#cbd5e1" fontSize="10">Nêutron (0)</text>
              <circle cx="260" cy="-4" r="4" fill="#00d4ff" filter="url(#glow)"/>
              <text x="270" y="0" fill="#cbd5e1" fontSize="10">Elétron (−)</text>
              <rect x="350" y="-9" width="14" height="10" fill="url(#electronCloud)"/>
              <text x="370" y="0" fill="#cbd5e1" fontSize="10">|ψ|² densidade</text>
            </g>
          </svg>
        </div>

        <div className="quantum-atom-text-columns">
          <div className="explanations-column">
            <h3>{t('quantumAtom.sections.nucleus.title')}</h3>
            <p>{t('quantumAtom.sections.nucleus.content')}</p>

            <h3>{t('quantumAtom.sections.electronCloud.title')}</h3>
            <p>{t('quantumAtom.sections.electronCloud.content')}</p>

            <h3>{t('quantumAtom.sections.orbitals.title')}</h3>
            <p>{t('quantumAtom.sections.orbitals.content')}</p>

            <h3>{t('quantumAtom.sections.waveFunction.title')}</h3>
            <p>{t('quantumAtom.sections.waveFunction.content')}</p>

            <h3>{t('quantumAtom.sections.uncertainty.title')}</h3>
            <p>{t('quantumAtom.sections.uncertainty.content')}</p>
          </div>

          <div className="models-column">
            <h3>{t('quantumAtom.comparison.title')}</h3>
            <div className="comparison-grid">
              <div className="comparison-item">
                <h4>{t('quantumAtom.comparison.rutherford.title')}</h4>
                <ul>
                  {t('quantumAtom.comparison.rutherford.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="comparison-item">
                <h4>{t('quantumAtom.comparison.bohr.title')}</h4>
                <ul>
                  {t('quantumAtom.comparison.bohr.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="comparison-item">
                <h4>{t('quantumAtom.comparison.quantum.title')}</h4>
                <ul>
                  {t('quantumAtom.comparison.quantum.items', { returnObjects: true }).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
