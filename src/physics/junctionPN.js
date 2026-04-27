/**
 * Física da junção PN (abrupta) — fórmulas analíticas usadas pelas visualizações.
 *
 * Referências: Neamen "Semiconductor Physics and Devices" cap. 7-8;
 *              Pierret, "Semiconductor Device Fundamentals".
 *
 * Convenções:
 *   - Coordenada x crescendo do P (esquerda) para o N (direita).
 *   - Origem (x=0) na metalúrgica.
 *   - Energias em eV; concentrações em cm^-3; campo em V/cm; potenciais em V.
 *   - ε_0 = 8.854e-14 F/cm  ⇒ ε_s = ε_r · ε_0 (cm).
 */

import { k_B_eV, q } from './constants.js';
import { MATERIALS, bandgap } from './materials.js';
import { intrinsicCarrier, log_event } from './formulas.js';

export const EPS_0_F_CM = 8.854e-14; // F/cm
export const eps_s = (mat) => MATERIALS[mat].epsilon_r * EPS_0_F_CM;

/** Tensão térmica V_T = kT/q (volts). */
export const Vt = (T) => k_B_eV * T;

/**
 * Potencial built-in (volts).
 *   V_bi = (kT/q) ln(Na · Nd / ni²)
 */
export function builtInVoltage(mat, T, Na, Nd) {
  const ni = intrinsicCarrier(mat, T);
  if (ni <= 0 || Na <= 0 || Nd <= 0) return 0;
  return Vt(T) * Math.log((Na * Nd) / (ni * ni));
}

/**
 * Largura total da camada de depleção (cm).
 *   W = sqrt( 2 ε_s (V_bi - V_a) / q · (Na+Nd)/(Na·Nd) )
 *
 * @param {string} mat material
 * @param {number} T temperatura (K)
 * @param {number} Na cm^-3
 * @param {number} Nd cm^-3
 * @param {number} Va tensão aplicada (V) — direta > 0, reversa < 0
 */
export function depletionWidth(mat, T, Na, Nd, Va = 0) {
  const Vbi = builtInVoltage(mat, T, Na, Nd);
  const Vj  = Vbi - Va;
  if (Vj <= 0) return 0;
  const e = eps_s(mat);
  const W = Math.sqrt((2 * e * Vj) / q * (Na + Nd) / (Na * Nd));
  return W;
}

/**
 * Decomposição da depleção em xn (lado N) e xp (lado P).
 *   Na · xp = Nd · xn   (neutralidade da carga espacial)
 */
export function depletionSplit(W, Na, Nd) {
  const xn = (Na / (Na + Nd)) * W;
  const xp = (Nd / (Na + Nd)) * W;
  return { xn, xp };
}

/**
 * Campo elétrico máximo na junção (V/cm).
 *   |E_max| = q · Nd · xn / ε_s = q · Na · xp / ε_s
 *           = 2(V_bi-V_a) / W
 */
export function maxElectricField(mat, T, Na, Nd, Va = 0) {
  const W = depletionWidth(mat, T, Na, Nd, Va);
  if (W <= 0) return 0;
  const Vbi = builtInVoltage(mat, T, Na, Nd);
  return (2 * (Vbi - Va)) / W;
}

/**
 * Perfil triangular do campo elétrico em função de x (V/cm).
 *   x ∈ [-xp, +xn]
 */
export function electricFieldProfile(mat, T, Na, Nd, Va = 0, x = 0) {
  const W = depletionWidth(mat, T, Na, Nd, Va);
  if (W <= 0) return 0;
  const { xn, xp } = depletionSplit(W, Na, Nd);
  const e = eps_s(mat);
  if (x >= -xp && x <= 0)  return -(q * Na / e) * (x + xp);
  if (x >  0  && x <= xn)  return -(q * Nd / e) * (xn - x);
  return 0;
}

/**
 * Perfil de potencial (V) integrando E(x).  Origem: φ(-xp) = 0; φ(+xn) = V_bi-V_a.
 */
export function potentialProfile(mat, T, Na, Nd, Va = 0, x = 0) {
  const W = depletionWidth(mat, T, Na, Nd, Va);
  if (W <= 0) return 0;
  const { xn, xp } = depletionSplit(W, Na, Nd);
  const e = eps_s(mat);
  if (x < -xp) return 0;
  if (x > xn)  return builtInVoltage(mat, T, Na, Nd) - Va;
  if (x <= 0) {
    return (q * Na / (2 * e)) * (x + xp) ** 2;
  } else {
    const Vj = builtInVoltage(mat, T, Na, Nd) - Va;
    return Vj - (q * Nd / (2 * e)) * (xn - x) ** 2;
  }
}

/**
 * Capacitância de junção por unidade de área (F/cm²).
 *   C_j = ε_s / W
 */
export function junctionCapacitance(mat, T, Na, Nd, Va = 0) {
  const W = depletionWidth(mat, T, Na, Nd, Va);
  if (W <= 0) return Infinity;
  return eps_s(mat) / W;
}

// ─────────────────────────────────────────────────────────────────────────────
// Relação de Einstein — vale dentro e fora do equilíbrio.
//   D = μ · kT/q
// μ depende de m* e τ (tempo médio de espalhamento térmico).
// ─────────────────────────────────────────────────────────────────────────────

/** Difusividade a partir de mobilidade pela relação de Einstein (cm²/s). */
export function einsteinDiffusivity(mu, T) {
  return mu * Vt(T);
}

/** Mobilidade aproximada (modelo simplificado μ = qτ/m*). */
export function mobilityFromTau(mEff_rel, tau_s) {
  // μ = q·τ/m  em m²/(V·s); converter para cm²/(V·s) ×1e4
  // m = mEff_rel · m_0  ⇒  μ[cm²/Vs] = (q/m)·τ ·1e4
  const m_0_kg = 9.1093837015e-31;
  const mu_SI = (1.602176634e-19 * tau_s) / (mEff_rel * m_0_kg); // m²/Vs
  return mu_SI * 1e4; // cm²/Vs
}

// ─────────────────────────────────────────────────────────────────────────────
// Campo embutido em material não-uniformemente dopado (equilíbrio)
//   E(x) = -(kT/q) · (1/N(x)) · dN/dx
// (assumindo N_d(x) ≫ ni e ionização completa: n(x) ≈ N_d(x))
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Campo interno (V/cm) sob equilíbrio em material com N_d(x) variável.
 * Recebe arrays já amostrados.
 */
export function builtInFieldFromGradient(N_array, x_array, T) {
  const VtVal = Vt(T);
  const E = new Array(N_array.length).fill(0);
  for (let i = 1; i < N_array.length - 1; i++) {
    const dN = (N_array[i + 1] - N_array[i - 1]) / (x_array[i + 1] - x_array[i - 1]);
    const Nx = Math.max(N_array[i], 1);
    E[i] = -VtVal * dN / Nx; // V/cm  (já que dN é cm^-3 / cm e VtVal em V)
  }
  E[0] = E[1];
  E[N_array.length - 1] = E[N_array.length - 2];
  return E;
}

// ─────────────────────────────────────────────────────────────────────────────
// Critério de degenerescência
//   Não-degenerado: |E_F - E_c| ≥ 3 kT  (ou |E_v - E_F| ≥ 3 kT)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Classifica um material a partir de (E_F - E_c) em eV.
 * Retorna 'non-degenerate' | 'borderline' | 'degenerate'.
 */
export function degeneracyType(E_minus_band_eV, T) {
  const kT = k_B_eV * T;
  const r = E_minus_band_eV / kT;
  if (Math.abs(r) >= 3) return 'non-degenerate';
  if (Math.abs(r) >= 1) return 'borderline';
  return 'degenerate';
}

/**
 * Concentração de elétrons usando Boltzmann (não-degenerado).
 *   n = Nc · exp(-(Ec - EF)/kT)
 */
export function nBoltzmann(Nc, Ec, EF, T) {
  return Nc * Math.exp(-(Ec - EF) / (k_B_eV * T));
}

/**
 * Aproximação Joyce-Dixon da integral de Fermi-Dirac F_{1/2}.
 *   η = ln(u) + u · 0.353553 - u² · 4.95e-3 + u³ · 1.484e-4
 *   onde u = n / Nc
 *
 *   Permite recuperar (E_F - E_c)/kT a partir de n no regime degenerado.
 *
 * Retorna η = (E_F - E_c)/kT.
 */
export function joyceDixon(n_over_Nc) {
  const u = Math.max(n_over_Nc, 1e-30);
  return Math.log(u) + 0.353553 * u - 4.95e-3 * u * u + 1.484e-4 * u * u * u;
}

log_event('SUCCESS', 'Módulo junctionPN.js carregado');
