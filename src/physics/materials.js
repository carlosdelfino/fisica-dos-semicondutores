// Parâmetros de materiais semicondutores típicos (300 K).
// Eg em eV; massas efetivas relativas a m_0 (massas DOS para Si/Ge).
// ni a 300 K em cm^-3.
export const MATERIALS = {
  Si: {
    name: 'Silício (Si)',
    color: '#7dd3fc',
    Eg_300: 1.12,
    Eg_0:   1.17, // a T = 0 (Varshni)
    alpha:  4.73e-4, // eV/K Varshni
    beta:   636,     // K    Varshni
    mn_eff: 1.08,
    mp_eff: 0.81,
    ni_300: 1.0e10,
    epsilon_r: 11.7,
    a_lattice: 5.431e-10, // m
    gap_type: 'indirect', // CB minimum near X point
    kCB_min: 0.85,        // posição do mínimo da BC em unidades de π/a (Δ direction)
    kVB_max: 0.0,         // máximo da BV no Γ
    dopants: {
      donor:    { symbol: 'P', name: 'Fósforo',  dE: 0.045 },
      acceptor: { symbol: 'B', name: 'Boro',     dE: 0.045 },
    },
  },
  Ge: {
    name: 'Germânio (Ge)',
    color: '#c4b5fd',
    Eg_300: 0.66,
    Eg_0:   0.7437,
    alpha:  4.774e-4,
    beta:   235,
    mn_eff: 0.56,
    mp_eff: 0.29,
    ni_300: 2.0e13,
    epsilon_r: 16.0,
    a_lattice: 5.658e-10,
    gap_type: 'indirect',
    kCB_min: 1.0,         // L point
    kVB_max: 0.0,
    dopants: {
      donor:    { symbol: 'P', name: 'Fósforo', dE: 0.012 },
      acceptor: { symbol: 'B', name: 'Boro',    dE: 0.010 },
    },
  },
  GaAs: {
    name: 'Arseneto de Gálio (GaAs)',
    color: '#fca5a5',
    Eg_300: 1.424,
    Eg_0:   1.519,
    alpha:  5.405e-4,
    beta:   204,
    mn_eff: 0.067,
    mp_eff: 0.47,
    ni_300: 2.1e6,
    epsilon_r: 13.1,
    a_lattice: 5.653e-10,
    gap_type: 'direct',
    kCB_min: 0.0,         // Γ point
    kVB_max: 0.0,
    dopants: {
      donor:    { symbol: 'Si', name: 'Silício (em sítio Ga)', dE: 0.006 },
      acceptor: { symbol: 'Zn', name: 'Zinco',                  dE: 0.031 },
    },
  },
  GaN: {
    name: 'Nitreto de Gálio (GaN)',
    color: '#fde68a',
    Eg_300: 3.39,
    Eg_0:   3.51,
    alpha:  7.7e-4,   // eV/K Varshni
    beta:   600,      // K    Varshni
    mn_eff: 0.20,
    mp_eff: 1.4,
    ni_300: 1.0e-10,
    epsilon_r: 8.9,
    a_lattice: 3.189e-10, // m (wurtzita, parâmetro a basal)
    c_lattice: 5.185e-10, // m (parâmetro c)
    gap_type: 'direct',
    kCB_min: 0.0,         // Γ point
    kVB_max: 0.0,
    dopants: {
      donor:    { symbol: 'Si', name: 'Silício (em sítio Ga)', dE: 0.017 },
      acceptor: { symbol: 'Mg', name: 'Magnésio',              dE: 0.170 },
    },
  },
  SiC: {
    name: 'Carbeto de Silício (SiC - 4H)',
    color: '#86efac',
    Eg_300: 3.23,
    Eg_0:   3.26,
    alpha:  3.3e-4,
    beta:   680,
    mn_eff: 0.35,
    mp_eff: 1.0,
    ni_300: 1.0e-9,
    epsilon_r: 9.7,
    a_lattice: 3.073e-10, // parâmetro de rede basal (a)
    c_lattice: 10.053e-10, // parâmetro de rede c (para estrutura hexagonal)
    gap_type: 'indirect',
    kCB_min: 0.0,         // Γ point (mas gap indireto em M-L)
    kVB_max: 0.0,
    dopants: {
      donor:    { symbol: 'N',  name: 'Nitrogênio',  dE: 0.05 },
      acceptor: { symbol: 'Al', name: 'Alumínio',     dE: 0.20 },
    },
  },
};

// Equação de Varshni: Eg(T) = Eg(0) - alpha*T^2/(T+beta)
export function bandgap(material, T) {
  const m = MATERIALS[material];
  if (!m) return 1.12;
  return m.Eg_0 - (m.alpha * T * T) / (T + m.beta);
}
