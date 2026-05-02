import React from 'react';
import { log_event } from '../physics/formulas.js';

/**
 * Componente SVG para estruturas de perovskites 2D
 * Mostra comparação entre estruturas com e sem distorção
 */
export default function PerovskiteStructures() {
  return (
    <div className="perovskite-structures">
      <svg viewBox="0 0 800 400" className="perovskite-diagram">
        {/* Background */}
        <rect width="800" height="400" fill="#f8f9fa"/>
        
        {/* Title */}
        <text x="400" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1e293b">
          Estruturas de Perovskites 2D: Impacto na Distorção Octaédrica
        </text>
        
        {/* Left side - With distortion */}
        <g transform="translate(50, 60)">
          <text x="150" y="20" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#dc2626">
            Com Distorção
          </text>
          
          {/* Distorted octahedron 1 */}
          <g transform="translate(80, 80)">
            {/* Octahedron faces - yellowish, distorted */}
            <polygon points="0,-40 35,-10 35,30 0,60 -35,30 -35,-10" 
                     fill="#fbbf24" stroke="#d97706" strokeWidth="2" opacity="0.7"/>
            <polygon points="0,-40 35,-10 60,0 25,-30" 
                     fill="#f59e0b" stroke="#d97706" strokeWidth="2" opacity="0.8"/>
            <polygon points="0,60 35,30 60,40 25,70" 
                     fill="#f59e0b" stroke="#d97706" strokeWidth="2" opacity="0.8"/>
            
            {/* Purple spheres at vertices */}
            <circle cx="0" cy="-40" r="8" fill="#9333ea"/>
            <circle cx="35" cy="-10" r="8" fill="#9333ea"/>
            <circle cx="35" cy="30" r="8" fill="#9333ea"/>
            <circle cx="0" cy="60" r="8" fill="#9333ea"/>
            <circle cx="-35" cy="30" r="8" fill="#9333ea"/>
            <circle cx="-35" cy="-10" r="8" fill="#9333ea"/>
            
            {/* Center sphere */}
            <circle cx="0" cy="10" r="10" fill="#7c3aed"/>
          </g>
          
          {/* Distorted octahedron 2 - connected at corner, rotated 10° out of phase */}
          <g transform="translate(170, 100) rotate(10)">
            <polygon points="0,-40 32,-12 32,28 0,60 -32,28 -32,-12" 
                     fill="#fbbf24" stroke="#d97706" strokeWidth="2" opacity="0.7"/>
            <polygon points="0,-40 32,-12 58,2 22,-32" 
                     fill="#f59e0b" stroke="#d97706" strokeWidth="2" opacity="0.8"/>
            <polygon points="0,60 32,28 58,42 22,68" 
                     fill="#f59e0b" stroke="#d97706" strokeWidth="2" opacity="0.8"/>
            
            <circle cx="0" cy="-40" r="8" fill="#9333ea"/>
            <circle cx="32" cy="-12" r="8" fill="#9333ea"/>
            <circle cx="32" cy="28" r="8" fill="#9333ea"/>
            <circle cx="0" cy="60" r="8" fill="#9333ea"/>
            <circle cx="-32" cy="28" r="8" fill="#9333ea"/>
            <circle cx="-32" cy="-12" r="8" fill="#9333ea"/>
            
            <circle cx="-2" cy="8" r="10" fill="#7c3aed"/>
          </g>
          
          {/* Connection line showing distorted angle */}
          <line x1="110" y1="80" x2="170" y2="100" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,5"/>
          
          {/* Phase indicator showing 10° rotation */}
          <path d="M 130,75 A 25,25 0 0,1 145,70" stroke="#dc2626" strokeWidth="2" fill="none"/>
          <text x="135" y="65" fontSize="10" fill="#dc2626">10°</text>
          <text x="130" y="95" fontSize="9" fill="#dc2626">fora de fase</text>
          
          {/* Wavy arrow for short exciton transport */}
          <path d="M 60,180 Q 80,170 100,180 T 140,180 T 180,180" 
                stroke="#dc2626" strokeWidth="3" fill="none" markerEnd="url(#arrowhead-red)"/>
          <text x="120" y="200" textAnchor="middle" fontSize="12" fill="#dc2626" fontWeight="bold">
            Transporte de Exciton Curto
          </text>
          <text x="120" y="215" textAnchor="middle" fontSize="10" fill="#666">
            (~100-200 nm)
          </text>
        </g>
        
        {/* Right side - Without distortion */}
        <g transform="translate(450, 60)">
          <text x="150" y="20" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#059669">
            Sem Distorção (Simétrica)
          </text>
          
          {/* Regular octahedron 1 - perfectly aligned */}
          <g transform="translate(80, 80)">
            {/* Octahedron faces - light blue, regular symmetric */}
            <polygon points="0,-40 35,-10 35,30 0,60 -35,30 -35,-10" 
                     fill="#67e8f9" stroke="#0891b2" strokeWidth="2" opacity="0.7"/>
            <polygon points="0,-40 35,-10 60,0 25,-30" 
                     fill="#22d3ee" stroke="#0891b2" strokeWidth="2" opacity="0.8"/>
            <polygon points="0,60 35,30 60,40 25,70" 
                     fill="#22d3ee" stroke="#0891b2" strokeWidth="2" opacity="0.8"/>
            
            {/* Purple spheres at vertices - perfectly positioned */}
            <circle cx="0" cy="-40" r="8" fill="#9333ea"/>
            <circle cx="35" cy="-10" r="8" fill="#9333ea"/>
            <circle cx="35" cy="30" r="8" fill="#9333ea"/>
            <circle cx="0" cy="60" r="8" fill="#9333ea"/>
            <circle cx="-35" cy="30" r="8" fill="#9333ea"/>
            <circle cx="-35" cy="-10" r="8" fill="#9333ea"/>
            
            {/* Center sphere - perfectly centered */}
            <circle cx="0" cy="10" r="10" fill="#7c3aed"/>
          </g>
          
          {/* Regular octahedron 2 - connected at corner, perfectly aligned */}
          <g transform="translate(170, 100)">
            <polygon points="0,-40 35,-10 35,30 0,60 -35,30 -35,-10" 
                     fill="#67e8f9" stroke="#0891b2" strokeWidth="2" opacity="0.7"/>
            <polygon points="0,-40 35,-10 60,0 25,-30" 
                     fill="#22d3ee" stroke="#0891b2" strokeWidth="2" opacity="0.8"/>
            <polygon points="0,60 35,30 60,40 25,70" 
                     fill="#22d3ee" stroke="#0891b2" strokeWidth="2" opacity="0.8"/>
            
            <circle cx="0" cy="-40" r="8" fill="#9333ea"/>
            <circle cx="35" cy="-10" r="8" fill="#9333ea"/>
            <circle cx="35" cy="30" r="8" fill="#9333ea"/>
            <circle cx="0" cy="60" r="8" fill="#9333ea"/>
            <circle cx="-35" cy="30" r="8" fill="#9333ea"/>
            <circle cx="-35" cy="-10" r="8" fill="#9333ea"/>
            
            <circle cx="0" cy="10" r="10" fill="#7c3aed"/>
          </g>
          
          {/* Connection line showing perfect alignment */}
          <line x1="115" y1="90" x2="170" y2="100" stroke="#059669" strokeWidth="2"/>
          
          {/* Angle indicator showing 180° */}
          <line x1="115" y1="90" x2="130" y2="90" stroke="#059669" strokeWidth="1"/>
          <line x1="170" y1="100" x2="155" y2="100" stroke="#059669" strokeWidth="1"/>
          <text x="140" y="85" fontSize="10" fill="#059669">180°</text>
          
          {/* Straight arrow for long exciton transport */}
          <line x1="60" y1="180" x2="200" y2="180" 
                stroke="#059669" strokeWidth="3" markerEnd="url(#arrowhead-green)"/>
          <text x="130" y="200" textAnchor="middle" fontSize="12" fill="#059669" fontWeight="bold">
            Transporte de Exciton Longo
          </text>
          <text x="130" y="215" textAnchor="middle" fontSize="10" fill="#666">
            (~2.5 μm)
          </text>
        </g>
        
        {/* Legend */}
        <g transform="translate(250, 320)">
          <rect x="0" y="0" width="300" height="60" fill="white" stroke="#e2e8f0" rx="5"/>
          <circle cx="30" cy="20" r="8" fill="#9333ea"/>
          <text x="50" y="25" fontSize="11" fill="#334155">Íons de chumbo (Pb²⁺)</text>
          <circle cx="30" cy="45" r="10" fill="#7c3aed"/>
          <text x="50" y="50" fontSize="11" fill="#334155">Cátion central (FA⁺/MA⁺)</text>
          <rect x="180" y="12" width="20" height="15" fill="#fbbf24" stroke="#d97706" opacity="0.7"/>
          <text x="210" y="25" fontSize="11" fill="#334155">Octaedro distorcido</text>
          <rect x="180" y="37" width="20" height="15" fill="#67e8f9" stroke="#0891b2" opacity="0.7"/>
          <text x="210" y="50" fontSize="11" fill="#334155">Octaedro simétrico</text>
        </g>
        
        {/* Arrow markers */}
        <defs>
          <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626"/>
          </marker>
          <marker id="arrowhead-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#059669"/>
          </marker>
        </defs>
      </svg>
    </div>
  );
}
