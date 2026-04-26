// Constantes físicas fundamentais (SI)
export const k_B_J  = 1.380649e-23;       // J/K
export const k_B_eV = 8.617333262e-5;     // eV/K
export const h      = 6.62607015e-34;     // J·s
export const hbar   = 1.054571817e-34;    // J·s
export const m_0    = 9.1093837015e-31;   // kg massa do elétron livre
export const q      = 1.602176634e-19;    // C carga elementar (J/eV)

// Conversões úteis
export const eV_to_J = (E_eV) => E_eV * q;
export const J_to_eV = (E_J)  => E_J / q;
