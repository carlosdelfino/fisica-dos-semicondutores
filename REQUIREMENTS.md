![visitors](https://visitor-badge.laobi.icu/badge?page_id=carlosdelfino.BasicaoDaEletronica)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-5-646cff)
![Status](https://img.shields.io/badge/Status-Educa%C3%A7%C3%A3o-brightgreen)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1a56db,100:10b981&height=220&section=header&text=Bandas%20de%20Energia&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Requisitos%20%7C%20Semicondutores%20Intr%C3%ADnsecos%20e%20Dopados&descSize=18&descAlignY=55&descColor=94a3b8" width="100%" alt="Header"/>
</p>

# REQUIREMENTS — Diagrama de Bandas em Semicondutores

## 1. Objetivo

Construir uma aplicação **React + SVG + HTML5 + CSS** de caráter educacional que demonstre, com rigor físico, o funcionamento das **bandas de energia** em semicondutores **intrínsecos** e **dopados (tipo-n com Fósforo, tipo-p com Boro)**, expondo as fórmulas de **Fermi-Dirac**, **Maxwell-Boltzmann**, **densidade de estados** e **concentração de portadores**.

## 2. Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| RF01 | Exibir diagrama de bandas (E_c, E_v, E_F, E_g) para Si intrínseco, tipo-n (P) e tipo-p (B) |
| RF02 | Exibir rede cristalina 2D do Silício com ligações covalentes; permitir substituição de átomos por P ou B |
| RF03 | Plotar a distribuição de Fermi-Dirac f(E) com slider de Temperatura (0 K → 1000 K) e de E_F |
| RF04 | Sobrepor aproximação de Maxwell-Boltzmann ao gráfico de Fermi-Dirac e delimitar a região de validade |
| RF05 | Plotar g(E)·f(E) na banda de condução e g(E)·(1-f(E)) na banda de valência |
| RF06 | Calcular e exibir Nc, Nv, n, p, n_i, E_F em função de T e da dopagem |
| RF07 | Plotar n(T), p(T) em escala ln(n) vs 1000/T mostrando regiões freeze-out, extrínseca e intrínseca |
| RF08 | Exibir fórmulas renderizadas em KaTeX com derivações passo-a-passo |
| RF09 | Permitir escolher material (Si, Ge, GaAs) com parâmetros realistas (E_g, m*_n, m*_p) |
| RF10 | Permitir ajustar concentração de dopantes N_D (P) e N_A (B) entre 10¹³ e 10¹⁹ cm⁻³ |
| RF11 | Animação de elétrons (azul) e lacunas (vermelho) cruzando o gap em função de T |
| RF12 | Destacar níveis doadores E_d (~45 meV abaixo de E_c para P:Si) e aceitadores E_a (~45 meV acima de E_v para B:Si) |

## 3. Requisitos Não Funcionais (RNF)

- **RNF01** — Aplicação 100% cliente (SPA), sem backend.
- **RNF02** — Diagramas em **SVG puro** (sem libs de charting pesadas) para clareza e escalabilidade.
- **RNF03** — Fórmulas renderizadas com **KaTeX** (rápido, sem dependência de MathJax).
- **RNF04** — Layout responsivo, tema dark científico.
- **RNF05** — Acessibilidade: contraste AA, tooltips descritivos.
- **RNF06** — Logs estruturados no console (padrão PDCL) para ações do usuário e cálculos.

## 4. Modelo Físico Adotado

### 4.1 Constantes fundamentais (SI)

| Símbolo | Valor |
|---------|-------|
| k_B | 1.380649 × 10⁻²³ J/K = 8.617333 × 10⁻⁵ eV/K |
| h | 6.62607015 × 10⁻³⁴ J·s |
| ℏ | 1.054571817 × 10⁻³⁴ J·s |
| m_0 | 9.1093837 × 10⁻³¹ kg |
| q | 1.602176634 × 10⁻¹⁹ C |

### 4.2 Parâmetros do material (300 K)

| Material | E_g (eV) | m*_n / m_0 | m*_p / m_0 | n_i (cm⁻³) |
|----------|----------|------------|------------|------------|
| Si | 1.12 | 1.08 (DOS) | 0.81 (DOS) | 1.0×10¹⁰ |
| Ge | 0.66 | 0.56 | 0.29 | 2.0×10¹³ |
| GaAs | 1.424 | 0.067 | 0.47 | 2.1×10⁶ |

### 4.3 Níveis de impureza em Si (eV abaixo de E_c ou acima de E_v)

| Dopante | Tipo | Energia de ionização |
|---------|------|----------------------|
| Fósforo (P) | doador | E_c − E_d ≈ 0.045 eV |
| Boro (B) | aceitador | E_a − E_v ≈ 0.045 eV |

### 4.4 Fórmulas principais

1. **Fermi-Dirac**  
   f(E) = 1 / [1 + exp((E − E_F)/k_B T)]

2. **Maxwell-Boltzmann** (aproximação para E − E_F ≫ k_B T)  
   f_MB(E) ≈ exp(−(E − E_F)/k_B T)

3. **Densidade efetiva de estados**  
   N_c = 2 · (2π m*_n k_B T / h²)^(3/2)  
   N_v = 2 · (2π m*_p k_B T / h²)^(3/2)

4. **Concentração de portadores (não-degenerado)**  
   n = N_c · exp(−(E_c − E_F)/k_B T)  
   p = N_v · exp(−(E_F − E_v)/k_B T)

5. **Lei de ação de massas**  
   n · p = n_i² = N_c N_v · exp(−E_g/k_B T)

6. **Nível de Fermi intrínseco**  
   E_Fi = (E_c + E_v)/2 + (k_B T/2) · ln(N_v/N_c)

7. **Neutralidade de carga (completa ionização)**  
   n + N_A⁻ = p + N_D⁺ ⇒  
   n ≈ (N_D − N_A)/2 + √[((N_D−N_A)/2)² + n_i²] (tipo-n)

8. **Densidade de estados (3D, banda parabólica)**  
   g_c(E) = (1/2π²) · (2m*_n/ℏ²)^(3/2) · √(E − E_c), E ≥ E_c  
   g_v(E) = (1/2π²) · (2m*_p/ℏ²)^(3/2) · √(E_v − E), E ≤ E_v

## 5. Estrutura de Componentes

```
src/
├── main.jsx
├── App.jsx
├── physics/
│   ├── constants.js
│   ├── materials.js
│   └── formulas.js
├── components/
│   ├── Header.jsx
│   ├── Controls.jsx
│   ├── BandDiagram.jsx       (RF01, RF11, RF12)
│   ├── Lattice.jsx           (RF02)
│   ├── FermiDiracPlot.jsx    (RF03, RF04)
│   ├── DensityOfStates.jsx   (RF05)
│   ├── CarrierPanel.jsx      (RF06)
│   ├── CarrierVsTemp.jsx     (RF07)
│   ├── FormulaCard.jsx       (RF08)
│   └── Math.jsx              (KaTeX wrapper)
└── styles/
    └── app.css
```

## 6. Cenários de Teste

- T = 0 K → f(E) é degrau em E_F; n = p = 0.
- T = 300 K, Si intrínseco → n = p ≈ 1×10¹⁰ cm⁻³; E_F ≈ midgap.
- Si:P N_D = 10¹⁶ → n ≈ N_D, E_F aproxima-se de E_c.
- Si:B N_A = 10¹⁶ → p ≈ N_A, E_F aproxima-se de E_v.
- Região Maxwell-Boltzmann válida apenas quando |E − E_F| > 3 k_B T.

## 7. Entregáveis

- Projeto Vite + React rodando em `npm run dev`.
- README.md com instruções.
- Diagramas SVG exportáveis (botão "baixar SVG").

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:10b981,50:1a56db,100:0f172a&height=120&section=footer" width="100%" alt="Footer"/>
</p>

---
**Resumo:** Requisitos funcionais, não funcionais e modelo físico do simulador educacional de bandas de energia em semicondutores intrínsecos e dopados (Si:P, Si:B).
**Data de Criação:** 2026-04-26
**Autor:** Rapport Generativa
**Versão:** 1.0
**Última Atualização:** 2026-04-26
**Atualizado por:** Carlos Delfino
**Histórico de Alterações:**
- 2026-04-26 - Atualizado por Carlos Delfino - first commit...
- 2026-04-26 - Criado por Rapport Generativa - Versão 1.0
