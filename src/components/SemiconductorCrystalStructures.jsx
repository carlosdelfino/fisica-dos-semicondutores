import React, { useState } from 'react';
import { log_event } from '../physics/formulas.js';
import CrystalLearningObjectives from './CrystalLearningObjectives.jsx';

/**
 * Componente que apresenta estruturas cristalinas de semicondutores
 * Mostra: tipos de cristais, células unitárias, estrutura diamante, zincblende, índices de Miller
 */
export default function SemiconductorCrystalStructures() {
  const [activePanel, setActivePanel] = useState('crystal-types');

  const panels = [
    { id: 'crystal-types', title: 'Tipos de Cristais', icon: '💎' },
    { id: 'unit-cells', title: 'Células Unitárias', icon: '📐' },
    { id: 'diamond-structure', title: 'Estrutura Diamante', icon: '♦️' },
    { id: 'zincblende', title: 'Estrutura Zincblende', icon: '🔷' },
    { id: 'miller-indices', title: 'Índices de Miller', icon: '📊' },
    { id: 'imperfections', title: 'Imperfeições', icon: '⚠️' },
    { id: 'learning-objectives', title: 'Objetivos de Aprendizado', icon: '🎯' }
  ];

  return (
    <div className="semiconductor-crystal-structures">
      <div className="panel-navigation">
        {panels.map(panel => (
          <button
            key={panel.id}
            className={`panel-btn ${activePanel === panel.id ? 'active' : ''}`}
            onClick={() => {
              setActivePanel(panel.id);
              log_event('NAV', `Navegou para: ${panel.title}`);
            }}
          >
            <span className="panel-icon">{panel.icon}</span>
            <span className="panel-label">{panel.title}</span>
          </button>
        ))}
      </div>

      <div className="panel-content">
        {activePanel === 'crystal-types' && <CrystalTypesPanel />}
        {activePanel === 'unit-cells' && <UnitCellsPanel />}
        {activePanel === 'diamond-structure' && <DiamondStructurePanel />}
        {activePanel === 'zincblende' && <ZincblendePanel />}
        {activePanel === 'miller-indices' && <MillerIndicesPanel />}
        {activePanel === 'imperfections' && <ImperfectionsPanel />}
        {activePanel === 'learning-objectives' && <CrystalLearningObjectives />}
      </div>
    </div>
  );
}

// Painel: Tipos de Cristais
function CrystalTypesPanel() {
  return (
    <div className="subpanel">
      <h2>Tipos de Estruturas Cristalinas</h2>
      <p className="description">
        Os materiais semicondutores podem existir em diferentes formas cristalinas, 
        cada uma com características distintas que afetam suas propriedades elétricas.
      </p>

      <div className="figures-grid">
        {/* Amorfo */}
        <div className="figure-card">
          <svg viewBox="0 0 300 250" className="figure-svg">
            <rect width="300" height="250" fill="#f8f9fa"/>
            {/* Irregular shape */}
            <path d="M 50,125 C 30,55 100,5 200,25 C 300,45 370,95 350,175 C 330,245 250,265 150,225 C 70,205 40,155 50,125 Z" 
                  fill="none" stroke="#3b82f6" strokeWidth="2"/>
            {/* Random atoms */}
            <circle cx="80" cy="80" r="6" fill="#1e293b"/>
            <circle cx="120" cy="100" r="6" fill="#1e293b"/>
            <circle cx="160" cy="70" r="6" fill="#1e293b"/>
            <circle cx="200" cy="130" r="6" fill="#1e293b"/>
            <circle cx="90" cy="150" r="6" fill="#1e293b"/>
            <circle cx="140" cy="180" r="6" fill="#1e293b"/>
            <circle cx="220" cy="170" r="6" fill="#1e293b"/>
            <circle cx="70" cy="130" r="6" fill="#1e293b"/>
            <circle cx="180" cy="140" r="6" fill="#1e293b"/>
            <circle cx="130" cy="50" r="6" fill="#1e293b"/>
            <circle cx="240" cy="80" r="6" fill="#1e293b"/>
            <circle cx="60" cy="190" r="6" fill="#1e293b"/>
            <text x="150" y="235" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              (a) Amorfo
            </text>
          </svg>
          <div className="figure-description">
            <h3>Estrutura Amorfa</h3>
            <p>
              Átomos distribuídos aleatoriamente, sem ordem de longo alcance. 
              Semelhante a um líquido, mas em estado sólido. Exemplo: vidro.
            </p>
          </div>
        </div>

        {/* Policristalino */}
        <div className="figure-card">
          <svg viewBox="0 0 300 250" className="figure-svg">
            <rect width="300" height="250" fill="#f8f9fa"/>
            {/* Irregular shape with grain boundaries */}
            <path d="M 50,125 C 30,55 100,5 200,25 C 300,45 370,95 350,175 C 330,245 250,265 150,225 C 70,205 40,155 50,125 Z" 
                  fill="none" stroke="#3b82f6" strokeWidth="2"/>
            {/* Grain boundaries */}
            <line x1="100" y1="30" x2="80" y2="200" stroke="#1e293b" strokeWidth="2"/>
            <line x1="200" y1="30" x2="220" y2="200" stroke="#1e293b" strokeWidth="2"/>
            {/* Grain 1 - ordered atoms */}
            <circle cx="60" cy="60" r="5" fill="#1e293b"/>
            <circle cx="80" cy="60" r="5" fill="#1e293b"/>
            <circle cx="100" cy="60" r="5" fill="#1e293b"/>
            <circle cx="60" cy="80" r="5" fill="#1e293b"/>
            <circle cx="80" cy="80" r="5" fill="#1e293b"/>
            <circle cx="100" cy="80" r="5" fill="#1e293b"/>
            <circle cx="60" cy="100" r="5" fill="#1e293b"/>
            <circle cx="80" cy="100" r="5" fill="#1e293b"/>
            <circle cx="100" cy="100" r="5" fill="#1e293b"/>
            {/* Grain 2 - different orientation */}
            <circle cx="130" cy="70" r="5" fill="#1e293b"/>
            <circle cx="150" cy="60" r="5" fill="#1e293b"/>
            <circle cx="170" cy="50" r="5" fill="#1e293b"/>
            <circle cx="140" cy="90" r="5" fill="#1e293b"/>
            <circle cx="160" cy="80" r="5" fill="#1e293b"/>
            <circle cx="180" cy="70" r="5" fill="#1e293b"/>
            <circle cx="150" cy="110" r="5" fill="#1e293b"/>
            <circle cx="170" cy="100" r="5" fill="#1e293b"/>
            <circle cx="190" cy="90" r="5" fill="#1e293b"/>
            {/* Grain 3 - another orientation */}
            <circle cx="220" cy="80" r="5" fill="#1e293b"/>
            <circle cx="240" cy="70" r="5" fill="#1e293b"/>
            <circle cx="260" cy="60" r="5" fill="#1e293b"/>
            <circle cx="230" cy="100" r="5" fill="#1e293b"/>
            <circle cx="250" cy="90" r="5" fill="#1e293b"/>
            <circle cx="270" cy="80" r="5" fill="#1e293b"/>
            <circle cx="240" cy="120" r="5" fill="#1e293b"/>
            <circle cx="260" cy="110" r="5" fill="#1e293b"/>
            <circle cx="280" cy="100" r="5" fill="#1e293b"/>
            <text x="150" y="235" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              (b) Policristalino
            </text>
          </svg>
          <div className="figure-description">
            <h3>Estrutura Policristalina</h3>
            <p>
              Muitos pequenos cristais (grãos) com orientações aleatórias. 
              Cada grão tem ordem interna, mas a orientação varia entre grãos. 
              A maioria dos metais é policristalina.
            </p>
          </div>
        </div>

        {/* Monocristalino */}
        <div className="figure-card">
          <svg viewBox="0 0 300 250" className="figure-svg">
            <rect width="300" height="250" fill="#f8f9fa"/>
            {/* Irregular shape */}
            <path d="M 50,125 C 30,55 100,5 200,25 C 300,45 370,95 350,175 C 330,245 250,265 150,225 C 70,205 40,155 50,125 Z" 
                  fill="none" stroke="#3b82f6" strokeWidth="2"/>
            {/* Ordered atoms throughout */}
            {[...Array(5)].map((_, i) => (
              [...Array(5)].map((_, j) => (
                <circle 
                  key={`${i}-${j}`} 
                  cx={60 + i * 40} 
                  cy={50 + j * 35} 
                  r="5" 
                  fill="#1e293b"
                />
              ))
            ))}
            <text x="150" y="235" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              (c) Monocristalino
            </text>
          </svg>
          <div className="figure-description">
            <h3>Estrutura Monocristalina</h3>
            <p>
              Ordem cristalina contínua em todo o material. 
              Átomos arranjados em padrão repetitivo consistente. 
              Wafers de silício usados em semicondutores são monocristalinos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Painel: Células Unitárias
function UnitCellsPanel() {
  return (
    <div className="subpanel">
      <h2>Células Unitárias Básicas</h2>
      <p className="description">
        A célula unitária é um pequeno volume do cristal usado para reproduzir todo o cristal. 
        Três células unitárias básicas são: cúbica simples, cúbica centrada no corpo e cúbica centrada na face.
      </p>

      <div className="figures-grid">
        {/* Simple Cubic */}
        <div className="figure-card">
          <svg viewBox="0 0 300 280" className="figure-svg">
            <rect width="300" height="280" fill="#f8f9fa"/>
            <text x="150" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              (a) Cúbica Simples
            </text>
            {/* Cube */}
            <g transform="translate(100, 50)">
              {/* Front face */}
              <rect x="0" y="0" width="100" height="100" fill="none" stroke="#3b82f6" strokeWidth="2"/>
              {/* Back face (dashed) */}
              <rect x="30" y="30" width="100" height="100" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5"/>
              {/* Connecting lines */}
              <line x1="0" y1="0" x2="30" y2="30" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="100" y1="0" x2="130" y2="30" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="0" y1="100" x2="30" y2="130" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="100" y1="100" x2="130" y2="130" stroke="#3b82f6" strokeWidth="2"/>
              {/* Corner atoms */}
              <circle cx="0" cy="0" r="8" fill="#1e293b"/>
              <circle cx="100" cy="0" r="8" fill="#1e293b"/>
              <circle cx="0" cy="100" r="8" fill="#1e293b"/>
              <circle cx="100" cy="100" r="8" fill="#1e293b"/>
              {/* Back corner atoms */}
              <circle cx="30" cy="30" r="6" fill="#1e293b" opacity="0.6"/>
              <circle cx="130" cy="30" r="6" fill="#1e293b" opacity="0.6"/>
              <circle cx="30" cy="130" r="6" fill="#1e293b" opacity="0.6"/>
              <circle cx="130" cy="130" r="6" fill="#1e293b" opacity="0.6"/>
              {/* Lattice parameter */}
              <text x="50" y="120" textAnchor="middle" fontSize="12" fill="#3b82f6">a</text>
            </g>
            <text x="150" y="250" textAnchor="middle" fontSize="11" fill="#334155">
              Átomos apenas nos cantos
            </text>
          </svg>
          <div className="figure-description">
            <h3>Cúbica Simples (SC)</h3>
            <p>
              Átomos localizados apenas nos 8 cantos do cubo. 
              Cada canto é compartilhado por 8 células unitárias adjacentes.
              Coordenação: 6
            </p>
          </div>
        </div>

        {/* Body-Centered Cubic */}
        <div className="figure-card">
          <svg viewBox="0 0 300 280" className="figure-svg">
            <rect width="300" height="280" fill="#f8f9fa"/>
            <text x="150" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              (b) Cúbica Centrada no Corpo (BCC)
            </text>
            {/* Cube */}
            <g transform="translate(100, 50)">
              {/* Front face */}
              <rect x="0" y="0" width="100" height="100" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
              {/* Back face (dashed) */}
              <rect x="30" y="30" width="100" height="100" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5"/>
              {/* Connecting lines */}
              <line x1="0" y1="0" x2="30" y2="30" stroke="#8b5cf6" strokeWidth="2"/>
              <line x1="100" y1="0" x2="130" y2="30" stroke="#8b5cf6" strokeWidth="2"/>
              <line x1="0" y1="100" x2="30" y2="130" stroke="#8b5cf6" strokeWidth="2"/>
              <line x1="100" y1="100" x2="130" y2="130" stroke="#8b5cf6" strokeWidth="2"/>
              {/* Corner atoms */}
              <circle cx="0" cy="0" r="8" fill="#1e293b"/>
              <circle cx="100" cy="0" r="8" fill="#1e293b"/>
              <circle cx="0" cy="100" r="8" fill="#1e293b"/>
              <circle cx="100" cy="100" r="8" fill="#1e293b"/>
              {/* Back corner atoms */}
              <circle cx="30" cy="30" r="6" fill="#1e293b" opacity="0.6"/>
              <circle cx="130" cy="30" r="6" fill="#1e293b" opacity="0.6"/>
              <circle cx="30" cy="130" r="6" fill="#1e293b" opacity="0.6"/>
              <circle cx="130" cy="130" r="6" fill="#1e293b" opacity="0.6"/>
              {/* Center atom */}
              <circle cx="65" cy="65" r="10" fill="#8b5cf6"/>
              {/* Lattice parameter */}
              <text x="50" y="120" textAnchor="middle" fontSize="12" fill="#8b5cf6">a</text>
            </g>
            <text x="150" y="250" textAnchor="middle" fontSize="11" fill="#334155">
              Átomo adicional no centro
            </text>
          </svg>
          <div className="figure-description">
            <h3>Cúbica Centrada no Corpo (BCC)</h3>
            <p>
              Átomos nos 8 cantos + 1 átomo no centro do cubo.
              Exemplo: Ferro (α), Cromo, Tungstênio.
              Coordenação: 8
            </p>
          </div>
        </div>

        {/* Face-Centered Cubic */}
        <div className="figure-card">
          <svg viewBox="0 0 300 280" className="figure-svg">
            <rect width="300" height="280" fill="#f8f9fa"/>
            <text x="150" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              (c) Cúbica Centrada na Face (FCC)
            </text>
            {/* Cube */}
            <g transform="translate(100, 50)">
              {/* Front face */}
              <rect x="0" y="0" width="100" height="100" fill="none" stroke="#10b981" strokeWidth="2"/>
              {/* Back face (dashed) */}
              <rect x="30" y="30" width="100" height="100" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5"/>
              {/* Connecting lines */}
              <line x1="0" y1="0" x2="30" y2="30" stroke="#10b981" strokeWidth="2"/>
              <line x1="100" y1="0" x2="130" y2="30" stroke="#10b981" strokeWidth="2"/>
              <line x1="0" y1="100" x2="30" y2="130" stroke="#10b981" strokeWidth="2"/>
              <line x1="100" y1="100" x2="130" y2="130" stroke="#10b981" strokeWidth="2"/>
              {/* Corner atoms */}
              <circle cx="0" cy="0" r="8" fill="#1e293b"/>
              <circle cx="100" cy="0" r="8" fill="#1e293b"/>
              <circle cx="0" cy="100" r="8" fill="#1e293b"/>
              <circle cx="100" cy="100" r="8" fill="#1e293b"/>
              {/* Back corner atoms */}
              <circle cx="30" cy="30" r="6" fill="#1e293b" opacity="0.6"/>
              <circle cx="130" cy="30" r="6" fill="#1e293b" opacity="0.6"/>
              <circle cx="30" cy="130" r="6" fill="#1e293b" opacity="0.6"/>
              <circle cx="130" cy="130" r="6" fill="#1e293b" opacity="0.6"/>
              {/* Face-centered atoms */}
              <circle cx="50" cy="0" r="7" fill="#10b981"/>
              <circle cx="50" cy="100" r="7" fill="#10b981"/>
              <circle cx="0" cy="50" r="7" fill="#10b981"/>
              <circle cx="100" cy="50" r="7" fill="#10b981"/>
              {/* Back face atoms */}
              <circle cx="80" cy="30" r="5" fill="#10b981" opacity="0.6"/>
              <circle cx="80" cy="130" r="5" fill="#10b981" opacity="0.6"/>
              <circle cx="30" cy="80" r="5" fill="#10b981" opacity="0.6"/>
              <circle cx="130" cy="80" r="5" fill="#10b981" opacity="0.6"/>
              {/* Lattice parameter */}
              <text x="50" y="120" textAnchor="middle" fontSize="12" fill="#10b981">a</text>
            </g>
            <text x="150" y="250" textAnchor="middle" fontSize="11" fill="#334155">
              Átomos nos cantos e faces
            </text>
          </svg>
          <div className="figure-description">
            <h3>Cúbica Centrada na Face (FCC)</h3>
            <p>
              Átomos nos 8 cantos + 1 átomo no centro de cada face.
              Base para estrutura diamante e zincblende.
              Coordenação: 12
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Painel: Estrutura Diamante
function DiamondStructurePanel() {
  return (
    <div className="subpanel">
      <h2>Estrutura Diamante do Silício</h2>
      <p className="description">
        O silício tem a estrutura cristalina diamante. Átomos são formados em configuração 
        tetraédrica com quatro átomos vizinhos mais próximos. Esta estrutura é fundamental 
        para as propriedades eletrônicas do silício.
      </p>

      <div className="figures-grid">
        {/* Diamond Unit Cell */}
        <div className="figure-card">
          <svg viewBox="0 0 350 320" className="figure-svg">
            <rect width="350" height="320" fill="#f8f9fa"/>
            <text x="175" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              Célula Unitária da Estrutura Diamante
            </text>
            <g transform="translate(75, 40)">
              {/* Cube outline */}
              <rect x="0" y="0" width="200" height="200" fill="none" stroke="#3b82f6" strokeWidth="2"/>
              {/* Back cube (dashed) */}
              <rect x="40" y="40" width="200" height="200" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5"/>
              {/* Connecting lines */}
              <line x1="0" y1="0" x2="40" y2="40" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="200" y1="0" x2="240" y2="40" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="0" y1="200" x2="40" y2="240" stroke="#3b82f6" strokeWidth="2"/>
              <line x1="200" y1="200" x2="240" y2="240" stroke="#3b82f6" strokeWidth="2"/>
              
              {/* Corner atoms */}
              <circle cx="0" cy="0" r="10" fill="#1e293b"/>
              <circle cx="200" cy="0" r="10" fill="#1e293b"/>
              <circle cx="0" cy="200" r="10" fill="#1e293b"/>
              <circle cx="200" cy="200" r="10" fill="#1e293b"/>
              
              {/* Face-centered atoms */}
              <circle cx="100" cy="0" r="9" fill="#3b82f6"/>
              <circle cx="100" cy="200" r="9" fill="#3b82f6"/>
              <circle cx="0" cy="100" r="9" fill="#3b82f6"/>
              <circle cx="200" cy="100" r="9" fill="#3b82f6"/>
              
              {/* Back face atoms */}
              <circle cx="40" cy="40" r="8" fill="#1e293b" opacity="0.5"/>
              <circle cx="240" cy="40" r="8" fill="#1e293b" opacity="0.5"/>
              <circle cx="40" cy="240" r="8" fill="#1e293b" opacity="0.5"/>
              <circle cx="240" cy="240" r="8" fill="#1e293b" opacity="0.5"/>
              
              {/* Internal tetrahedral atoms */}
              <circle cx="50" cy="50" r="7" fill="#3b82f6" opacity="0.7"/>
              <circle cx="150" cy="50" r="7" fill="#3b82f6" opacity="0.7"/>
              <circle cx="50" cy="150" r="7" fill="#3b82f6" opacity="0.7"/>
              <circle cx="150" cy="150" r="7" fill="#3b82f6" opacity="0.7"/>
              
              {/* Center tetrahedral atoms */}
              <circle cx="100" cy="100" r="8" fill="#1e293b"/>
              
              {/* Tetrahedral bonds */}
              <line x1="0" y1="0" x2="50" y2="50" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3"/>
              <line x1="200" y1="0" x2="150" y2="50" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3"/>
              <line x1="0" y1="200" x2="50" y2="150" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3"/>
              <line x1="200" y1="200" x2="150" y2="150" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3,3"/>
              
              {/* Lattice parameter */}
              <text x="100" y="220" textAnchor="middle" fontSize="12" fill="#3b82f6">a</text>
            </g>
            <text x="175" y="290" textAnchor="middle" fontSize="11" fill="#334155">
              8 átomos por célula unitária
            </text>
          </svg>
          <div className="figure-description">
            <h3>Célula Unitária Diamante</h3>
            <p>
              Estrutura FCC com 4 átomos internos em posições tetraédricas.
              Cada átomo de Si tem 4 vizinhos mais próximos em geometria tetraédrica.
              Parâmetro de rede: a = 5.43 Å (silício)
            </p>
          </div>
        </div>

        {/* Tetrahedral Configuration */}
        <div className="figure-card">
          <svg viewBox="0 0 350 320" className="figure-svg">
            <rect width="350" height="320" fill="#f8f9fa"/>
            <text x="175" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              Configuração Tetraédrica
            </text>
            <g transform="translate(175, 140)">
              {/* Central atom */}
              <circle cx="0" cy="0" r="15" fill="#3b82f6"/>
              <text x="0" y="5" textAnchor="middle" fontSize="10" fill="white">Si</text>
              
              {/* 4 neighboring atoms in tetrahedral arrangement */}
              <circle cx="-60" cy="-40" r="12" fill="#1e293b"/>
              <circle cx="60" cy="-40" r="12" fill="#1e293b"/>
              <circle cx="0" cy="70" r="12" fill="#1e293b"/>
              <circle cx="0" cy="-80" r="12" fill="#1e293b"/>
              
              {/* Bonds */}
              <line x1="0" y1="0" x2="-60" y2="-40" stroke="#60a5fa" strokeWidth="2"/>
              <line x1="0" y1="0" x2="60" y2="-40" stroke="#60a5fa" strokeWidth="2"/>
              <line x1="0" y1="0" x2="0" y2="70" stroke="#60a5fa" strokeWidth="2"/>
              <line x1="0" y1="0" x2="0" y2="-80" stroke="#60a5fa" strokeWidth="2"/>
              
              {/* Bond length indicator */}
              <text x="35" y="-15" fontSize="10" fill="#3b82f6">a/4</text>
            </g>
            <text x="175" y="260" textAnchor="middle" fontSize="11" fill="#334155">
              4 vizinhos mais próximos
            </text>
            <text x="175" y="280" textAnchor="middle" fontSize="11" fill="#334155">
              Distância: a√3/4 ≈ 2.35 Å
            </text>
          </svg>
          <div className="figure-description">
            <h3>Arranjo Tetraédrico</h3>
            <p>
              Cada átomo de silício está covalentemente ligado a 4 átomos vizinhos.
              Ângulo de ligação: 109.5°
              Comprimento de ligação: 2.35 Å
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Painel: Estrutura Zincblende
function ZincblendePanel() {
  return (
    <div className="subpanel">
      <h2>Estrutura Zincblende</h2>
      <p className="description">
        Semicondutores binários (como GaAs) têm estrutura zincblende, basicamente a mesma 
        que a estrutura diamante, mas com dois tipos de átomos diferentes ocupando posições 
        alternadas da rede FCC.
      </p>

      <div className="figures-grid">
        {/* Zincblende Unit Cell */}
        <div className="figure-card">
          <svg viewBox="0 0 350 320" className="figure-svg">
            <rect width="350" height="320" fill="#f8f9fa"/>
            <text x="175" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              Célula Unitária Zincblende (GaAs)
            </text>
            <g transform="translate(75, 40)">
              {/* Cube outline */}
              <rect x="0" y="0" width="200" height="200" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
              {/* Back cube (dashed) */}
              <rect x="40" y="40" width="200" height="200" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5"/>
              {/* Connecting lines */}
              <line x1="0" y1="0" x2="40" y2="40" stroke="#8b5cf6" strokeWidth="2"/>
              <line x1="200" y1="0" x2="240" y2="40" stroke="#8b5cf6" strokeWidth="2"/>
              <line x1="0" y1="200" x2="40" y2="240" stroke="#8b5cf6" strokeWidth="2"/>
              <line x1="200" y1="200" x2="240" y2="240" stroke="#8b5cf6" strokeWidth="2"/>
              
              {/* Corner atoms - Ga */}
              <circle cx="0" cy="0" r="10" fill="#8b5cf6"/>
              <circle cx="200" cy="0" r="10" fill="#8b5cf6"/>
              <circle cx="0" cy="200" r="10" fill="#8b5cf6"/>
              <circle cx="200" cy="200" r="10" fill="#8b5cf6"/>
              
              {/* Face-centered atoms - As */}
              <circle cx="100" cy="0" r="9" fill="#a78bfa"/>
              <circle cx="100" cy="200" r="9" fill="#a78bfa"/>
              <circle cx="0" cy="100" r="9" fill="#a78bfa"/>
              <circle cx="200" cy="100" r="9" fill="#a78bfa"/>
              
              {/* Back face atoms */}
              <circle cx="40" cy="40" r="8" fill="#8b5cf6" opacity="0.5"/>
              <circle cx="240" cy="40" r="8" fill="#8b5cf6" opacity="0.5"/>
              <circle cx="40" cy="240" r="8" fill="#8b5cf6" opacity="0.5"/>
              <circle cx="240" cy="240" r="8" fill="#8b5cf6" opacity="0.5"/>
              
              {/* Internal atoms */}
              <circle cx="100" cy="100" r="10" fill="#8b5cf6"/>
              
              {/* Bonds */}
              <line x1="0" y1="0" x2="100" y2="100" stroke="#c4b5fd" strokeWidth="2"/>
              <line x1="200" y1="0" x2="100" y2="100" stroke="#c4b5fd" strokeWidth="2"/>
              <line x1="0" y1="200" x2="100" y2="100" stroke="#c4b5fd" strokeWidth="2"/>
              <line x1="200" y1="200" x2="100" y2="100" stroke="#c4b5fd" strokeWidth="2"/>
              
              {/* Lattice parameter */}
              <text x="100" y="220" textAnchor="middle" fontSize="12" fill="#8b5cf6">a</text>
            </g>
            <text x="175" y="290" textAnchor="middle" fontSize="11" fill="#334155">
              Ga (roxo) e As (lilás)
            </text>
          </svg>
          <div className="figure-description">
            <h3>Estrutura Zincblende</h3>
            <p>
              Similar ao diamante, mas com dois átomos diferentes.
              GaAs, InP, ZnS têm esta estrutura.
              Cada átomo tem 4 vizinhos do tipo oposto.
            </p>
          </div>
        </div>

        {/* Tetrahedral Bonds */}
        <div className="figure-card">
          <svg viewBox="0 0 350 320" className="figure-svg">
            <rect width="350" height="320" fill="#f8f9fa"/>
            <text x="175" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              Ligações Tetraédricas Ga-As
            </text>
            <g transform="translate(175, 140)">
              {/* Central Ga atom */}
              <circle cx="0" cy="0" r="15" fill="#8b5cf6"/>
              <text x="0" y="5" textAnchor="middle" fontSize="10" fill="white">Ga</text>
              
              {/* 4 neighboring As atoms */}
              <circle cx="-60" cy="-40" r="12" fill="#a78bfa"/>
              <text x="-60" y="-36" textAnchor="middle" fontSize="8" fill="white">As</text>
              <circle cx="60" cy="-40" r="12" fill="#a78bfa"/>
              <text x="60" y="-36" textAnchor="middle" fontSize="8" fill="white">As</text>
              <circle cx="0" cy="70" r="12" fill="#a78bfa"/>
              <text x="0" y="74" textAnchor="middle" fontSize="8" fill="white">As</text>
              <circle cx="0" cy="-80" r="12" fill="#a78bfa"/>
              <text x="0" y="-76" textAnchor="middle" fontSize="8" fill="white">As</text>
              
              {/* Bonds */}
              <line x1="0" y1="0" x2="-60" y2="-40" stroke="#c4b5fd" strokeWidth="2"/>
              <line x1="0" y1="0" x2="60" y2="-40" stroke="#c4b5fd" strokeWidth="2"/>
              <line x1="0" y1="0" x2="0" y2="70" stroke="#c4b5fd" strokeWidth="2"/>
              <line x1="0" y1="0" x2="0" y2="-80" stroke="#c4b5fd" strokeWidth="2"/>
            </g>
            <text x="175" y="260" textAnchor="middle" fontSize="11" fill="#334155">
              Ligação covalente polar
            </text>
            <text x="175" y="280" textAnchor="middle" fontSize="11" fill="#334155">
              Parâmetro de rede: a = 5.65 Å (GaAs)
            </text>
          </svg>
          <div className="figure-description">
            <h3>Ligações Ga-As</h3>
            <p>
              Ligações covalentes com caráter polar devido à diferença de eletronegatividade.
              Cada Ga ligado a 4 As, cada As ligado a 4 Ga.
              Bandgap direto: 1.42 eV
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Painel: Índices de Miller
function MillerIndicesPanel() {
  return (
    <div className="subpanel">
      <h2>Índices de Miller</h2>
      <p className="description">
        Índices de Miller são usados para descrever planos em uma rede cristalina. 
        Estes planos podem ser usados para descrever a superfície de um material semicondutor. 
        Os índices de Miller também são usados para descrever direções em um cristal.
      </p>

      <div className="figures-grid">
        {/* Miller Indices Concept */}
        <div className="figure-card">
          <svg viewBox="0 0 350 300" className="figure-svg">
            <rect width="350" height="300" fill="#f8f9fa"/>
            <text x="175" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              Plano Cristalino com Índices de Miller
            </text>
            <g transform="translate(100, 50)">
              {/* 3D axes */}
              <line x1="0" y1="150" x2="150" y2="150" stroke="#1e293b" strokeWidth="2" markerEnd="url(#arrow)"/>
              <line x1="0" y1="150" x2="50" y2="50" stroke="#1e293b" strokeWidth="2"/>
              <line x1="0" y1="150" x2="30" y2="180" stroke="#1e293b" strokeWidth="2"/>
              
              {/* Axis labels */}
              <text x="160" y="155" fontSize="12" fill="#1e293b">a</text>
              <text x="55" y="45" fontSize="12" fill="#1e293b">b</text>
              <text x="35" y="195" fontSize="12" fill="#1e293b">c</text>
              
              {/* Plane intercepts */}
              <circle cx="100" cy="150" r="4" fill="#3b82f6"/>
              <text x="100" y="170" textAnchor="middle" fontSize="10" fill="#3b82f6">3a</text>
              
              <circle cx="33" cy="83" r="4" fill="#3b82f6"/>
              <text x="45" y="75" fontSize="10" fill="#3b82f6">2b</text>
              
              <circle cx="20" cy="165" r="4" fill="#3b82f6"/>
              <text x="25" y="180" fontSize="10" fill="#3b82f6">1c</text>
              
              {/* Shaded plane */}
              <polygon points="100,150 33,83 20,165" fill="#3b82f6" opacity="0.3"/>
              <polygon points="100,150 33,83 20,165" fill="none" stroke="#3b82f6" strokeWidth="2"/>
              
              {/* Origin */}
              <circle cx="0" cy="150" r="3" fill="#1e293b"/>
              <text x="-15" y="155" fontSize="10" fill="#1e293b">0</text>
            </g>
            <text x="175" y="270" textAnchor="middle" fontSize="11" fill="#334155">
              Intercepts: 3a, 2b, 1c → Índices: (236)
            </text>
          </svg>
          <div className="figure-description">
            <h3>Conceito de Índices de Miller</h3>
            <p>
              Um plano que intercepta os eixos em h, k, l tem índices (hkl).
              Recíprocos dos interceptos, reduzidos aos menores inteiros.
              Usado para identificar orientações cristalinas específicas.
            </p>
          </div>
        </div>

        {/* Common Planes */}
        <div className="figure-card">
          <svg viewBox="0 0 350 300" className="figure-svg">
            <rect width="350" height="300" fill="#f8f9fa"/>
            <text x="175" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              Planos Comuns em Cúbico
            </text>
            
            {/* (100) plane */}
            <g transform="translate(50, 50)">
              <rect x="0" y="0" width="80" height="80" fill="none" stroke="#3b82f6" strokeWidth="2"/>
              <rect x="0" y="0" width="80" height="80" fill="#3b82f6" opacity="0.3"/>
              <text x="40" y="100" textAnchor="middle" fontSize="12" fill="#1e293b">(100)</text>
            </g>
            
            {/* (110) plane */}
            <g transform="translate(180, 50)">
              <polygon points="0,0 80,0 80,80" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
              <polygon points="0,0 80,0 80,80" fill="#8b5cf6" opacity="0.3"/>
              <text x="40" y="100" textAnchor="middle" fontSize="12" fill="#1e293b">(110)</text>
            </g>
            
            {/* (111) plane */}
            <g transform="translate(50, 170)">
              <polygon points="40,0 80,70 0,70" fill="none" stroke="#10b981" strokeWidth="2"/>
              <polygon points="40,0 80,70 0,70" fill="#10b981" opacity="0.3"/>
              <text x="40" y="90" textAnchor="middle" fontSize="12" fill="#1e293b">(111)</text>
            </g>
            
            {/* (111) plane rotated */}
            <g transform="translate(180, 170)">
              <polygon points="40,0 80,40 40,80 0,40" fill="none" stroke="#f59e0b" strokeWidth="2"/>
              <polygon points="40,0 80,40 40,80 0,40" fill="#f59e0b" opacity="0.3"/>
              <text x="40" y="100" textAnchor="middle" fontSize="12" fill="#1e293b">(111)</text>
            </g>
          </svg>
          <div className="figure-description">
            <h3>Planos Cristalinos Importantes</h3>
            <p>
              (100): Superfícies de wafers de silício
              (110): Planos de clivagem em alguns cristais
              (111): Planos de alta densidade atômica
              A escolha do plano afeta propriedades de superfície
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Painel: Imperfeições
function ImperfectionsPanel() {
  return (
    <div className="subpanel">
      <h2>Imperfeições em Semicondutores</h2>
      <p className="description">
        Imperfeições existem em materiais semicondutores. Algumas destas imperfeições são 
        lacunas, impurezas substitucionais e impurezas intersticiais. Pequenas quantidades de 
        impurezas substitucionais controladas podem alterar favoravelmente as propriedades 
        dos semicondutores, como veremos em capítulos posteriores.
      </p>

      <div className="figures-grid">
        {/* Vacancy */}
        <div className="figure-card">
          <svg viewBox="0 0 300 280" className="figure-svg">
            <rect width="300" height="280" fill="#f8f9fa"/>
            <text x="150" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              Lacuna (Vacancy)
            </text>
            <g transform="translate(100, 50)">
              {/* Regular lattice */}
              {[...Array(3)].map((_, i) => (
                [...Array(3)].map((_, j) => (
                  <circle 
                    key={`${i}-${j}`} 
                    cx={i * 50} 
                    cy={j * 50} 
                    r="10" 
                    fill="#1e293b"
                  />
                ))
              ))}
              {/* Vacancy - missing atom */}
              <circle cx="50" cy="50" r="10" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4"/>
              <text x="50" y="55" textAnchor="middle" fontSize="8" fill="#ef4444">□</text>
            </g>
            <text x="150" y="230" textAnchor="middle" fontSize="11" fill="#334155">
              Átomo ausente da rede
            </text>
            <text x="150" y="250" textAnchor="middle" fontSize="11" fill="#334155">
              Defeito pontual intrínseco
            </text>
          </svg>
          <div className="figure-description">
            <h3>Lacuna</h3>
            <p>
              Átomo faltando em um sítio da rede cristalina.
              Pode ser criado por radiação ou altas temperaturas.
              Afeta a condutividade elétrica.
            </p>
          </div>
        </div>

        {/* Substitutional Impurity */}
        <div className="figure-card">
          <svg viewBox="0 0 300 280" className="figure-svg">
            <rect width="300" height="280" fill="#f8f9fa"/>
            <text x="150" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              Impureza Substucional
            </text>
            <g transform="translate(100, 50)">
              {/* Regular lattice */}
              {[...Array(3)].map((_, i) => (
                [...Array(3)].map((_, j) => {
                  if (i === 1 && j === 1) return null;
                  return (
                    <circle 
                      key={`${i}-${j}`} 
                      cx={i * 50} 
                      cy={j * 50} 
                      r="10" 
                      fill="#1e293b"
                    />
                  );
                })
              ))}
              {/* Substitutional impurity */}
              <circle cx="50" cy="50" r="12" fill="#f59e0b"/>
              <text x="50" y="55" textAnchor="middle" fontSize="10" fill="white">P</text>
            </g>
            <text x="150" y="230" textAnchor="middle" fontSize="11" fill="#334155">
              Átomo estranho no lugar
            </text>
            <text x="150" y="250" textAnchor="middle" fontSize="11" fill="#334155">
              Base da dopagem (ex: P em Si)
            </text>
          </svg>
          <div className="figure-description">
            <h3>Impureza Substucional</h3>
            <p>
              Átomo de elemento diferente substituindo átomo da rede.
              Fundamental para dopagem de semicondutores.
              Ex: Fósforo (doador) ou Boro (aceitador) em silício.
            </p>
          </div>
        </div>

        {/* Interstitial Impurity */}
        <div className="figure-card">
          <svg viewBox="0 0 300 280" className="figure-svg">
            <rect width="300" height="280" fill="#f8f9fa"/>
            <text x="150" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1e293b">
              Impureza Intersticial
            </text>
            <g transform="translate(100, 50)">
              {/* Regular lattice */}
              {[...Array(3)].map((_, i) => (
                [...Array(3)].map((_, j) => (
                  <circle 
                    key={`${i}-${j}`} 
                    cx={i * 50} 
                    cy={j * 50} 
                    r="10" 
                    fill="#1e293b"
                  />
                ))
              ))}
              {/* Interstitial impurity */}
              <circle cx="75" cy="75" r="8" fill="#10b981"/>
              <text x="75" y="79" textAnchor="middle" fontSize="8" fill="white">Li</text>
            </g>
            <text x="150" y="230" textAnchor="middle" fontSize="11" fill="#334155">
              Átomo em espaço vazio
            </text>
            <text x="150" y="250" textAnchor="middle" fontSize="11" fill="#334155">
              Geralmente átomo pequeno (Li, H)
            </text>
          </svg>
          <div className="figure-description">
            <h3>Impureza Intersticial</h3>
            <p>
              Átomo estranho ocupando espaço intersticial da rede.
              Geralmente átomos pequenos como lítio ou hidrogênio.
              Pode causar distorção significativa da rede.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

