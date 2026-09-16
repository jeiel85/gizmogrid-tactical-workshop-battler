import React, { useState, useEffect, useRef } from 'react';
import { CombatEntity, CombatLogEntry, FloatingNumber } from '../types/game';
import { processCombatTick } from '../engine/combatEngine';
import { OverdriveLever } from './OverdriveLever';
import { WireOverlay } from './WireOverlay';
import { GizmoIconRenderer } from './WorkshopGrid';
import { getRotatedDimensions } from '../engine/circuitBfs';
import { soundManager } from '../engine/audioEngine';
import { Shield, Heart, Zap, Terminal } from 'lucide-react';

interface CombatArenaProps {
  initialPlayer: CombatEntity;
  initialEnemy: CombatEntity;
  onCombatEnd: (winner: 'player' | 'enemy') => void;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  initialPlayer,
  initialEnemy,
  onCombatEnd
}) => {
  const [player, setPlayer] = useState<CombatEntity>(initialPlayer);
  const [enemy, setEnemy] = useState<CombatEntity>(initialEnemy);
  const [logs, setLogs] = useState<CombatLogEntry[]>([]);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [isOverdriveRumbling, setIsOverdriveRumbling] = useState<boolean>(false);

  const logEndRef = useRef<HTMLDivElement>(null);
  const isFinishedRef = useRef<boolean>(false);

  // Auto-scroll combat logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Combat Clock Pulse Loop
  useEffect(() => {
    isFinishedRef.current = false;

    // Normal tick: 500ms (0.5s as in GDD). If overdrive active, 160ms (300% speed)
    let timerId: NodeJS.Timeout;

    const runTick = () => {
      if (isFinishedRef.current) return;

      const isPlayerOD = player.isOverdriveActive;
      const isEnemyOD = enemy.isOverdriveActive;
      const speedUp = isPlayerOD || isEnemyOD;
      const tickInterval = speedUp ? 160 : 500;

      setIsOverdriveRumbling(speedUp);

      const res = processCombatTick(player, enemy, tickInterval / 1000);
      setPlayer(res.player);
      setEnemy(res.enemy);
      setPulseCount(prev => prev + 1);

      if (res.logs.length > 0) {
        setLogs(prev => [...prev.slice(-25), ...res.logs]);
      }

      if (res.floatingNumbers.length > 0) {
        setFloatingNumbers(prev => [...prev.slice(-15), ...res.floatingNumbers]);
      }

      if (res.isFinished && res.winner) {
        isFinishedRef.current = true;
        if (res.winner === 'player') soundManager.playVictory();
        else soundManager.playDefeat();

        setTimeout(() => {
          onCombatEnd(res.winner!);
        }, 1200);
        return;
      }

      timerId = setTimeout(runTick, tickInterval);
    };

    timerId = setTimeout(runTick, 500);
    return () => clearTimeout(timerId);
  }, [player, enemy, onCombatEnd]);

  // Clean floating numbers after animation
  useEffect(() => {
    if (floatingNumbers.length === 0) return;
    const timer = setTimeout(() => {
      setFloatingNumbers([]);
    }, 1000);
    return () => clearTimeout(timer);
  }, [floatingNumbers]);

  // Handle player pulling overdrive lever
  const handlePullLever = () => {
    if (player.overdriveUsed || player.isOverdriveActive) return;
    setPlayer(prev => ({
      ...prev,
      isOverdriveActive: true,
      overdriveRemainingSec: 3.0,
      overdriveUsed: true
    }));

    setLogs(prev => [
      ...prev,
      {
        id: `log_${Date.now()}_player_od`,
        timestamp: new Date().toLocaleTimeString(),
        text: `⚡ [오버드라이브 발동!] 플레이어가 과부하 퓨즈 레버를 당겼습니다! 3.0초간 300% 가속 & 100% 치명타!`,
        type: 'overdrive',
        isPlayerSource: true
      }
    ]);
  };

  // Mini grid renderer for combat preview
  const renderMiniGrid = (entity: CombatEntity) => {
    const cellSize = 38;
    const gridCols = 7;
    const gridRows = 6;

    return (
      <div 
        style={{ width: gridCols * cellSize, height: gridRows * cellSize }}
        className="relative bg-[#140f0c] border-2 border-[#8c5338] rounded-lg overflow-hidden shadow-inner"
      >
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #8c5338 1px, transparent 1px),
              linear-gradient(to bottom, #8c5338 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`
          }}
        />

        {entity.gridSnapshot.placedGizmos.map(gizmo => {
          const dims = getRotatedDimensions(gizmo.itemData.width, gizmo.itemData.height, gizmo.rotation);
          return (
            <div
              key={gizmo.id}
              style={{
                left: gizmo.gridX * cellSize,
                top: gizmo.gridY * cellSize,
                width: dims.width * cellSize,
                height: dims.height * cellSize,
              }}
              className={`absolute rounded p-0.5 border flex items-center justify-center transition-all ${
                gizmo.isOverheated
                  ? 'bg-red-950/60 border-red-800 text-stone-600 opacity-50'
                  : gizmo.isPowered
                  ? 'bg-[#2b221b] border-[#00f2fe]/80 text-[#00f2fe] shadow-[0_0_6px_rgba(0,242,254,0.3)]'
                  : 'bg-[#181310] border-stone-800 text-stone-500'
              }`}
            >
              <GizmoIconRenderer iconName={gizmo.itemData.iconName} className="w-4 h-4" />
            </div>
          );
        })}

        <WireOverlay
          placedGizmos={entity.gridSnapshot.placedGizmos}
          wireLinks={entity.gridSnapshot.wireLinks}
          cellSize={cellSize}
          connectingSource={null}
          mousePos={null}
          onRemoveWire={() => {}}
          isCombatMode={true}
        />
      </div>
    );
  };

  return (
    <div className={`w-full max-w-5xl mx-auto flex flex-col gap-4 select-none ${isOverdriveRumbling ? 'overdrive-rumble' : ''}`}>
      {/* Floating Damage Numbers Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        {floatingNumbers.map(fn => (
          <div
            key={fn.id}
            style={{
              position: 'absolute',
              left: `${fn.x}%`,
              top: `${fn.y}%`,
              animation: 'floatUp 0.8s ease-out forwards'
            }}
            className={`font-black text-2xl md:text-3xl font-mono-tech drop-shadow-md ${
              fn.type === 'crit' 
                ? 'text-orange-400 scale-125' 
                : fn.type === 'shield'
                ? 'text-[#00f2fe]'
                : fn.type === 'heal'
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}
          >
            {fn.type === 'crit' ? `💥 CRIT -${fn.value}` : fn.type === 'heal' ? `+${fn.value}` : `-${fn.value}`}
          </div>
        ))}
      </div>

      {/* Arena Stage: Player vs Enemy */}
      <div className="bg-[#1a1410] border-2 border-[#8c5338] rounded-2xl p-4 shadow-steampunk flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Steam Blast / Overdrive Background Flare */}
        {player.isOverdriveActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-red-600/10 to-transparent pointer-events-none animate-pulse" />
        )}

        {/* 1. Player Machine Status */}
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <div>
              <span className="text-xs text-[#d4a359] font-mono-tech">아군 공방 결투선</span>
              <h3 className="text-base md:text-lg font-bold font-cinzel text-[#f3c98b]">
                {player.name}
              </h3>
            </div>
            {player.isOverdriveActive && (
              <span className="px-2 py-0.5 bg-orange-600 text-white font-mono-tech text-xs rounded animate-bounce">
                OVERDRIVE x3
              </span>
            )}
          </div>

          {/* HP Bar */}
          <div className="w-full bg-[#0d0a08] h-5 rounded-full border border-[#8c5338] overflow-hidden relative mb-1.5 shadow-inner">
            <div 
              style={{ width: `${Math.max(0, (player.hp / player.maxHp) * 100)}%` }}
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono-tech font-bold text-white drop-shadow">
              <Heart className="w-3 h-3 mr-1 text-red-300 fill-red-400" />
              {player.hp} / {player.maxHp} HP
            </div>
          </div>

          {/* Shield Bar */}
          <div className="w-full bg-[#0d0a08] h-3 rounded-full border border-[#00f2fe]/40 overflow-hidden relative mb-3">
            <div 
              style={{ width: `${Math.min(100, (player.shield / player.maxShield) * 100)}%` }}
              className="h-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono-tech font-bold text-[#00f2fe]">
              <Shield className="w-2.5 h-2.5 mr-1" />
              {player.shield} SHIELD
            </div>
          </div>

          {/* Mini Grid View */}
          {renderMiniGrid(player)}
        </div>

        {/* 2. Center: Clock Pulse & Overdrive Lever */}
        <div className="flex flex-col items-center justify-center z-10 px-2 py-4">
          <div className="flex items-center space-x-1 mb-2">
            <Zap className={`w-4 h-4 ${player.isOverdriveActive ? 'text-orange-400 animate-spin' : 'text-[#00f2fe] animate-pulse'}`} />
            <span className="text-xs font-mono-tech text-[#a89080]">
              PULSE #{pulseCount}
            </span>
          </div>

          {/* Overdrive Lever Component */}
          <OverdriveLever
            isActive={player.isOverdriveActive}
            isUsed={player.overdriveUsed}
            remainingSec={player.overdriveRemainingSec}
            onPullLever={handlePullLever}
          />
        </div>

        {/* 3. Enemy Machine Status */}
        <div className="flex-1 w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <div>
              <span className="text-xs text-[#c86d51] font-mono-tech">비동기 상대 고스트</span>
              <h3 className="text-base md:text-lg font-bold font-cinzel text-red-300">
                {enemy.name}
              </h3>
            </div>
            {enemy.isOverdriveActive && (
              <span className="px-2 py-0.5 bg-red-600 text-white font-mono-tech text-xs rounded animate-bounce">
                ENEMY SURGE
              </span>
            )}
          </div>

          {/* HP Bar */}
          <div className="w-full bg-[#0d0a08] h-5 rounded-full border border-[#8c5338] overflow-hidden relative mb-1.5 shadow-inner">
            <div 
              style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
              className="h-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono-tech font-bold text-white drop-shadow">
              <Heart className="w-3 h-3 mr-1 text-red-300 fill-red-400" />
              {enemy.hp} / {enemy.maxHp} HP
            </div>
          </div>

          {/* Shield Bar */}
          <div className="w-full bg-[#0d0a08] h-3 rounded-full border border-[#00f2fe]/40 overflow-hidden relative mb-3">
            <div 
              style={{ width: `${Math.min(100, (enemy.shield / enemy.maxShield) * 100)}%` }}
              className="h-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono-tech font-bold text-[#00f2fe]">
              <Shield className="w-2.5 h-2.5 mr-1" />
              {enemy.shield} SHIELD
            </div>
          </div>

          {/* Mini Grid View */}
          {renderMiniGrid(enemy)}
        </div>
      </div>

      {/* Teletype Combat Log Console */}
      <div className="bg-[#120e0b] border-2 border-[#6e4c34] rounded-xl p-3 shadow-inner">
        <div className="flex items-center space-x-2 text-xs text-[#d4a359] font-cinzel mb-2 border-b border-[#3d2a1f] pb-1">
          <Terminal className="w-4 h-4" />
          <span>전술 전신 타자기 (Workshop Combat Teletype Log)</span>
        </div>

        <div className="h-32 overflow-y-auto space-y-1 font-mono-tech text-xs pr-1">
          {logs.map(log => (
            <div 
              key={log.id} 
              className={`leading-tight flex items-start space-x-2 ${
                log.type === 'critical'
                  ? 'text-amber-300 font-bold'
                  : log.type === 'overdrive'
                  ? 'text-orange-400 font-bold bg-orange-950/30 p-0.5 rounded'
                  : log.type === 'destroy'
                  ? 'text-red-400'
                  : log.type === 'shield'
                  ? 'text-[#00f2fe]'
                  : log.isPlayerSource
                  ? 'text-[#f3c98b]'
                  : 'text-rose-300'
              }`}
            >
              <span className="text-stone-600 text-[10px]">[{log.timestamp}]</span>
              <span>{log.text}</span>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
