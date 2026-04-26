import { useState } from 'react';
import { TeX } from './Math.jsx';

/**
 * Cartão didático comparando explicitamente as duas partículas portadoras
 * de carga em um semicondutor:
 *
 *   ELÉTRON:  carga -q,  m*_n > 0,  reside no FUNDO da banda de condução
 *   LACUNA:   carga +q,  m*_p > 0,  reside no TOPO da banda de valência
 *
 * Ambas têm massa efetiva POSITIVA — a lacuna é uma quasi-partícula obtida
 * "removendo" um elétron do topo da BV: sua resposta a um campo elétrico é
 * idêntica à de uma partícula de carga +q e massa m*_p.
 */
export default function ElectronHoleCard() {
  const [field, setField] = useState(1.0); // campo elétrico relativo

  // Direção do movimento: elétron contra E, lacuna a favor de E
  const dirElec = -1;
  const dirHole = +1;

  const W = 760, H = 460;

  return (
    <div className="diagram-card">
      <h3>Elétron × Lacuna — duas partículas carregadas no semicondutor</h3>

      <div className="effmass-controls">
        <div className="control-group" style={{ maxWidth: 320 }}>
          <label>Campo elétrico aplicado E_x: <b>{field.toFixed(2)}</b> (un. arb.)</label>
          <input type="range" min="-2" max="2" step="0.05"
                 value={field} onChange={(e) => setField(Number(e.target.value))} />
          <small style={{ color: '#94a3b8', fontSize: 11 }}>
            Setas amarelas mostram o campo. Observe os sentidos opostos de movimento.
          </small>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="eh-svg" role="img"
           aria-label="Comparação elétron versus lacuna">

        {/* === Painel esquerdo: ELÉTRON === */}
        <g transform="translate(20, 30)">
          <rect x="0" y="0" width="350" height="400" rx="10"
                fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
          <text x="175" y="24" fill="#0ea5e9" fontSize="16"
                fontWeight="700" textAnchor="middle">ELÉTRON</text>
          <text x="175" y="42" fill="#94a3b8" fontSize="11" textAnchor="middle">
            no fundo da banda de condução (BC)
          </text>

          {/* mini-banda */}
          <g transform="translate(40, 70)">
            <text x="0" y="-4" fill="#7dd3fc" fontSize="11">E</text>
            <line x1="0" y1="0" x2="0" y2="120" stroke="#475569" />
            <line x1="0" y1="120" x2="270" y2="120" stroke="#475569" />
            <text x="270" y="135" fill="#94a3b8" fontSize="10" textAnchor="end">k</text>
            {/* parábola côncava para cima (BC) */}
            <path d="M 0,30 Q 135,150 270,30" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
            {/* posição do elétron próximo ao mínimo */}
            <circle cx={135 + 28 * field * dirElec * 0.6}
                    cy={120 - 12} r="7" fill="#0ea5e9" stroke="#0c4a6e" strokeWidth="2">
              <title>Elétron no fundo da BC</title>
            </circle>
            <text x={135 + 28 * field * dirElec * 0.6} y={120 - 22}
                  fill="#7dd3fc" fontSize="10" textAnchor="middle">e⁻</text>
          </g>

          {/* setas de campo e força */}
          <g transform="translate(40, 220)">
            <text x="0" y="-6" fill="#cbd5e1" fontSize="11">Sob campo elétrico:</text>
            <line x1="0" y1="20" x2={130 * field} y2="20"
                  stroke="#facc15" strokeWidth="3" markerEnd="url(#arr-eh-y)" />
            <text x="135" y="24" fill="#facc15" fontSize="11">E_x</text>

            <line x1="0" y1="50" x2={-130 * field} y2="50"
                  stroke="#0ea5e9" strokeWidth="3" markerEnd="url(#arr-eh-c)" />
            <text x={-135} y="54" fill="#7dd3fc" fontSize="11" textAnchor="end">F = −qE</text>

            <line x1="0" y1="80" x2={-130 * field * 1.5} y2="80"
                  stroke="#22d3ee" strokeWidth="3" markerEnd="url(#arr-eh-c)" />
            <text x={-135} y="84" fill="#22d3ee" fontSize="11" textAnchor="end">v_d = −μ_n E</text>
          </g>

          {/* propriedades */}
          <g transform="translate(20, 320)">
            <text x="0" y="0" fill="#cbd5e1" fontSize="11">
              <tspan x="0" dy="0">• carga: </tspan>
              <tspan fill="#0ea5e9" fontWeight="600">−q = −1.602×10⁻¹⁹ C</tspan>
              <tspan x="0" dy="16">• massa efetiva: </tspan>
              <tspan fill="#0ea5e9" fontWeight="600">m*_n &gt; 0</tspan>
              <tspan x="0" dy="16">• localização: fundo da BC (curvatura ↑)</tspan>
              <tspan x="0" dy="16">• mobilidade Si: μ_n ≈ 1350 cm²/V·s</tspan>
              <tspan x="0" dy="16">• move-se contra o campo E</tspan>
            </text>
          </g>
        </g>

        {/* === Painel direito: LACUNA === */}
        <g transform="translate(390, 30)">
          <rect x="0" y="0" width="350" height="400" rx="10"
                fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
          <text x="175" y="24" fill="#ef4444" fontSize="16"
                fontWeight="700" textAnchor="middle">LACUNA</text>
          <text x="175" y="42" fill="#94a3b8" fontSize="11" textAnchor="middle">
            no topo da banda de valência (BV)
          </text>

          {/* mini-banda */}
          <g transform="translate(40, 70)">
            <text x="0" y="-4" fill="#fecaca" fontSize="11">E</text>
            <line x1="0" y1="0" x2="0" y2="120" stroke="#475569" />
            <line x1="0" y1="120" x2="270" y2="120" stroke="#475569" />
            <text x="270" y="135" fill="#94a3b8" fontSize="10" textAnchor="end">k</text>
            {/* parábola côncava para baixo (topo da BV) */}
            <path d="M 0,90 Q 135,-30 270,90" fill="none" stroke="#ef4444" strokeWidth="2.5" />
            {/* posição da lacuna próximo ao máximo (topo) */}
            <circle cx={135 + 28 * field * dirHole * 0.6}
                    cy={20} r="7" fill="none" stroke="#ef4444" strokeWidth="2.5"
                    strokeDasharray="3 2">
              <title>Lacuna no topo da BV (estado vazio)</title>
            </circle>
            <text x={135 + 28 * field * dirHole * 0.6} y={12}
                  fill="#fca5a5" fontSize="10" textAnchor="middle">h⁺</text>
          </g>

          {/* setas */}
          <g transform="translate(40, 220)">
            <text x="0" y="-6" fill="#cbd5e1" fontSize="11">Sob campo elétrico:</text>
            <line x1="0" y1="20" x2={130 * field} y2="20"
                  stroke="#facc15" strokeWidth="3" markerEnd="url(#arr-eh-y)" />
            <text x="135" y="24" fill="#facc15" fontSize="11">E_x</text>

            <line x1="0" y1="50" x2={130 * field} y2="50"
                  stroke="#ef4444" strokeWidth="3" markerEnd="url(#arr-eh-r)" />
            <text x="135" y="54" fill="#fca5a5" fontSize="11">F = +qE</text>

            <line x1="0" y1="80" x2={130 * field * 1.2} y2="80"
                  stroke="#f87171" strokeWidth="3" markerEnd="url(#arr-eh-r)" />
            <text x="135" y="84" fill="#f87171" fontSize="11">v_d = +μ_p E</text>
          </g>

          {/* propriedades */}
          <g transform="translate(20, 320)">
            <text x="0" y="0" fill="#cbd5e1" fontSize="11">
              <tspan x="0" dy="0">• carga: </tspan>
              <tspan fill="#ef4444" fontWeight="600">+q = +1.602×10⁻¹⁹ C</tspan>
              <tspan x="0" dy="16">• massa efetiva: </tspan>
              <tspan fill="#ef4444" fontWeight="600">m*_p &gt; 0</tspan>
              <tspan x="0" dy="16">• localização: topo da BV (curvatura ↓)</tspan>
              <tspan x="0" dy="16">• mobilidade Si: μ_p ≈ 480 cm²/V·s</tspan>
              <tspan x="0" dy="16">• move-se a favor do campo E</tspan>
            </text>
          </g>
        </g>

        <defs>
          <marker id="arr-eh-y" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#facc15" />
          </marker>
          <marker id="arr-eh-c" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#0ea5e9" />
          </marker>
          <marker id="arr-eh-r" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#ef4444" />
          </marker>
        </defs>
      </svg>

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 12,
                    borderRadius: 6, marginTop: 8, fontSize: 13, color: '#cbd5e1' }}>
        <p style={{ margin: '6px 0' }}>
          <b>Por que m*_p é positiva?</b>{' '}No topo da BV, d²E/dk² &lt; 0, então a definição
          <code> m*_p = −ℏ²/(d²E/dk²) </code>resulta positiva. A lacuna então obedece F = m*_p · a com
          carga +q, simplificando enormemente a descrição do transporte na BV.
        </p>
        <TeX block math={String.raw`\boxed{\;\;J = q(n\,\mu_n + p\,\mu_p)\,E_x\quad\text{(densidade de corrente total)}\;\;}`} />
      </div>

      <p className="diagram-caption">
        Embora a BV completa contenha cerca de 10²² elétrons por cm³, basta acompanhar a <b>posição</b>
        da única vacância: ela responde a campos como uma <i>partícula real</i> de carga +q. Esta é a
        ideia genial das <b>quasi-partículas</b> em física do estado sólido. A condutividade total
        recebe contribuições aditivas de elétrons na BC e lacunas na BV.
      </p>
    </div>
  );
}
