import { useState } from 'react';
import { fermiDirac } from '../physics/formulas.js';
import { k_B_eV } from '../physics/constants.js';

/**
 * Comparação qualitativa das estruturas de bandas de:
 *   - METAL (Cu): banda parcialmente preenchida; E_F dentro de uma banda permitida
 *   - SEMICONDUTOR (Si): gap pequeno (~1.12 eV), E_F no meio do gap
 *   - ISOLANTE (SiO₂): gap grande (~9 eV), E_F no meio do gap, BC inacessível
 *
 * O usuário ajusta a temperatura e observa quantos elétrons conseguem ocupar a BC.
 * A condutividade resultante (em escala log) é mostrada.
 */
export default function MetalInsulatorSemi() {
  const [T, setT] = useState(300);

  const materials = [
    {
      id: 'metal',
      name: 'Metal (Cu)',
      color: '#fbbf24',
      Eg: 0,             // sem gap real (banda 4s parcialmente cheia)
      Ec: 0,
      Ev: -2.5,
      EF: -1.2,          // dentro da banda permitida
      filledTo: -1.2,    // preenchimento até E_F
      sigma_300: 5.96e7, // S/m
      Eg_label: '— (sem gap)',
      desc: 'A banda 4s do Cu está parcialmente preenchida. E_F encontra-se dentro de uma banda permitida; logo há sempre estados vazios imediatamente acima de E_F para acomodar elétrons acelerados por um campo. Condutor por excelência.',
      type: 'metal',
    },
    {
      id: 'semi',
      name: 'Semicondutor (Si)',
      color: '#22d3ee',
      Eg: 1.12,
      Ec: 0.56,
      Ev: -0.56,
      EF: 0,
      filledTo: -0.56,
      sigma_300: 4.4e-4, // S/m intrínseco
      Eg_label: '1.12 eV',
      desc: 'BV completamente cheia, BC praticamente vazia a 0 K. Como E_g ≈ k_BT × 43 a 300 K, há excitação térmica suficiente para gerar n_i ≈ 10¹⁰ cm⁻³ de pares e⁻/h⁺. Dopagem altera σ em várias ordens de grandeza.',
      type: 'semi',
    },
    {
      id: 'ins',
      name: 'Isolante (SiO₂)',
      color: '#ef4444',
      Eg: 9.0,
      Ec: 4.5,
      Ev: -4.5,
      EF: 0,
      filledTo: -4.5,
      sigma_300: 1e-15,  // S/m
      Eg_label: '9.0 eV',
      desc: 'BV cheia e BC vazia, separadas por um gap grande (E_g ≈ 9 eV ≈ 350 k_BT a 300 K). A probabilidade de excitação térmica e^(−Eg/2kT) ≈ 10⁻⁷⁶ — desprezível. Praticamente não há portadores.',
      type: 'ins',
    },
  ];

  const W = 760, H = 520;
  const panelW = (W - 40) / 3;

  // Função para desenhar o painel de bandas para um material
  const drawPanel = (mat, x0) => {
    const M = { t: 60, b: 200 };
    const innerH = H - M.t - M.b;
    const Emin = -7, Emax = 7;
    const yScale = (E) => M.t + ((Emax - E) / (Emax - Emin)) * innerH;

    // probabilidade de ocupação na BC e desocupação na BV
    const Tk = T;
    const fEc = fermiDirac(mat.Ec, mat.EF, Tk);
    const fEv = 1 - fermiDirac(mat.Ev, mat.EF, Tk);
    // densidade simplificada: cargas (a ilustração é qualitativa)

    // se metal: a BC é a continuação direta, com EF dentro
    const isMetal = mat.type === 'metal';

    return (
      <g key={mat.id}>
        {/* fundo do painel */}
        <rect x={x0} y={20} width={panelW - 8} height={H - 40} rx={10}
              fill="#0f172a" stroke={mat.color} strokeWidth="1.5" />
        <text x={x0 + panelW / 2} y={42} fill={mat.color} fontSize="15"
              fontWeight="700" textAnchor="middle">{mat.name}</text>

        {/* banda permitida superior (BC) */}
        {isMetal ? (
          <>
            {/* banda contínua (sem gap), com EF dentro */}
            <rect x={x0 + 30} y={yScale(mat.Ec + 4)}
                  width={panelW - 80} height={yScale(mat.Ev) - yScale(mat.Ec + 4)}
                  fill="url(#metal-grad)" opacity="0.5" />
            {/* preenchimento até EF */}
            <rect x={x0 + 30} y={yScale(mat.EF)}
                  width={panelW - 80} height={yScale(mat.Ev) - yScale(mat.EF)}
                  fill="#fbbf24" opacity="0.45" />
            {/* elétrons dentro da banda */}
            {Array.from({ length: 18 }).map((_, i) => (
              <circle key={i}
                      cx={x0 + 36 + (i * 13) % (panelW - 90)}
                      cy={yScale(mat.EF) + 4 + ((i * 7) % (yScale(mat.Ev) - yScale(mat.EF) - 8))}
                      r="2.6" fill="#fde68a" />
            ))}
          </>
        ) : (
          <>
            {/* BV (cheia) */}
            <rect x={x0 + 30} y={yScale(mat.Ev)}
                  width={panelW - 80} height={yScale(mat.Ev - 1.5) - yScale(mat.Ev)}
                  fill="#ef4444" opacity="0.40" stroke="#ef4444" strokeWidth="1" />
            {/* elétrons na BV */}
            {Array.from({ length: 14 }).map((_, i) => (
              <circle key={i}
                      cx={x0 + 36 + (i * 14) % (panelW - 90)}
                      cy={yScale(mat.Ev) + 4 + ((i * 9) % (yScale(mat.Ev - 1.5) - yScale(mat.Ev) - 8))}
                      r="2.4" fill="#fca5a5" />
            ))}
            {/* lacunas térmicas (apenas no semicondutor) */}
            {mat.type === 'semi' && fEv > 1e-15 &&
              Array.from({ length: Math.min(4, Math.max(1, Math.round(fEv * 6))) }).map((_, i) => (
                <circle key={`h-${i}`}
                        cx={x0 + 50 + i * 50}
                        cy={yScale(mat.Ev) + 6}
                        r="3" fill="none" stroke="#fca5a5" strokeWidth="1.5"
                        strokeDasharray="2 2" />
              ))}

            {/* gap (banda proibida) */}
            <rect x={x0 + 30} y={yScale(mat.Ec)}
                  width={panelW - 80} height={yScale(mat.Ev) - yScale(mat.Ec)}
                  fill="url(#hatch-mis)" opacity="0.4" />

            {/* BC (vazia exceto excitações térmicas) */}
            <rect x={x0 + 30} y={yScale(mat.Ec + 1.5)}
                  width={panelW - 80} height={yScale(mat.Ec) - yScale(mat.Ec + 1.5)}
                  fill="#0ea5e9" opacity="0.20" stroke="#0ea5e9" strokeWidth="1" />
            {/* elétrons térmicos na BC (semicondutor) */}
            {mat.type === 'semi' && fEc > 1e-15 &&
              Array.from({ length: Math.min(4, Math.max(1, Math.round(fEc * 1e10 / 1e9))) }).map((_, i) => (
                <circle key={`e-${i}`}
                        cx={x0 + 50 + i * 50}
                        cy={yScale(mat.Ec) - 8}
                        r="3" fill="#0ea5e9" stroke="#0c4a6e" strokeWidth="1" />
              ))}
            {/* nenhum no isolante (até T altíssimas) */}
          </>
        )}

        {/* Linhas de E_c e E_v */}
        {!isMetal && (
          <>
            <line x1={x0 + 30} y1={yScale(mat.Ec)} x2={x0 + panelW - 50} y2={yScale(mat.Ec)}
                  stroke="#0ea5e9" strokeWidth="2" />
            <line x1={x0 + 30} y1={yScale(mat.Ev)} x2={x0 + panelW - 50} y2={yScale(mat.Ev)}
                  stroke="#ef4444" strokeWidth="2" />
            <text x={x0 + panelW - 46} y={yScale(mat.Ec) + 4}
                  fill="#0ea5e9" fontSize="10">E_c</text>
            <text x={x0 + panelW - 46} y={yScale(mat.Ev) + 4}
                  fill="#ef4444" fontSize="10">E_v</text>
          </>
        )}

        {/* Linha de E_F */}
        <line x1={x0 + 25} y1={yScale(mat.EF)} x2={x0 + panelW - 25} y2={yScale(mat.EF)}
              stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 4" />
        <text x={x0 + 28} y={yScale(mat.EF) - 4} fill="#fbbf24" fontSize="11" fontWeight="600">
          E_F
        </text>

        {/* Anotação Eg */}
        {!isMetal && (
          <g>
            <line x1={x0 + panelW - 30} y1={yScale(mat.Ec)}
                  x2={x0 + panelW - 30} y2={yScale(mat.Ev)}
                  stroke={mat.color} strokeWidth="1" markerStart="url(#arr-mis-up)"
                  markerEnd="url(#arr-mis-dn)" />
            <text x={x0 + panelW - 22} y={(yScale(mat.Ec) + yScale(mat.Ev)) / 2 + 3}
                  fill={mat.color} fontSize="10">Eg = {mat.Eg_label}</text>
          </g>
        )}

        {/* rótulos das bandas */}
        {!isMetal && (
          <>
            <text x={x0 + 32} y={yScale(mat.Ec) - 4} fill="#7dd3fc" fontSize="10">BC</text>
            <text x={x0 + 32} y={yScale(mat.Ev) + 14} fill="#fca5a5" fontSize="10">BV</text>
          </>
        )}
        {isMetal && (
          <text x={x0 + 32} y={yScale(mat.EF) - 24} fill="#fbbf24" fontSize="10">
            banda parcialmente preenchida
          </text>
        )}

        {/* condutividade */}
        <g transform={`translate(${x0 + 20}, ${H - 175})`}>
          <text x="0" y="0" fill="#cbd5e1" fontSize="11" fontWeight="600">
            σ a 300 K ≈
          </text>
          <text x="0" y="18" fill={mat.color} fontSize="13" fontWeight="700">
            {mat.sigma_300.toExponential(1)} S/m
          </text>
          <text x="0" y="36" fill="#94a3b8" fontSize="10">
            log₁₀ σ = {Math.log10(mat.sigma_300).toFixed(1)}
          </text>
        </g>

        {/* descrição */}
        <foreignObject x={x0 + 12} y={H - 130} width={panelW - 24} height={120}>
          <div xmlns="http://www.w3.org/1999/xhtml"
               style={{ color: '#cbd5e1', fontSize: '11px', lineHeight: '1.45' }}>
            {mat.desc}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="diagram-card">
      <h3>Metal × Semicondutor × Isolante — diferenças nas bandas de energia</h3>

      <div className="effmass-controls">
        <div className="control-group" style={{ maxWidth: 320 }}>
          <label>Temperatura T: <b>{T} K</b> ({(T - 273.15).toFixed(0)} °C)</label>
          <input type="range" min="10" max="1500" step="10"
                 value={T} onChange={(e) => setT(Number(e.target.value))} />
          <small style={{ color: '#94a3b8', fontSize: 11 }}>
            k_BT a {T} K ≈ <b>{(k_B_eV * T * 1000).toFixed(1)} meV</b>.
            Compare com Eg para entender por que ele importa.
          </small>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mis-svg" role="img"
           aria-label="Comparação metal versus semicondutor versus isolante">
        <defs>
          <pattern id="hatch-mis" patternUnits="userSpaceOnUse" width="6" height="6">
            <rect width="6" height="6" fill="#1e293b" />
            <path d="M0,6 l6,-6" stroke="#fbbf24" strokeWidth="0.6" />
          </pattern>
          <linearGradient id="metal-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.6" />
          </linearGradient>
          <marker id="arr-mis-up" viewBox="0 0 10 10" refX="5" refY="0"
                  markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,10 L5,0 L10,10 z" fill="currentColor" />
          </marker>
          <marker id="arr-mis-dn" viewBox="0 0 10 10" refX="5" refY="10"
                  markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L5,10 L10,0 z" fill="currentColor" />
          </marker>
        </defs>

        {materials.map((m, i) => drawPanel(m, 12 + i * panelW))}
      </svg>

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 12, borderRadius: 6,
                    marginTop: 12, fontSize: 13, color: '#cbd5e1' }}>
        <p style={{ margin: '4px 0' }}>
          <b>Critério qualitativo</b> baseado nas bandas:
        </p>
        <ul style={{ margin: '6px 0 6px 20px', padding: 0 }}>
          <li><b style={{ color: '#fbbf24' }}>Metal</b>: E_F está dentro de uma banda permitida (ou bandas se sobrepõem)
              ⇒ existem estados vazios imediatamente acima de E_F ⇒ condução em qualquer T &gt; 0.</li>
          <li><b style={{ color: '#22d3ee' }}>Semicondutor</b>: E_g pequeno (~0.5 a 3 eV), E_F no meio do gap
              ⇒ excitação térmica gera portadores; σ aumenta com T (sentido oposto ao metal).</li>
          <li><b style={{ color: '#ef4444' }}>Isolante</b>: E_g grande (&gt; ~5 eV) ⇒ excitação térmica desprezível
              ⇒ σ permanece minúscula até T muito alta ou ruptura dielétrica.</li>
        </ul>
        <p style={{ margin: '8px 0 4px 0' }}>
          A diferença entre semicondutor e isolante é <b>quantitativa</b>, não qualitativa: ambos têm a mesma
          estrutura de banda (BV cheia + BC vazia), porém com gaps em escalas diferentes.
        </p>
      </div>
    </div>
  );
}
