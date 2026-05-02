import React from 'react';
import { log_event } from '../physics/formulas.js';

/**
 * Componente SVG para estruturas cristalinas usadas em painéis solares
 * Mostra diferentes estruturas: Si (diamante cúbico), GaAs (zincblende), CdTe (zincblende), CIGS (calcopirita)
 */
export default function SolarCrystalStructures() {
  return (
    <div className="solar-crystal-structures">
      <svg viewBox="0 0 1000 600" className="solar-crystal-diagram">
        {/* Background */}
        <rect width="1000" height="600" fill="#f8f9fa"/>
        
        {/* Title */}
        <text x="500" y="30" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#1e293b">
          Estruturas Cristalinas em Painéis Solares
        </text>
        
        {/* Silicon - Diamond Cubic */}
        <g transform="translate(50, 60)">
          <text x="200" y="20" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0ea5e9">
            Silício (Si) - Estrutura Diamante Cúbico
          </text>
          
          {/* Diamond cubic unit cell representation */}
          <g transform="translate(100, 50)">
            {/* Cube outline */}
            <rect x="0" y="0" width="200" height="200" fill="none" stroke="#0ea5e9" strokeWidth="2"/>
            
            {/* Corner atoms */}
            <circle cx="0" cy="0" r="12" fill="#0ea5e9"/>
            <circle cx="200" cy="0" r="12" fill="#0ea5e9"/>
            <circle cx="0" cy="200" r="12" fill="#0ea5e9"/>
            <circle cx="200" cy="200" r="12" fill="#0ea5e9"/>
            
            {/* Face-centered atoms */}
            <circle cx="100" cy="0" r="10" fill="#38bdf8"/>
            <circle cx="100" cy="200" r="10" fill="#38bdf8"/>
            <circle cx="0" cy="100" r="10" fill="#38bdf8"/>
            <circle cx="200" cy="100" r="10" fill="#38bdf8"/>
            
            {/* Internal tetrahedral bonds */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="5,5"/>
            <line x1="200" y1="0" x2="100" y2="100" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="5,5"/>
            <line x1="0" y1="200" x2="100" y2="100" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="5,5"/>
            <line x1="200" y1="200" x2="100" y2="100" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="5,5"/>
            
            {/* Center atoms (tetrahedral) */}
            <circle cx="50" cy="50" r="8" fill="#0ea5e9" opacity="0.7"/>
            <circle cx="150" cy="50" r="8" fill="#0ea5e9" opacity="0.7"/>
            <circle cx="50" cy="150" r="8" fill="#0ea5e9" opacity="0.7"/>
            <circle cx="150" cy="150" r="8" fill="#0ea5e9" opacity="0.7"/>
          </g>
          
          <text x="200" y="280" textAnchor="middle" fontSize="12" fill="#334155">
            Bandgap: 1.12 eV | Estrutura: Diamante Cúbico
          </text>
          <text x="200" y="300" textAnchor="middle" fontSize="12" fill="#334155">
            Eficiência: ~26% (monocristalino)
          </text>
        </g>
        
        {/* Gallium Arsenide - Zincblende */}
        <g transform="translate(550, 60)">
          <text x="200" y="20" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#8b5cf6">
            GaAs - Estrutura Zincblende
          </text>
          
          <g transform="translate(100, 50)">
            {/* Cube outline */}
            <rect x="0" y="0" width="200" height="200" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
            
            {/* Corner atoms - Ga */}
            <circle cx="0" cy="0" r="12" fill="#8b5cf6"/>
            <circle cx="200" cy="0" r="12" fill="#8b5cf6"/>
            <circle cx="0" cy="200" r="12" fill="#8b5cf6"/>
            <circle cx="200" cy="200" r="12" fill="#8b5cf6"/>
            
            {/* Face-centered atoms - As */}
            <circle cx="100" cy="0" r="10" fill="#a78bfa"/>
            <circle cx="100" cy="200" r="10" fill="#a78bfa"/>
            <circle cx="0" cy="100" r="10" fill="#a78bfa"/>
            <circle cx="200" cy="100" r="10" fill="#a78bfa"/>
            
            {/* Internal atoms */}
            <circle cx="100" cy="100" r="12" fill="#8b5cf6"/>
            
            {/* Bonds */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="#c4b5fd" strokeWidth="2"/>
            <line x1="200" y1="0" x2="100" y2="100" stroke="#c4b5fd" strokeWidth="2"/>
            <line x1="0" y1="200" x2="100" y2="100" stroke="#c4b5fd" strokeWidth="2"/>
            <line x1="200" y1="200" x2="100" y2="100" stroke="#c4b5fd" strokeWidth="2"/>
          </g>
          
          <text x="200" y="280" textAnchor="middle" fontSize="12" fill="#334155">
            Bandgap: 1.42 eV | Estrutura: Zincblende
          </text>
          <text x="200" y="300" textAnchor="middle" fontSize="12" fill="#334155">
            Eficiência: ~29% (laboratório)
          </text>
        </g>
        
        {/* Cadmium Telluride - Zincblende */}
        <g transform="translate(50, 350)">
          <text x="200" y="20" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#f59e0b">
            CdTe - Estrutura Zincblende
          </text>
          
          <g transform="translate(100, 50)">
            {/* Cube outline */}
            <rect x="0" y="0" width="200" height="200" fill="none" stroke="#f59e0b" strokeWidth="2"/>
            
            {/* Corner atoms - Cd */}
            <circle cx="0" cy="0" r="12" fill="#f59e0b"/>
            <circle cx="200" cy="0" r="12" fill="#f59e0b"/>
            <circle cx="0" cy="200" r="12" fill="#f59e0b"/>
            <circle cx="200" cy="200" r="12" fill="#f59e0b"/>
            
            {/* Face-centered atoms - Te */}
            <circle cx="100" cy="0" r="10" fill="#fbbf24"/>
            <circle cx="100" cy="200" r="10" fill="#fbbf24"/>
            <circle cx="0" cy="100" r="10" fill="#fbbf24"/>
            <circle cx="200" cy="100" r="10" fill="#fbbf24"/>
            
            {/* Internal atoms */}
            <circle cx="100" cy="100" r="12" fill="#f59e0b"/>
            
            {/* Bonds */}
            <line x1="0" y1="0" x2="100" y2="100" stroke="#fcd34d" strokeWidth="2"/>
            <line x1="200" y1="0" x2="100" y2="100" stroke="#fcd34d" strokeWidth="2"/>
            <line x1="0" y1="200" x2="100" y2="100" stroke="#fcd34d" strokeWidth="2"/>
            <line x1="200" y1="200" x2="100" y2="100" stroke="#fcd34d" strokeWidth="2"/>
          </g>
          
          <text x="200" y="280" textAnchor="middle" fontSize="12" fill="#334155">
            Bandgap: 1.45 eV | Estrutura: Zincblende
          </text>
          <text x="200" y="300" textAnchor="middle" fontSize="12" fill="#334155">
            Eficiência: ~22% (filme fino)
          </text>
        </g>
        
        {/* CIGS - Chalcopyrite */}
        <g transform="translate(550, 350)">
          <text x="200" y="20" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#10b981">
            CIGS - Estrutura Calcopirita
          </text>
          
          <g transform="translate(100, 50)">
            {/* Distorted cubic for chalcopyrite */}
            <rect x="0" y="0" width="200" height="200" fill="none" stroke="#10b981" strokeWidth="2"/>
            
            {/* Mixed atoms - Cu, In, Ga, Se */}
            <circle cx="0" cy="0" r="12" fill="#10b981"/>
            <circle cx="200" cy="0" r="12" fill="#34d399"/>
            <circle cx="0" cy="200" r="12" fill="#34d399"/>
            <circle cx="200" cy="200" r="12" fill="#10b981"/>
            
            {/* Face-centered atoms */}
            <circle cx="100" cy="0" r="10" fill="#6ee7b7"/>
            <circle cx="100" cy="200" r="10" fill="#6ee7b7"/>
            <circle cx="0" cy="100" r="10" fill="#6ee7b7"/>
            <circle cx="200" cy="100" r="10" fill="#6ee7b7"/>
            
            {/* Internal atoms - distorted positions */}
            <circle cx="80" cy="100" r="10" fill="#10b981" opacity="0.7"/>
            <circle cx="120" cy="100" r="10" fill="#34d399" opacity="0.7"/>
            
            {/* Bonds - slightly distorted */}
            <line x1="0" y1="0" x2="80" y2="100" stroke="#6ee7b7" strokeWidth="2"/>
            <line x1="200" y1="0" x2="120" y2="100" stroke="#6ee7b7" strokeWidth="2"/>
            <line x1="0" y1="200" x2="80" y2="100" stroke="#6ee7b7" strokeWidth="2"/>
            <line x1="200" y1="200" x2="120" y2="100" stroke="#6ee7b7" strokeWidth="2"/>
          </g>
          
          <text x="200" y="280" textAnchor="middle" fontSize="12" fill="#334155">
            Bandgap: 1.0-1.7 eV | Estrutura: Calcopirita
          </text>
          <text x="200" y="300" textAnchor="middle" fontSize="12" fill="#334155">
            Eficiência: ~23% (filme fino)
          </text>
        </g>
        
        {/* Legend */}
        <g transform="translate(250, 560)">
          <rect x="0" y="0" width="500" height="35" fill="white" stroke="#e2e8f0" rx="5"/>
          <text x="250" y="22" textAnchor="middle" fontSize="11" fill="#334155">
            <tspan fill="#0ea5e9">■</tspan> Si <tspan fill="#8b5cf6">■</tspan> GaAs <tspan fill="#f59e0b">■</tspan> CdTe <tspan fill="#10b981">■</tspan> CIGS
          </text>
        </g>
      </svg>
    </div>
  );
}
