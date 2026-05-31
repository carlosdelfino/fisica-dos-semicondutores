import { useMemo, useRef, useState } from 'react';
import { log_event } from '../physics/formulas.js';

/**
 * DiamondLatticeUnitCell
 * Célula unitária da estrutura cúbica diamante (Si, Ge, C) renderizada em SVG puro,
 * com projeção isométrica e rotação interativa em torno dos eixos Y (azimute) e X (elevação).
 *
 * Composição da estrutura diamante = 2 sub-redes FCC deslocadas de (1/4,1/4,1/4):
 *  - 8 átomos nos vértices
 *  - 6 átomos centrados nas faces
 *  - 4 átomos internos em posições tetraédricas
 *  Total efetivo: 8 átomos por célula unitária.
 */
export default function DiamondLatticeUnitCell() {
  const [azimuth, setAzimuth] = useState(30);
  const [elevation, setElevation] = useState(20);
  const [roll, setRoll] = useState(0);
  const [showBonds, setShowBonds] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const dragRef = useRef(null);

  // Posições fracionárias (x,y,z) em unidades do parâmetro de rede a
  const atoms = useMemo(() => {
    const corners = [];
    for (let x = 0; x <= 1; x++)
      for (let y = 0; y <= 1; y++)
        for (let z = 0; z <= 1; z++) corners.push({ p: [x, y, z], type: 'corner' });

    const faces = [
      [0.5, 0.5, 0], [0.5, 0.5, 1],
      [0.5, 0, 0.5], [0.5, 1, 0.5],
      [0, 0.5, 0.5], [1, 0.5, 0.5],
    ].map((p) => ({ p, type: 'face' }));

    const interior = [
      [0.25, 0.25, 0.25],
      [0.75, 0.75, 0.25],
      [0.75, 0.25, 0.75],
      [0.25, 0.75, 0.75],
    ].map((p) => ({ p, type: 'interior' }));

    return [...corners, ...faces, ...interior];
  }, []);

  // Ligações tetraédricas: cada átomo interno liga-se aos 4 vizinhos mais próximos da sub-rede FCC
  const bonds = useMemo(() => {
    const fcc = [
      [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1],
      [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1],
      [0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5],
      [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5],
    ];
    const interior = [
      [0.25, 0.25, 0.25],
      [0.75, 0.75, 0.25],
      [0.75, 0.25, 0.75],
      [0.25, 0.75, 0.75],
    ];
    const dist = (a, b) =>
      Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    const ideal = Math.sqrt(3) / 4; // ~0.4330 a
    const list = [];
    interior.forEach((ic) => {
      fcc.forEach((fc) => {
        if (Math.abs(dist(ic, fc) - ideal) < 1e-3) list.push([ic, fc]);
      });
    });
    return list;
  }, []);

  // Projeção 3D -> 2D (isométrica com rotação em torno dos eixos Y, X e Z)
  const project = useMemo(() => {
    const ay = (azimuth * Math.PI) / 180;
    const ax = (elevation * Math.PI) / 180;
    const az = (roll * Math.PI) / 180;
    const cy = Math.cos(ay), sy = Math.sin(ay);
    const cx = Math.cos(ax), sx = Math.sin(ax);
    const cz = Math.cos(az), sz = Math.sin(az);
    const scale = 220;
    const cx0 = 200, cy0 = 200;
    return ([fx, fy, fz]) => {
      // centraliza em torno de (0.5,0.5,0.5)
      let x = fx - 0.5, y = fy - 0.5, z = fz - 0.5;
      // rotação em Y (azimute)
      let x1 = x * cy + z * sy;
      let z1 = -x * sy + z * cy;
      // rotação em X (elevação)
      let y1 = y * cx - z1 * sx;
      let z2 = y * sx + z1 * cx;
      // rotação em Z (roll) no plano da tela
      let x2 = x1 * cz - y1 * sz;
      let y2 = x1 * sz + y1 * cz;
      const sX = cx0 + x2 * scale;
      const sY = cy0 - y2 * scale;
      return { x: sX, y: sY, depth: z2 };
    };
  }, [azimuth, elevation, roll]);

  const colorFor = (type) =>
    type === 'corner' ? '#0ea5e9' : type === 'face' ? '#22d3ee' : '#fbbf24';
  const radiusFor = (type) =>
    type === 'corner' ? 9 : type === 'face' ? 8 : 7;

  const projected = useMemo(
    () =>
      atoms
        .map((a) => ({ ...a, ...project(a.p) }))
        .sort((m, n) => m.depth - n.depth),
    [atoms, project]
  );

  const cubeEdges = useMemo(() => {
    const v = [
      [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
      [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
    ];
    const e = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    return e.map(([a, b]) => ({ a: project(v[a]), b: project(v[b]) }));
  }, [project]);

  const handleRotate = (axis, value) => {
    if (axis === 'azimuth') setAzimuth(value);
    else if (axis === 'elevation') setElevation(value);
    else setRoll(value);
    log_event('INFO', 'Rotação da célula diamante', { axis, value });
  };

  const wrap = (v) => ((v + 180) % 360 + 360) % 360 - 180;

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      az: azimuth,
      el: elevation,
      roll,
      shift: e.shiftKey,
    };
    log_event('INFO', 'Início de arrasto da célula diamante', {});
  };

  const handlePointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (d.shift || e.shiftKey) {
      // Shift + arrasto horizontal => roll (eixo Z)
      setRoll(wrap(d.roll + dx * 0.5));
    } else {
      setAzimuth(wrap(d.az + dx * 0.5));
      setElevation(Math.max(-90, Math.min(90, d.el + dy * 0.5)));
    }
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    log_event('INFO', 'Fim de arrasto da célula diamante', {
      azimuth,
      elevation,
      roll,
    });
  };

  return (
    <div className="diagram-card">
      <h2 style={{ marginTop: 0 }}>💎 Célula Unitária da Estrutura Diamante</h2>
      <p style={{ color: 'var(--fg-1)', fontSize: 13.5, lineHeight: 1.5 }}>
        Estrutura cristalina do silício, germânio e carbono (diamante). Composta por
        duas sub-redes <strong>FCC</strong> deslocadas de (¼, ¼, ¼), totalizando
        <strong> 8 átomos efetivos</strong> por célula unitária. Cada átomo possui
        4 vizinhos em geometria <strong>tetraédrica</strong> (ângulo de 109,5°).
        <strong> Arraste com o mouse</strong> sobre a figura para girar em todos os eixos
        (segure <strong>Shift</strong> e arraste para girar no plano da tela), ou use os controles.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
        <svg
          viewBox="0 0 400 400"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            background: 'var(--bg-0)',
            border: '1px solid var(--bg-3)',
            borderRadius: 10,
            maxWidth: 840,
            width: '100%',
            cursor: dragRef.current ? 'grabbing' : 'grab',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          {/* Arestas do cubo */}
          {cubeEdges.map((edge, i) => (
            <line
              key={`edge-${i}`}
              x1={edge.a.x}
              y1={edge.a.y}
              x2={edge.b.x}
              y2={edge.b.y}
              stroke="#475569"
              strokeWidth="1.5"
            />
          ))}

          {/* Ligações tetraédricas */}
          {showBonds &&
            bonds.map((b, i) => {
              const p1 = project(b[0]);
              const p2 = project(b[1]);
              return (
                <line
                  key={`bond-${i}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              );
            })}

          {/* Átomos (ordenados por profundidade) */}
          {projected.map((a, i) => (
            <g key={`atom-${i}`}>
              <circle
                cx={a.x}
                cy={a.y}
                r={radiusFor(a.type)}
                fill={colorFor(a.type)}
                stroke="#0b1120"
                strokeWidth="1.5"
              />
              {showLabels && a.type === 'interior' && (
                <text x={a.x} y={a.y - 11} textAnchor="middle" fontSize="9" fill="#fbbf24">
                  ¼
                </text>
              )}
            </g>
          ))}
        </svg>

        <div style={{ flex: '1 1 220px', minWidth: 220 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-2)', marginBottom: 4 }}>
              Azimute (Y): {azimuth}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              value={azimuth}
              onChange={(e) => handleRotate('azimuth', Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-2)', marginBottom: 4 }}>
              Elevação (X): {elevation}°
            </label>
            <input
              type="range"
              min="-90"
              max="90"
              value={elevation}
              onChange={(e) => handleRotate('elevation', Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-2)', marginBottom: 4 }}>
              Giro no plano (Z): {Math.round(roll)}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              value={roll}
              onChange={(e) => handleRotate('roll', Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={showBonds}
              onChange={(e) => setShowBonds(e.target.checked)}
            />
            Mostrar ligações tetraédricas
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            Rótulos de átomos internos
          </label>

          <div style={{ fontSize: 12.5, color: 'var(--fg-1)', lineHeight: 1.7 }}>
            <div>
              <span style={{ color: '#0ea5e9', fontWeight: 700 }}>●</span> Vértices (8)
            </div>
            <div>
              <span style={{ color: '#22d3ee', fontWeight: 700 }}>●</span> Faces (6)
            </div>
            <div>
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>●</span> Internos tetraédricos (4)
            </div>
            <hr style={{ borderColor: 'var(--bg-3)', margin: '10px 0' }} />
            <div>Parâmetro de rede (Si): <strong>a = 5,431 Å</strong></div>
            <div>Comprimento de ligação: <strong>a√3/4 ≈ 2,35 Å</strong></div>
            <div>Número de coordenação: <strong>4</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
