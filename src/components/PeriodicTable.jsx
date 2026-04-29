import { useState, useEffect, useRef } from 'react';
import { log_event } from '../physics/formulas.js';

/**
 * Dados completos de todos os 118 elementos da tabela periódica
 * Elementos relevantes para eletrônica têm informações detalhadas
 */
const ALL_ELEMENTS = [
  // Período 1
  { symbol: 'H', name: 'Hidrogênio', number: 1, period: 1, group: 1, mass: 1.008, electronConfig: '1s¹' },
  { symbol: 'He', name: 'Hélio', number: 2, period: 1, group: 18, mass: 4.003, electronConfig: '1s²' },
  
  // Período 2
  { symbol: 'Li', name: 'Lítio', number: 3, period: 2, group: 1, mass: 6.941, electronConfig: '[He] 2s¹', category: 'other', description: 'Metal alcalino. Baterias de íon-lítio.', electronics: 'Baterias recarregáveis para dispositivos portáteis e veículos elétricos.' },
  { symbol: 'Be', name: 'Berílio', number: 4, period: 2, group: 2, mass: 9.012, electronConfig: '[He] 2s²' },
  { symbol: 'B', name: 'Boro', number: 5, period: 2, group: 13, mass: 10.81, electronConfig: '[He] 2s² 2p¹', category: 'dopant-p', description: 'Metaloide. Dopante tipo-p em Si e Ge.', electronics: 'Substitui Si, cria lacuna (buraco). Essencial para transistores tipo-p. Boro é o dopante-p mais comum.' },
  { symbol: 'C', name: 'Carbono', number: 6, period: 2, group: 14, mass: 12.011, electronConfig: '[He] 2s² 2p²', category: 'other', description: 'Não-metal. Base do grafeno e nanotubos.', electronics: 'Grafeno para eletrônica de alta mobilidade. Nanotubos para transistores CNTFET.' },
  { symbol: 'N', name: 'Nitrogênio', number: 7, period: 2, group: 15, mass: 14.007, electronConfig: '[He] 2s² 2p³', category: 'semiconductor-compound', description: 'Gás inerte. Componente de GaN e AlN.', electronics: 'GaN para LEDs azuis/brancos, transistores de potência de alta temperatura. Revolucionou iluminação.' },
  { symbol: 'O', name: 'Oxigênio', number: 8, period: 2, group: 16, mass: 15.999, electronConfig: '[He] 2s² 2p⁴', category: 'dielectric', description: 'Não-metal. Essencial para óxidos e dielétricos.', electronics: 'SiO₂ (dióxido de silício) é o dielétrico fundamental em MOSFETs. HfO₂ em nós avançados.' },
  { symbol: 'F', name: 'Flúor', number: 9, period: 2, group: 17, mass: 18.998, electronConfig: '[He] 2s² 2p⁵' },
  { symbol: 'Ne', name: 'Neônio', number: 10, period: 2, group: 18, mass: 20.180, electronConfig: '[He] 2s² 2p⁶' },
  
  // Período 3
  { symbol: 'Na', name: 'Sódio', number: 11, period: 3, group: 1, mass: 22.990, electronConfig: '[Ne] 3s¹' },
  { symbol: 'Mg', name: 'Magnésio', number: 12, period: 3, group: 2, mass: 24.305, electronConfig: '[Ne] 3s²' },
  { symbol: 'Al', name: 'Alumínio', number: 13, period: 3, group: 13, mass: 26.982, electronConfig: '[Ne] 3s² 3p¹', category: 'metal-contact', description: 'Metal leve. Usado em contatos e interconexões.', electronics: 'Interconexões tradicionais (substituído por Cu em nós avançados). Ainda usado em pads de bonding.' },
  { symbol: 'Si', name: 'Silício', number: 14, period: 3, group: 14, mass: 28.086, electronConfig: '[Ne] 3s² 3p²', category: 'semiconductor', description: 'Semicondutor mais utilizado na indústria eletrônica. Gap de 1.12 eV a 300K.', electronics: 'Base de 95% dos circuitos integrados. Abundante, baixo custo, óxido nativo (SiO₂) excelente para isolamento.' },
  { symbol: 'P', name: 'Fósforo', number: 15, period: 3, group: 15, mass: 30.974, electronConfig: '[Ne] 3s² 3p³', category: 'dopant-n', description: 'Não-metal. Dopante tipo-n em Si e Ge.', electronics: 'Substitui Si, adiciona elétron livre. Dopante-n mais comum em silício.' },
  { symbol: 'S', name: 'Enxofre', number: 16, period: 3, group: 16, mass: 32.06, electronConfig: '[Ne] 3s² 3p⁴', category: 'semiconductor-compound', description: 'Não-metal. Componente de CdS, ZnS.', electronics: 'CdS para fotoresistores (detectores de luz). ZnS para fósforos e eletrônica.' },
  { symbol: 'Cl', name: 'Cloro', number: 17, period: 3, group: 17, mass: 35.45, electronConfig: '[Ne] 3s² 3p⁵' },
  { symbol: 'Ar', name: 'Argônio', number: 18, period: 3, group: 18, mass: 39.948, electronConfig: '[Ne] 3s² 3p⁶' },
  
  // Período 4
  { symbol: 'K', name: 'Potássio', number: 19, period: 4, group: 1, mass: 39.098, electronConfig: '[Ar] 4s¹' },
  { symbol: 'Ca', name: 'Cálcio', number: 20, period: 4, group: 2, mass: 40.078, electronConfig: '[Ar] 4s²' },
  { symbol: 'Sc', name: 'Escândio', number: 21, period: 4, group: 3, mass: 44.956, electronConfig: '[Ar] 3d¹ 4s²' },
  { symbol: 'Ti', name: 'Titânio', number: 22, period: 4, group: 4, mass: 47.867, electronConfig: '[Ar] 3d² 4s²', category: 'metal-contact', description: 'Metal de transição. Forma silicetos.', electronics: 'Barreira de difusão (TiN), contatos ohmicos. Siliceto de titânio reduz resistência de contato.' },
  { symbol: 'V', name: 'Vanádio', number: 23, period: 4, group: 5, mass: 50.942, electronConfig: '[Ar] 3d³ 4s²' },
  { symbol: 'Cr', name: 'Cromo', number: 24, period: 4, group: 6, mass: 51.996, electronConfig: '[Ar] 3d⁵ 4s¹' },
  { symbol: 'Mn', name: 'Manganês', number: 25, period: 4, group: 7, mass: 54.938, electronConfig: '[Ar] 3d⁵ 4s²' },
  { symbol: 'Fe', name: 'Ferro', number: 26, period: 4, group: 8, mass: 55.845, electronConfig: '[Ar] 3d⁶ 4s²', category: 'other', description: 'Metal ferromagnético. Componente de spintrônica.', electronics: 'Spintrônica usa spin do elétron. Memórias MRAM, sensores, transistores magnéticos.' },
  { symbol: 'Co', name: 'Cobalto', number: 27, period: 4, group: 9, mass: 58.933, electronConfig: '[Ar] 3d⁷ 4s²', category: 'metal-contact', description: 'Metal ferromagnético. Forma silicetos.', electronics: 'Siliceto de cobalto para contatos de baixa resistência em tecnologia avançada.' },
  { symbol: 'Ni', name: 'Níquel', number: 28, period: 4, group: 10, mass: 58.693, electronConfig: '[Ar] 3d⁸ 4s²', category: 'metal-contact', description: 'Metal ferromagnético. Forma silicetos.', electronics: 'Siliceto de níquel para contatos em CMOS avançado. Barreira de difusão.' },
  { symbol: 'Cu', name: 'Cobre', number: 29, period: 4, group: 11, mass: 63.546, electronConfig: '[Ar] 3d¹⁰ 4s¹', category: 'metal-contact', description: 'Metal de alta condutividade. Usado em interconexões.', electronics: 'Interconexões em chips modernos (substituiu alumínio). Baixa resistividade, alta eletromigração.' },
  { symbol: 'Zn', name: 'Zinco', number: 30, period: 4, group: 12, mass: 65.38, electronConfig: '[Ar] 3d¹⁰ 4s²', category: 'semiconductor-compound', description: 'Metal de transição. Componente de ZnO, ZnS, ZnSe.', electronics: 'ZnO para transparent conductive oxides, sensores, varistores. ZnSe para lasers azuis.' },
  { symbol: 'Ga', name: 'Gálio', number: 31, period: 4, group: 13, mass: 69.723, electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹', category: 'semiconductor-compound', description: 'Metal usado em semicondutores compostos. Ponto de fusão baixo (29.8°C).', electronics: 'Forma GaAs, GaN, GaP para LEDs, lasers, transistores de alta frequência e células solares.' },
  { symbol: 'Ge', name: 'Germânio', number: 32, period: 4, group: 14, mass: 72.630, electronConfig: '[Ar] 3d¹⁰ 4s² 4p²', category: 'semiconductor', description: 'Semicondutor com gap de 0.66 eV. Primeiro transistor usado Ge.', electronics: 'Usado em aplicações de alta frequência, detectores infravermelhos, e em alguns transistores de alta performance.' },
  { symbol: 'As', name: 'Arsênio', number: 33, period: 4, group: 15, mass: 74.922, electronConfig: '[Ar] 3d¹⁰ 4s² 4p³', category: 'dopant-n', description: 'Metaloide tóxico. Componente de GaAs e outros semicondutores III-V.', electronics: 'GaAs tem gap direto de 1.42 eV, ideal para optoeletrônica (LEDs, lasers, células solares).' },
  { symbol: 'Se', name: 'Selênio', number: 34, period: 4, group: 16, mass: 78.971, electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴', category: 'semiconductor-compound', description: 'Não-metal. Componente de CdSe, ZnSe.', electronics: 'CdSe para quantum dots (nanocristais) em displays e marcação biológica.' },
  { symbol: 'Br', name: 'Bromo', number: 35, period: 4, group: 17, mass: 79.904, electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵' },
  { symbol: 'Kr', name: 'Criptônio', number: 36, period: 4, group: 18, mass: 83.798, electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶' },
  
  // Período 5
  { symbol: 'Rb', name: 'Rubídio', number: 37, period: 5, group: 1, mass: 85.468, electronConfig: '[Kr] 5s¹' },
  { symbol: 'Sr', name: 'Estrôncio', number: 38, period: 5, group: 2, mass: 87.62, electronConfig: '[Kr] 5s²' },
  { symbol: 'Y', name: 'Ítrio', number: 39, period: 5, group: 3, mass: 88.906, electronConfig: '[Kr] 4d¹ 5s²' },
  { symbol: 'Zr', name: 'Zircônio', number: 40, period: 5, group: 4, mass: 91.224, electronConfig: '[Kr] 4d² 5s²', category: 'dielectric', description: 'Metal de transição. Dielétricos de alta-k.', electronics: 'ZrO₂ como alternativa ao HfO₂. Constante dielétrica similar.' },
  { symbol: 'Nb', name: 'Nióbio', number: 41, period: 5, group: 5, mass: 92.906, electronConfig: '[Kr] 4d⁴ 5s¹' },
  { symbol: 'Mo', name: 'Molibdênio', number: 42, period: 5, group: 6, mass: 95.95, electronConfig: '[Kr] 4d⁵ 5s¹' },
  { symbol: 'Tc', name: 'Tecnécio', number: 43, period: 5, group: 7, mass: 98, electronConfig: '[Kr] 4d⁵ 5s²' },
  { symbol: 'Ru', name: 'Rutênio', number: 44, period: 5, group: 8, mass: 101.07, electronConfig: '[Kr] 4d⁷ 5s¹' },
  { symbol: 'Rh', name: 'Ródio', number: 45, period: 5, group: 9, mass: 102.91, electronConfig: '[Kr] 4d⁸ 5s¹' },
  { symbol: 'Pd', name: 'Paládio', number: 46, period: 5, group: 10, mass: 106.42, electronConfig: '[Kr] 4d¹⁰' },
  { symbol: 'Ag', name: 'Prata', number: 47, period: 5, group: 11, mass: 107.87, electronConfig: '[Kr] 4d¹⁰ 5s¹', category: 'metal-contact', description: 'Metal de maior condutividade elétrica.', electronics: 'Condução ideal, mas sofre com migração e oxidação. Usado em aplicações específicas.' },
  { symbol: 'Cd', name: 'Cádmio', number: 48, period: 5, group: 12, mass: 112.41, electronConfig: '[Kr] 4d¹⁰ 5s²', category: 'semiconductor-compound', description: 'Metal tóxico. Componente de CdTe, CdS.', electronics: 'CdTe para células solares de filme fino. CdS para fotoresistores e células solares.' },
  { symbol: 'In', name: 'Índio', number: 49, period: 5, group: 13, mass: 114.82, electronConfig: '[Kr] 4d¹⁰ 5s² 5p¹', category: 'semiconductor-compound', description: 'Metal macio, raro. Usado em semicondutores compostos.', electronics: 'InP, InAs, InSb para detectores infravermelhos, transistores HEMT de alta frequência.' },
  { symbol: 'Sn', name: 'Estanho', number: 50, period: 5, group: 14, mass: 118.71, electronConfig: '[Kr] 4d¹⁰ 5s² 5p²', category: 'other', description: 'Metal. Componente de perovskitas (CH₃NH₃PbI₃).', electronics: 'Perovskitas de haleto para células solares de alta eficiência e baixo custo.' },
  { symbol: 'Sb', name: 'Antimônio', number: 51, period: 5, group: 15, mass: 121.76, electronConfig: '[Kr] 4d¹⁰ 5s² 5p³', category: 'dopant-n', description: 'Metaloide. Dopante tipo-n em Si.', electronics: 'Difunde muito lentamente, usado para regiões profundas de dopagem uniforme.' },
  { symbol: 'Te', name: 'Telúrio', number: 52, period: 5, group: 16, mass: 127.60, electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁴', category: 'semiconductor-compound', description: 'Metaloide raro. Componente de CdTe, PbTe.', electronics: 'CdTe para células solares. PbTe para termoeletricos (conversão calor-eletricidade).' },
  { symbol: 'I', name: 'Iodo', number: 53, period: 5, group: 17, mass: 126.90, electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵' },
  { symbol: 'Xe', name: 'Xenônio', number: 54, period: 5, group: 18, mass: 131.29, electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶' },
  
  // Período 6
  { symbol: 'Cs', name: 'Césio', number: 55, period: 6, group: 1, mass: 132.91, electronConfig: '[Xe] 6s¹' },
  { symbol: 'Ba', name: 'Bário', number: 56, period: 6, group: 2, mass: 137.33, electronConfig: '[Xe] 6s²' },
  { symbol: 'La', name: 'Lantânio', number: 57, period: 6, group: 3, mass: 138.91, electronConfig: '[Xe] 5d¹ 6s²' },
  { symbol: 'Hf', name: 'Háfnio', number: 72, period: 6, group: 4, mass: 178.49, electronConfig: '[Xe] 4f¹⁴ 5d² 6s²', category: 'dielectric', description: 'Metal de transição. Usado em dielétricos de alta-k.', electronics: 'HfO₂ substitui SiO₂ como gate dielectric em nós &lt;45nm. Constante dielétrica ~25.' },
  { symbol: 'Ta', name: 'Tântalo', number: 73, period: 6, group: 5, mass: 180.95, electronConfig: '[Xe] 4f¹⁴ 5d³ 6s²', category: 'dielectric', description: 'Metal de transição. Dielétricos em capacitores.', electronics: 'Ta₂O₅ em capacitores de alta densidade. Barreira de difusão.' },
  { symbol: 'W', name: 'Tungstênio', number: 74, period: 6, group: 6, mass: 183.84, electronConfig: '[Xe] 4f¹⁴ 5d⁴ 6s²', category: 'metal-contact', description: 'Metal de altíssimo ponto de fusão.', electronics: 'Contatos em vias (vias plugs), gate em MOSFETs antigos. Resistente a eletromigração.' },
  { symbol: 'Re', name: 'Rênio', number: 75, period: 6, group: 7, mass: 186.21, electronConfig: '[Xe] 4f¹⁴ 5d⁵ 6s²' },
  { symbol: 'Os', name: 'Ósmio', number: 76, period: 6, group: 8, mass: 190.23, electronConfig: '[Xe] 4f¹⁴ 5d⁶ 6s²' },
  { symbol: 'Ir', name: 'Irídio', number: 77, period: 6, group: 9, mass: 192.22, electronConfig: '[Xe] 4f¹⁴ 5d⁷ 6s²' },
  { symbol: 'Pt', name: 'Platina', number: 78, period: 6, group: 10, mass: 195.08, electronConfig: '[Xe] 4f¹⁴ 5d⁹ 6s¹', category: 'metal-contact', description: 'Metal nobre. Estável quimicamente.', electronics: 'Eletrodos em memórias, sensores, contatos de alta estabilidade. Siliceto de platina.' },
  { symbol: 'Au', name: 'Ouro', number: 79, period: 6, group: 11, mass: 196.97, electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', category: 'metal-contact', description: 'Metal nobre. Excelente condutor, não oxida.', electronics: 'Contatos de alta confiabilidade, wire bonding, conectores. Caro mas inerte.' },
  { symbol: 'Hg', name: 'Mercúrio', number: 80, period: 6, group: 12, mass: 200.59, electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²' },
  { symbol: 'Tl', name: 'Tálio', number: 81, period: 6, group: 13, mass: 204.38, electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹' },
  { symbol: 'Pb', name: 'Chumbo', number: 82, period: 6, group: 14, mass: 207.2, electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', category: 'other', description: 'Metal pesado. Componente de PbTe, PbS.', electronics: 'PbTe para termelétricos. PbS para detectores infravermelhos.' },
  { symbol: 'Bi', name: 'Bismuto', number: 83, period: 6, group: 15, mass: 208.98, electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', category: 'dopant-n', description: 'Metal pesado. Dopante tipo-n em Si.', electronics: 'Usado em aplicações específicas devido ao seu tamanho atômico grande.' },
  { symbol: 'Po', name: 'Polônio', number: 84, period: 6, group: 16, mass: 209, electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴' },
  { symbol: 'At', name: 'Astato', number: 85, period: 6, group: 17, mass: 210, electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵' },
  { symbol: 'Rn', name: 'Radônio', number: 86, period: 6, group: 18, mass: 222, electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶' },
  
  // Período 7
  { symbol: 'Fr', name: 'Frâncio', number: 87, period: 7, group: 1, mass: 223, electronConfig: '[Rn] 7s¹' },
  { symbol: 'Ra', name: 'Rádio', number: 88, period: 7, group: 2, mass: 226, electronConfig: '[Rn] 7s²' },
  { symbol: 'Ac', name: 'Actínio', number: 89, period: 7, group: 3, mass: 227, electronConfig: '[Rn] 6d¹ 7s²' },
  { symbol: 'Rf', name: 'Rutherfórdio', number: 104, period: 7, group: 4, mass: 267, electronConfig: '[Rn] 5f¹⁴ 6d² 7s²' },
  { symbol: 'Db', name: 'Dúbnio', number: 105, period: 7, group: 5, mass: 268, electronConfig: '[Rn] 5f¹⁴ 6d³ 7s²' },
  { symbol: 'Sg', name: 'Seabórgio', number: 106, period: 7, group: 6, mass: 269, electronConfig: '[Rn] 5f¹⁴ 6d⁴ 7s²' },
  { symbol: 'Bh', name: 'Bóhrio', number: 107, period: 7, group: 7, mass: 270, electronConfig: '[Rn] 5f¹⁴ 6d⁵ 7s²' },
  { symbol: 'Hs', name: 'Hássio', number: 108, period: 7, group: 8, mass: 269, electronConfig: '[Rn] 5f¹⁴ 6d⁶ 7s²' },
  { symbol: 'Mt', name: 'Meitnério', number: 109, period: 7, group: 9, mass: 278, electronConfig: '[Rn] 5f¹⁴ 6d⁷ 7s²' },
  { symbol: 'Ds', name: 'Darmstádtio', number: 110, period: 7, group: 10, mass: 281, electronConfig: '[Rn] 5f¹⁴ 6d⁸ 7s²' },
  { symbol: 'Rg', name: 'Roentgênio', number: 111, period: 7, group: 11, mass: 282, electronConfig: '[Rn] 5f¹⁴ 6d⁹ 7s²' },
  { symbol: 'Cn', name: 'Copernício', number: 112, period: 7, group: 12, mass: 285, electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s²' },
  { symbol: 'Nh', name: 'Nihônio', number: 113, period: 7, group: 13, mass: 286, electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹' },
  { symbol: 'Fl', name: 'Fleróvio', number: 114, period: 7, group: 14, mass: 289, electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²' },
  { symbol: 'Mc', name: 'Moscóvio', number: 115, period: 7, group: 15, mass: 290, electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³' },
  { symbol: 'Lv', name: 'Livermório', number: 116, period: 7, group: 16, mass: 293, electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴' },
  { symbol: 'Ts', name: 'Tenesso', number: 117, period: 7, group: 17, mass: 294, electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵' },
  { symbol: 'Og', name: 'Oganessônio', number: 118, period: 7, group: 18, mass: 294, electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶' },
  
  // Lantanídeos (58-71)
  { symbol: 'Ce', name: 'Cério', number: 58, period: 6, group: 3, mass: 140.12, electronConfig: '[Xe] 4f¹ 5d¹ 6s²' },
  { symbol: 'Pr', name: 'Praseodímio', number: 59, period: 6, group: 3, mass: 140.91, electronConfig: '[Xe] 4f³ 6s²' },
  { symbol: 'Nd', name: 'Neodímio', number: 60, period: 6, group: 3, mass: 144.24, electronConfig: '[Xe] 4f⁴ 6s²' },
  { symbol: 'Pm', name: 'Promécio', number: 61, period: 6, group: 3, mass: 145, electronConfig: '[Xe] 4f⁵ 6s²' },
  { symbol: 'Sm', name: 'Samário', number: 62, period: 6, group: 3, mass: 150.36, electronConfig: '[Xe] 4f⁶ 6s²' },
  { symbol: 'Eu', name: 'Európio', number: 63, period: 6, group: 3, mass: 151.96, electronConfig: '[Xe] 4f⁷ 6s²' },
  { symbol: 'Gd', name: 'Gadolínio', number: 64, period: 6, group: 3, mass: 157.25, electronConfig: '[Xe] 4f⁷ 5d¹ 6s²' },
  { symbol: 'Tb', name: 'Térbio', number: 65, period: 6, group: 3, mass: 158.93, electronConfig: '[Xe] 4f⁹ 6s²' },
  { symbol: 'Dy', name: 'Disprósio', number: 66, period: 6, group: 3, mass: 162.50, electronConfig: '[Xe] 4f¹⁰ 6s²' },
  { symbol: 'Ho', name: 'Hólmio', number: 67, period: 6, group: 3, mass: 164.93, electronConfig: '[Xe] 4f¹¹ 6s²' },
  { symbol: 'Er', name: 'Érbio', number: 68, period: 6, group: 3, mass: 167.26, electronConfig: '[Xe] 4f¹² 6s²' },
  { symbol: 'Tm', name: 'Túlio', number: 69, period: 6, group: 3, mass: 168.93, electronConfig: '[Xe] 4f¹³ 6s²' },
  { symbol: 'Yb', name: 'Itérbio', number: 70, period: 6, group: 3, mass: 173.05, electronConfig: '[Xe] 4f¹⁴ 6s²' },
  { symbol: 'Lu', name: 'Lutécio', number: 71, period: 6, group: 3, mass: 174.97, electronConfig: '[Xe] 4f¹⁴ 5d¹ 6s²' },
  
  // Actinídeos (90-103)
  { symbol: 'Th', name: 'Tório', number: 90, period: 7, group: 3, mass: 232.04, electronConfig: '[Rn] 6d² 7s²' },
  { symbol: 'Pa', name: 'Protactínio', number: 91, period: 7, group: 3, mass: 231.04, electronConfig: '[Rn] 5f² 6d¹ 7s²' },
  { symbol: 'U', name: 'Urânio', number: 92, period: 7, group: 3, mass: 238.03, electronConfig: '[Rn] 5f³ 6d¹ 7s²' },
  { symbol: 'Np', name: 'Neptúnio', number: 93, period: 7, group: 3, mass: 237, electronConfig: '[Rn] 5f⁴ 6d¹ 7s²' },
  { symbol: 'Pu', name: 'Plutônio', number: 94, period: 7, group: 3, mass: 244, electronConfig: '[Rn] 5f⁶ 7s²' },
  { symbol: 'Am', name: 'Amerício', number: 95, period: 7, group: 3, mass: 243, electronConfig: '[Rn] 5f⁷ 7s²' },
  { symbol: 'Cm', name: 'Cúrio', number: 96, period: 7, group: 3, mass: 247, electronConfig: '[Rn] 5f⁷ 6d¹ 7s²' },
  { symbol: 'Bk', name: 'Berquélio', number: 97, period: 7, group: 3, mass: 247, electronConfig: '[Rn] 5f⁹ 7s²' },
  { symbol: 'Cf', name: 'Califórnio', number: 98, period: 7, group: 3, mass: 251, electronConfig: '[Rn] 5f¹⁰ 7s²' },
  { symbol: 'Es', name: 'Einsteinio', number: 99, period: 7, group: 3, mass: 252, electronConfig: '[Rn] 5f¹¹ 7s²' },
  { symbol: 'Fm', name: 'Férmio', number: 100, period: 7, group: 3, mass: 257, electronConfig: '[Rn] 5f¹² 7s²' },
  { symbol: 'Md', name: 'Mendelévio', number: 101, period: 7, group: 3, mass: 258, electronConfig: '[Rn] 5f¹³ 7s²' },
  { symbol: 'No', name: 'Nobélio', number: 102, period: 7, group: 3, mass: 259, electronConfig: '[Rn] 5f¹⁴ 7s²' },
  { symbol: 'Lr', name: 'Laurêncio', number: 103, period: 7, group: 3, mass: 266, electronConfig: '[Rn] 5f¹⁴ 7s² 7p¹' },
];

/**
 * Layout correto da tabela periódica (18 colunas)
 * null indica espaço vazio
 */
const PERIODIC_TABLE_LAYOUT = [
  // Período 1
  [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'H', null, 'He'],
  // Período 2
  ['Li', 'Be', null, null, null, null, null, null, null, null, null, null, 'B', 'C', 'N', 'O', null, null, null, 'F', 'Ne'],
  // Período 3
  ['Na', 'Mg', null, null, null, null, null, null, null, null, null, null, 'Al', 'Si', 'P', 'S', null, null, null, 'Cl', 'Ar'],
  // Período 4
  ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
  // Período 5
  ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
  // Período 6
  ['Cs', 'Ba', 'La', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn'],
  // Período 7
  ['Fr', 'Ra', 'Ac', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'],
  // Lantanídeos (separados)
  [null, null, null, 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', null, null],
  // Actinídeos (separados)
  [null, null, null, 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr', null, null],
];

const CATEGORY_COLORS = {
  'semiconductor': { bg: '#3b82f6', text: '#ffffff', label: 'Semicondutor Elementar' },
  'semiconductor-compound': { bg: '#8b5cf6', text: '#ffffff', label: 'Semicondutor Composto' },
  'dopant-n': { bg: '#ef4444', text: '#ffffff', label: 'Dopante Tipo-N' },
  'dopant-p': { bg: '#f97316', text: '#ffffff', label: 'Dopante Tipo-P' },
  'metal-contact': { bg: '#eab308', text: '#000000', label: 'Metal de Contato' },
  'dielectric': { bg: '#22c55e', text: '#ffffff', label: 'Dielétrico/Óxido' },
  'other': { bg: '#6b7280', text: '#ffffff', label: 'Outro Relevante' },
  'default': { bg: '#374151', text: '#9ca3af', label: 'Elemento Comum' },
};

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const tableRef = useRef(null);

  const handleElementClick = (element, event) => {
    event.stopPropagation();
    if (selectedElement?.symbol === element?.symbol) {
      setSelectedElement(null);
    } else {
      setSelectedElement(element);
      if (element) {
        log_event('INFO', 'Elemento selecionado', { element: element.symbol, category: element.category || 'default' });
      }
    }
  };

  const handleOutsideClick = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setSelectedElement(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const getElementData = (symbol) => {
    return ALL_ELEMENTS.find(e => e.symbol === symbol) || null;
  };

  const filteredElements = selectedCategory === 'all' 
    ? ALL_ELEMENTS 
    : ALL_ELEMENTS.filter(e => e.category === selectedCategory);

  const categories = [
    { id: 'all', label: '📋 Todos' },
    { id: 'semiconductor', label: '💎 Semicondutores' },
    { id: 'semiconductor-compound', label: '🔮 Semicondutores Compostos' },
    { id: 'dopant-n', label: '🔴 Dopantes N' },
    { id: 'dopant-p', label: '🟠 Dopantes P' },
    { id: 'metal-contact', label: '🥇 Metais' },
    { id: 'dielectric', label: '🟢 Dielétricos' },
    { id: 'other', label: '⚙️ Outros' },
  ];

  return (
    <div className="periodic-table-container" ref={tableRef}>
      <h2>⚛️ Tabela Periódica para Eletrônica</h2>
      <p className="intro-text">
        Tabela periódica completa com destaque para elementos semicondutores, dopantes e outros elementos 
        essenciais na fabricação de componentes eletrônicos e microeletrônicos. Clique em um elemento para ver detalhes.
      </p>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-filter ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="periodic-table-wrapper">
        <div className="periodic-table">
          {PERIODIC_TABLE_LAYOUT.map((row, periodIndex) => (
            <div key={periodIndex} className="period-row">
              {row.map((symbol, groupIndex) => {
                if (!symbol) return <div key={groupIndex} className="element-empty" />;
                
                const element = getElementData(symbol);
                const hasCategory = element && element.category;
                const isHighlighted = hasCategory && (selectedCategory === 'all' || element.category === selectedCategory);
                const colorScheme = hasCategory ? CATEGORY_COLORS[element.category] : CATEGORY_COLORS.default;
                
                return (
                  <div
                    key={symbol}
                    className={`element-cell ${isHighlighted ? 'highlighted' : ''} ${hasCategory ? 'has-data' : 'no-data'}`}
                    style={{
                      backgroundColor: isHighlighted ? colorScheme.bg : colorScheme.bg,
                      color: isHighlighted ? colorScheme.text : colorScheme.text,
                      opacity: isHighlighted ? 1 : 0.5,
                    }}
                    onClick={(e) => handleElementClick(element, e)}
                  >
                    <div className="element-number">{element?.number || ''}</div>
                    <div className="element-symbol">{symbol}</div>
                    <div className="element-name">{element?.name || ''}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedElement && (
        <div className="element-tooltip locked">
          <div className="tooltip-header">
            <span className="tooltip-symbol">{selectedElement.symbol}</span>
            <span className="tooltip-name">{selectedElement.name}</span>
            <span className="tooltip-number">Z = {selectedElement.number}</span>
            <button className="tooltip-close" onClick={() => setSelectedElement(null)}>✕</button>
          </div>
          {selectedElement.category && (
            <div className="tooltip-category">
              <span 
                className="category-badge"
                style={{
                  backgroundColor: CATEGORY_COLORS[selectedElement.category]?.bg || '#6b7280',
                  color: CATEGORY_COLORS[selectedElement.category]?.text || '#ffffff',
                }}
              >
                {CATEGORY_COLORS[selectedElement.category]?.label || 'Elemento'}
              </span>
            </div>
          )}
          {selectedElement.description && (
            <div className="tooltip-section">
              <h4>📋 Descrição</h4>
              <p>{selectedElement.description}</p>
            </div>
          )}
          {selectedElement.electronics && (
            <div className="tooltip-section">
              <h4>⚡ Aplicação em Eletrônica</h4>
              <p>{selectedElement.electronics}</p>
            </div>
          )}
          <div className="tooltip-details">
            <div className="detail-item">
              <span className="detail-label">Massa Atômica:</span>
              <span className="detail-value">{selectedElement.mass} u</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Configuração Eletrônica:</span>
              <span className="detail-value">{selectedElement.electronConfig}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Período:</span>
              <span className="detail-value">{selectedElement.period}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Grupo:</span>
              <span className="detail-value">{selectedElement.group}</span>
            </div>
          </div>
        </div>
      )}

      <div className="legend">
        <h3>🎨 Legenda de Cores</h3>
        <div className="legend-grid">
          {Object.entries(CATEGORY_COLORS).filter(([key]) => key !== 'default').map(([key, color]) => (
            <div key={key} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: color.bg, color: color.text }}
              >
                {color.label.charAt(0)}
              </div>
              <span className="legend-label">{color.label}</span>
            </div>
          ))}
          <div className="legend-item">
            <div 
              className="legend-color"
              style={{ backgroundColor: CATEGORY_COLORS.default.bg, color: CATEGORY_COLORS.default.text, opacity: 0.5 }}
            >
              ?
            </div>
            <span className="legend-label">Elemento Comum (menos visível)</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>📚 Informações Adicionais</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>💎 Semicondutores Elementares</h4>
            <p>Silício (Si) e Germânio (Ge) são os semicondutores elementares mais importantes. Si domina a indústria devido à sua abundância, baixo custo e óxido nativo (SiO₂) de excelente qualidade.</p>
          </div>
          <div className="info-card">
            <h4>🔮 Semicondutores Compostos</h4>
            <p>Compostos III-V (GaAs, InP, GaN) e II-VI (CdTe, ZnSe) oferecem propriedades superiores para optoeletrônica, alta frequência e aplicações especiais. GaN revolucionou LEDs azuis e brancos.</p>
          </div>
          <div className="info-card">
            <h4>🎯 Dopagem</h4>
            <p>Elementos do grupo 13 (B, Al, Ga, In) são dopantes tipo-p (aceitadores). Elementos do grupo 15 (P, As, Sb, Bi) são dopantes tipo-n (doadores). A dopagem controla a condutividade dos semicondutores.</p>
          </div>
          <div className="info-card">
            <h4>🥇 Metais de Contato</h4>
            <p>Cobre (Cu), Alumínio (Al), Ouro (Au), Prata (Ag) e Tungstênio (W) são usados em interconexões, contatos e vias. A escolha depende de resistividade, confiabilidade e processo de fabricação.</p>
          </div>
          <div className="info-card">
            <h4>🟢 Dielétricos</h4>
            <p>SiO₂ foi o dielétrico padrão por décadas. Em nós avançados (&lt;45nm), materiais de alta-k como HfO₂ e ZrO₂ substituem SiO₂ como gate dielectric para reduzir corrente de leakage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
