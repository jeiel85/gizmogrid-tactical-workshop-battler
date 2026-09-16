import React, { useRef, useState, useEffect } from 'react';
import { PlacedGizmo, WireConnection, Vector2Int } from '../types/game';
import { getRotatedDimensions, getPortAbsoluteGridPos } from '../engine/circuitBfs';
import { WireOverlay } from './WireOverlay';
import { soundManager } from '../engine/audioEngine';
import { 
  RotateCw, 
  Trash2, 
  Zap, 
  BatteryCharging, 
  Cpu, 
  Split, 
  Gauge, 
  Clock, 
  Radio, 
  Sword, 
  Disc, 
  Crosshair, 
  ZapOff, 
  Bomb, 
  Flame, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Wrench, 
  Activity 
} from 'lucide-react';

// Icon mapper
export const GizmoIconRenderer: React.FC<{ iconName: string; className?: string }> = ({ iconName, className = "w-6 h-6" }) => {
  switch (iconName) {
    case 'BatteryCharging': return <BatteryCharging className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'RotateCw': return <RotateCw className={className} />;
    case 'Split': return <Split className={className} />;
    case 'Gauge': return <Gauge className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'Radio': return <Radio className={className} />;
    case 'Sword': return <Sword className={className} />;
    case 'Disc': return <Disc className={className} />;
    case 'Crosshair': return <Crosshair className={className} />;
    case 'ZapOff': return <ZapOff className={className} />;
    case 'Bomb': return <Bomb className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'Activity': return <Activity className={className} />;
    default: return <Cpu className={className} />;
  }
};

interface WorkshopGridProps {
  gridCols?: number;
  gridRows?: number;
  placedGizmos: PlacedGizmo[];
  wireLinks: WireConnection[];
  onUpdateGizmos: (gizmos: PlacedGizmo[]) => void;
  onUpdateWires: (wires: WireConnection[]) => void;
  onSelectGizmo: (gizmo: PlacedGizmo | null) => void;
  selectedGizmoId: string | null;
  onReturnToBench: (gizmo: PlacedGizmo) => void;
}

export const WorkshopGrid: React.FC<WorkshopGridProps> = ({
  gridCols = 7,
  gridRows = 6,
  placedGizmos,
  wireLinks,
  onUpdateGizmos,
  onUpdateWires,
  onSelectGizmo,
  selectedGizmoId,
  onReturnToBench
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cellSize = 60; // 60px per grid cell

  // Wiring drag state
  const [connectingSource, setConnectingSource] = useState<{ gizmoId: string; portIndex: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Drag-moving gizmo state
  const [draggingGizmoId, setDraggingGizmoId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Vector2Int>({ x: 0, y: 0 });

  // Keyboard shortcut: 'R' to rotate selected
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        if (selectedGizmoId) {
          handleRotateGizmo(selectedGizmoId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGizmoId, placedGizmos]);

  // Rotate a gizmo
  const handleRotateGizmo = (gizmoId: string) => {
    const gizmo = placedGizmos.find(g => g.id === gizmoId);
    if (!gizmo) return;

    soundManager.playRotate();
    const newRotation = (gizmo.rotation + 90) % 360;
    const { width: newW, height: newH } = getRotatedDimensions(
      gizmo.itemData.width,
      gizmo.itemData.height,
      newRotation
    );

    // Keep inside bounds
    let newX = Math.min(gizmo.gridX, gridCols - newW);
    let newY = Math.min(gizmo.gridY, gridRows - newH);
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);

    const updated = placedGizmos.map(g => {
      if (g.id === gizmoId) {
        return {
          ...g,
          rotation: newRotation,
          gridX: newX,
          gridY: newY
        };
      }
      return g;
    });

    onUpdateGizmos(updated);
  };

  // Mouse move inside grid for wiring or dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (connectingSource) {
      setMousePos({ x, y });
    }
  };

  // Start connecting from an output port
  const handleStartWire = (e: React.MouseEvent, gizmoId: string, portIndex: number) => {
    e.stopPropagation();
    soundManager.playClick();
    setConnectingSource({ gizmoId, portIndex });
  };

  // Finish connecting to an input port
  const handleEndWire = (e: React.MouseEvent, targetGizmoId: string, targetPortIndex: number) => {
    e.stopPropagation();
    if (!connectingSource) return;

    if (connectingSource.gizmoId === targetGizmoId) {
      // Cannot wire into self
      setConnectingSource(null);
      setMousePos(null);
      return;
    }

    // Check if duplicate wire already exists
    const exists = wireLinks.some(
      w => w.fromGizmoId === connectingSource.gizmoId &&
           w.fromPortIndex === connectingSource.portIndex &&
           w.toGizmoId === targetGizmoId &&
           w.toPortIndex === targetPortIndex
    );

    if (!exists) {
      soundManager.playWireConnect();
      const newWire: WireConnection = {
        id: `wire_${Date.now()}_${Math.random()}`,
        fromGizmoId: connectingSource.gizmoId,
        fromPortIndex: connectingSource.portIndex,
        toGizmoId: targetGizmoId,
        toPortIndex: targetPortIndex,
        isActive: false
      };
      onUpdateWires([...wireLinks, newWire]);
    }

    setConnectingSource(null);
    setMousePos(null);
  };

  // Remove a wire
  const handleRemoveWire = (wireId: string) => {
    onUpdateWires(wireLinks.filter(w => w.id !== wireId));
  };

  // Handle cell click (smart snap / place / deselect)
  const handleGridClick = () => {
    if (connectingSource) {
      setConnectingSource(null);
      setMousePos(null);
    } else {
      onSelectGizmo(null);
    }
  };

  // Drag and drop placed gizmo within grid
  const handleGizmoMouseDown = (e: React.MouseEvent, gizmo: PlacedGizmo) => {
    e.stopPropagation();
    onSelectGizmo(gizmo);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Workshop Board Frame */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={handleGridClick}
        style={{
          width: gridCols * cellSize,
          height: gridRows * cellSize,
        }}
        className="relative bg-[#16110e] border-4 border-[#8c5338] rounded-xl shadow-steampunk overflow-hidden select-none"
      >
        {/* Grid Background Lines */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(140, 83, 56, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(140, 83, 56, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`
          }}
        />

        {/* Screw bolts on corners for steampunk flavor */}
        <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-[#d4a359] border border-[#2a1a10] shadow" />
        <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#d4a359] border border-[#2a1a10] shadow" />
        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 rounded-full bg-[#d4a359] border border-[#2a1a10] shadow" />
        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#d4a359] border border-[#2a1a10] shadow" />

        {/* Placed Gizmos */}
        {placedGizmos.map(gizmo => {
          const dims = getRotatedDimensions(gizmo.itemData.width, gizmo.itemData.height, gizmo.rotation);
          const isSelected = gizmo.id === selectedGizmoId;
          const isPowered = gizmo.isPowered;

          return (
            <div
              key={gizmo.id}
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playClick();
                onSelectGizmo(gizmo);
              }}
              onMouseDown={(e) => handleGizmoMouseDown(e, gizmo)}
              style={{
                left: gizmo.gridX * cellSize,
                top: gizmo.gridY * cellSize,
                width: dims.width * cellSize,
                height: dims.height * cellSize,
              }}
              className={`absolute rounded-lg p-1 transition-transform cursor-pointer border-2 z-10 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#f3c98b] ring-2 ring-[#d4a359] shadow-brass-glow'
                  : isPowered
                  ? 'border-[#00f2fe]/70 shadow-[0_0_10px_rgba(0,242,254,0.3)] bg-gradient-to-br from-[#2b221b] to-[#1c1511]'
                  : 'border-[#6e4c34] bg-gradient-to-br from-[#241c17] to-[#140f0c]'
              }`}
            >
              {/* Item Top Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono-tech px-1 text-[#d4a359]">
                <span className="truncate max-w-[80%] font-bold">{gizmo.itemData.itemName}</span>
                {gizmo.itemData.gizmoType === 'PowerSource' ? (
                  <span className="text-emerald-400 font-bold">+{gizmo.itemData.outputEffectValue}V</span>
                ) : (
                  <span className={isPowered ? 'text-[#00f2fe]' : 'text-stone-400'}>
                    {gizmo.itemData.basePowerConsumption}V
                  </span>
                )}
              </div>

              {/* Center Icon & Visual */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className={`p-1.5 rounded-full ${
                  isPowered ? 'text-[#00f2fe] bg-[#00f2fe]/10 animate-pulse' : 'text-[#8c5338]'
                }`}>
                  <GizmoIconRenderer iconName={gizmo.itemData.iconName} className="w-6 h-6" />
                </div>
                <div className="text-[9px] text-[#a89080] font-mono-tech mt-0.5">
                  {gizmo.itemData.gizmoType === 'Weapon' && `ATK: ${gizmo.itemData.outputEffectValue}`}
                  {gizmo.itemData.gizmoType === 'Shield' && `DEF: +${gizmo.itemData.outputEffectValue}`}
                  {gizmo.itemData.gizmoType === 'Transistor' && `x${gizmo.itemData.outputEffectValue} 증폭`}
                </div>
              </div>

              {/* Port Connectors */}
              {/* 1. Output Ports (Golden Pins) */}
              {gizmo.itemData.powerOutputPorts.map((_, pIdx) => {
                const absPos = getPortAbsoluteGridPos(gizmo, 'out', pIdx);
                const localX = (absPos.x - gizmo.gridX) * cellSize + cellSize * 0.5;
                const localY = (absPos.y - gizmo.gridY) * cellSize + cellSize * 0.5;

                return (
                  <button
                    key={`out_${pIdx}`}
                    onClick={(e) => handleStartWire(e, gizmo.id, pIdx)}
                    style={{ left: localX, top: localY }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#d4a359] hover:bg-[#f3c98b] border-2 border-[#18120e] shadow-md z-30 cursor-crosshair flex items-center justify-center transition-transform hover:scale-125"
                    title="전력 출력 단자 (클릭하여 전선 연결)"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#18120e]" />
                  </button>
                );
              })}

              {/* 2. Input Ports (Cyan Sockets) */}
              {gizmo.itemData.powerInputPorts.map((_, pIdx) => {
                const absPos = getPortAbsoluteGridPos(gizmo, 'in', pIdx);
                const localX = (absPos.x - gizmo.gridX) * cellSize + cellSize * 0.5;
                const localY = (absPos.y - gizmo.gridY) * cellSize + cellSize * 0.5;
                const isConnecting = Boolean(connectingSource);

                return (
                  <button
                    key={`in_${pIdx}`}
                    onClick={(e) => handleEndWire(e, gizmo.id, pIdx)}
                    style={{ left: localX, top: localY }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#18120e] shadow-md z-30 flex items-center justify-center transition-all ${
                      isConnecting 
                        ? 'bg-[#00f2fe] animate-bounce ring-2 ring-white scale-125 cursor-pointer' 
                        : 'bg-[#1a3644] hover:bg-[#00f2fe] cursor-pointer'
                    }`}
                    title="전력 수신 단자 (전선 종점)"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]" />
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Curved Wire Overlay */}
        <WireOverlay
          placedGizmos={placedGizmos}
          wireLinks={wireLinks}
          cellSize={cellSize}
          connectingSource={connectingSource}
          mousePos={mousePos}
          onRemoveWire={handleRemoveWire}
        />
      </div>

      {/* Selected Gizmo Toolbar */}
      {selectedGizmoId && (() => {
        const sel = placedGizmos.find(g => g.id === selectedGizmoId);
        if (!sel) return null;

        return (
          <div className="mt-3 flex items-center space-x-3 px-4 py-2 bg-[#201813] border border-[#8c5338] rounded-xl shadow-lg animate-fadeIn">
            <span className="text-xs font-bold text-[#f3c98b] font-cinzel">
              [{sel.itemData.itemName}]
            </span>
            <button
              onClick={() => handleRotateGizmo(sel.id)}
              className="flex items-center space-x-1 px-3 py-1 bg-[#3a281d] hover:bg-[#523929] border border-[#d4a359] text-[#f3c98b] rounded text-xs transition-all active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>회전 (R)</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onReturnToBench(sel);
              }}
              className="flex items-center space-x-1 px-3 py-1 bg-red-950/60 hover:bg-red-900 border border-red-700 text-red-200 rounded text-xs transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>벤치로 복귀</span>
            </button>
          </div>
        );
      })()}

      <div className="mt-2 text-xs text-[#a89080] font-mono-tech text-center">
        💡 <span className="text-[#d4a359]">황동 단자</span>(출력)를 클릭한 뒤 <span className="text-[#00f2fe]">청록 단자</span>(입력)를 클릭해 전선을 연결하세요! (전선 클릭 시 연결 삭제)
      </div>
    </div>
  );
};
