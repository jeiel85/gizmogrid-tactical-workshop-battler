import React from 'react';
import { PlacedGizmo, WireConnection } from '../types/game';
import { getPortAbsoluteGridPos } from '../engine/circuitBfs';
import { soundManager } from '../engine/audioEngine';

interface WireOverlayProps {
  placedGizmos: PlacedGizmo[];
  wireLinks: WireConnection[];
  cellSize: number;
  connectingSource: { gizmoId: string; portIndex: number } | null;
  mousePos: { x: number; y: number } | null;
  onRemoveWire: (wireId: string) => void;
  isCombatMode?: boolean;
}

export const WireOverlay: React.FC<WireOverlayProps> = ({
  placedGizmos,
  wireLinks,
  cellSize,
  connectingSource,
  mousePos,
  onRemoveWire,
  isCombatMode = false
}) => {
  const gizmoMap = new Map(placedGizmos.map(g => [g.id, g]));

  // Calculate pixel coordinates for a port
  const getPortPixelCoord = (gizmo: PlacedGizmo, portType: 'in' | 'out', portIndex: number) => {
    const gridPos = getPortAbsoluteGridPos(gizmo, portType, portIndex);
    return {
      x: gridPos.x * cellSize + cellSize * 0.5,
      y: gridPos.y * cellSize + cellSize * 0.5
    };
  };

  // Generate a natural-looking drooping cable Bezier curve
  const createCatenaryCurve = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    // Gravity sag based on wire distance
    const sag = Math.min(dist * 0.35, 45);

    const cx1 = x1 + dx * 0.25;
    const cy1 = y1 + dy * 0.25 + sag;
    const cx2 = x1 + dx * 0.75;
    const cy2 = y1 + dy * 0.75 + sag;

    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  };

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
    >
      <defs>
        {/* Copper wire gradient */}
        <linearGradient id="wireGradientCopper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c86d51" />
          <stop offset="50%" stopColor="#e07a5f" />
          <stop offset="100%" stopColor="#8c5338" />
        </linearGradient>

        {/* Electric active pulse gradient */}
        <linearGradient id="wireGradientActive" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#4facfe" />
        </linearGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Existing Wires */}
      {wireLinks.map(wire => {
        const fromGizmo = gizmoMap.get(wire.fromGizmoId);
        const toGizmo = gizmoMap.get(wire.toGizmoId);
        if (!fromGizmo || !toGizmo) return null;

        const start = getPortPixelCoord(fromGizmo, 'out', wire.fromPortIndex);
        const end = getPortPixelCoord(toGizmo, 'in', wire.toPortIndex);
        const pathData = createCatenaryCurve(start.x, start.y, end.x, end.y);

        return (
          <g 
            key={wire.id} 
            className={`transition-all ${!isCombatMode ? 'pointer-events-auto cursor-pointer group' : ''}`}
            onClick={(e) => {
              if (isCombatMode) return;
              e.stopPropagation();
              soundManager.playWireConnect();
              onRemoveWire(wire.id);
            }}
          >
            {/* Wider invisible stroke for easy clicking/hovering */}
            {!isCombatMode && (
              <path
                d={pathData}
                fill="none"
                stroke="transparent"
                strokeWidth={14}
              />
            )}

            {/* Wire outer insulation / shadow */}
            <path
              d={pathData}
              fill="none"
              stroke="#0f0c0a"
              strokeWidth={wire.isActive ? 6 : 5}
              strokeLinecap="round"
              opacity={0.8}
            />

            {/* Wire Core */}
            <path
              d={pathData}
              fill="none"
              stroke={wire.isActive ? 'url(#wireGradientActive)' : 'url(#wireGradientCopper)'}
              strokeWidth={wire.isActive ? 4 : 3}
              strokeLinecap="round"
              filter={wire.isActive ? 'url(#glow)' : undefined}
              className={wire.isActive ? 'wire-pulse-active' : 'group-hover:stroke-red-400 transition-colors'}
            />

            {/* Jack Terminals */}
            <circle cx={start.x} cy={start.y} r={5} fill="#d4a359" stroke="#18120e" strokeWidth={1.5} />
            <circle cx={end.x} cy={end.y} r={5} fill="#00f2fe" stroke="#18120e" strokeWidth={1.5} />
          </g>
        );
      })}

      {/* Wire currently being dragged / connected */}
      {connectingSource && mousePos && (() => {
        const fromGizmo = gizmoMap.get(connectingSource.gizmoId);
        if (!fromGizmo) return null;
        const start = getPortPixelCoord(fromGizmo, 'out', connectingSource.portIndex);
        const pathData = createCatenaryCurve(start.x, start.y, mousePos.x, mousePos.y);

        return (
          <g>
            <path
              d={pathData}
              fill="none"
              stroke="#00f2fe"
              strokeWidth={3}
              strokeDasharray="6,4"
              className="animate-pulse"
              filter="url(#glow)"
            />
            <circle cx={start.x} cy={start.y} r={6} fill="#00f2fe" stroke="#fff" strokeWidth={2} />
            <circle cx={mousePos.x} cy={mousePos.y} r={5} fill="#f3c98b" stroke="#000" strokeWidth={1.5} />
          </g>
        );
      })()}
    </svg>
  );
};
