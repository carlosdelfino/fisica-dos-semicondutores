import { k_B_eV, k_B_J, h, hbar, m_0, q } from './constants.js';
import { MATERIALS, bandgap } from './materials.js';

/**
 * Distribuição de Fermi-Dirac.
 * @param {number} E    energia (eV)
 * @param {number} EF   nível de Fermi (eV)
 * @param {number} T    temperatura (K)
 * @returns {number}    probabilidade [0,1]
 */
export function fermiDirac(E, EF, T) {
  if (T <= 0) return E < EF ? 1 : E > EF ? 0 : 0.5;
  const x = (E - EF) / (k_B_eV * T);
  // Estabilidade numérica
  if (x > 50) return Math.exp(-x);
  if (x < -50) return 1 - Math.exp(x);
  return 1 / (1 + Math.exp(x));
}

/**
 * Aproximação de Maxwell-Boltzmann (válida quando E - EF >> kT).
 */
export function maxwellBoltzmann(E, EF, T) {
  if (T <= 0) return E <= EF ? 1 : 0;
  return Math.exp(-(E - EF) / (k_B_eV * T));
}

/**
 * Densidade efetiva de estados em cm^-3.
 * Nc = 2 * (2π m*_n kT / h^2)^(3/2)
 * @param {number} mEff massa efetiva (em unidades de m_0)
 * @param {number} T temperatura (K)
 * @returns {number} cm^-3
 */
export function effectiveDOS(mEff, T) {
  if (T <= 0) return 0;
  // calculo em SI
  const m = mEff * m_0;
  const N_m3 = 2 * Math.pow((2 * Math.PI * m * k_B_J * T) / (h * h), 1.5);
  return N_m3 * 1e-6; // m^-3 -> cm^-3
}

export const Nc = (mat, T) => effectiveDOS(MATERIALS[mat].mn_eff, T);
export const Nv = (mat, T) => effectiveDOS(MATERIALS[mat].mp_eff, T);

/**
 * Concentração intrínseca: ni = sqrt(Nc Nv) exp(-Eg/2kT)
 */
export function intrinsicCarrier(mat, T) {
  if (T <= 0) return 0;
  const Eg = bandgap(mat, T);
  return Math.sqrt(Nc(mat, T) * Nv(mat, T)) * Math.exp(-Eg / (2 * k_B_eV * T));
}

/**
 * Posição do nível de Fermi intrínseco em relação a (Ec+Ev)/2.
 * EFi = midgap + (kT/2) ln(Nv/Nc)
 */
export function intrinsicFermiOffset(mat, T) {
  if (T <= 0) return 0;
  return ((k_B_eV * T) / 2) * Math.log(Nv(mat, T) / Nc(mat, T));
}

/**
 * Resolve neutralidade de carga para semicondutor com NA, ND
 * (assume ionização completa; válido em região extrínseca).
 * Retorna {n, p, EF, type}.
 *
 * Convenção de zero de energia: midgap. Ec = +Eg/2, Ev = -Eg/2.
 */
export function carrierConcentrations(mat, T, ND, NA) {
  if (T <= 0) {
    return { n: 0, p: 0, EF: 0, type: 'frozen', Eg: bandgap(mat, T) };
  }
  const Eg  = bandgap(mat, T);
  const ni  = intrinsicCarrier(mat, T);
  const dN  = ND - NA; // doping líquido

  // Solução do sistema n - p = ND - NA, n*p = ni^2
  let n, p;
  if (dN >= 0) {
    n = dN / 2 + Math.sqrt((dN / 2) ** 2 + ni * ni);
    p = (ni * ni) / n;
  } else {
    p = -dN / 2 + Math.sqrt((dN / 2) ** 2 + ni * ni);
    n = (ni * ni) / p;
  }

  // EF a partir de n: n = Nc exp(-(Ec - EF)/kT) -> EF = Ec - kT ln(Nc/n)
  const Ec = Eg / 2;
  const Ev = -Eg / 2;
  const NcVal = Nc(mat, T);
  const EF = Ec - k_B_eV * T * Math.log(NcVal / Math.max(n, 1));

  let type = 'intrinsic';
  if (dN > 10 * ni) type = 'n';
  else if (dN < -10 * ni) type = 'p';

  return { n, p, EF, type, Eg, Ec, Ev, ni, Nc: NcVal, Nv: Nv(mat, T) };
}

/**
 * Densidade de estados 3D (banda parabólica).
 * gc(E) = (1/(2π²)) (2 m*_n / ℏ²)^(3/2) sqrt(E - Ec)  para E >= Ec
 *
 * Retorna estados / (eV · cm^3).
 */
export function dosConduction(E, Ec, mEff) {
  if (E <= Ec) return 0;
  const m = mEff * m_0;
  // g em J^-1 m^-3
  const pref = (1 / (2 * Math.PI * Math.PI)) * Math.pow((2 * m) / (hbar * hbar), 1.5);
  const sqrtE = Math.sqrt((E - Ec) * q); // (E-Ec) em J
  const g_J_m3 = pref * sqrtE;
  // converter para 1/(eV cm^3): multiplica por q (eV->J) e por 1e-6 (m^3->cm^3)
  return g_J_m3 * q * 1e-6;
}

export function dosValence(E, Ev, mEff) {
  if (E >= Ev) return 0;
  const m = mEff * m_0;
  const pref = (1 / (2 * Math.PI * Math.PI)) * Math.pow((2 * m) / (hbar * hbar), 1.5);
  const sqrtE = Math.sqrt((Ev - E) * q);
  const g_J_m3 = pref * sqrtE;
  return g_J_m3 * q * 1e-6;
}

/**
 * Logger PDCL para front-end.
 */
export function log_event(level, message, params = {}) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const emojis = {
    INFO: 'ℹ️', ALERT: '⚠️', ERROR: '❌', SUCCESS: '✅',
    DEBUG: '🔍', START: '🚀', END: '🏁', DATA: '📊',
    TOOL: '🔧', CACHE: '📂', SAVE: '💾',
  };
  const emoji = emojis[level] || 'ℹ️';
  const stack = new Error().stack?.split('\n')[2] || '';
  const where = stack.trim().replace(/^at\s+/, '');
  const paramStr = Object.keys(params).length
    ? ' - ' + Object.entries(params).map(([k, v]) => `${k}=${v}`).join(', ')
    : '';
  // eslint-disable-next-line no-console
  console.log(`[${ts}] [${where}] ${emoji} ${message}${paramStr}`);
}
