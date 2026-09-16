import React, { useState } from 'react';
import { PlayerProgress } from '../types/game';
import { soundManager } from '../engine/audioEngine';
import { 
  Trophy, 
  Coins, 
  Heart, 
  Volume2, 
  VolumeX, 
  Share2, 
  Sparkles,
  Layers
} from 'lucide-react';

interface HeaderProps {
  progress: PlayerProgress;
  onOpenBlueprint: () => void;
  onOpenHallOfFame?: () => void;
  totalPowerGen: number;
  totalPowerUse: number;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  onOpenBlueprint,
  totalPowerGen,
  totalPowerUse
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleToggleSound = () => {
    const nextMute = soundManager.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) soundManager.playClick();
  };

  return (
    <header className="w-full bg-[#18120e] border-b-2 border-[#8c5338] shadow-steampunk px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a359] via-[#8c5338] to-[#2a1b14] p-1 flex items-center justify-center shadow-brass-glow border border-[#f3c98b]">
          <span className="text-xl animate-spin-slow">⚙️</span>
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold font-cinzel text-[#f3c98b] tracking-wider leading-none">
            GIZMOGRID
          </h1>
          <p className="text-xs text-[#c86d51] font-mono-tech tracking-tight">
            Tactical Workshop Battler
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center flex-wrap gap-2 md:gap-4 font-mono-tech text-sm">
        {/* Round */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#251a14] rounded border border-[#6e4c34]">
          <Layers className="w-4 h-4 text-[#d4a359]" />
          <span className="text-[#a89080]">ROUND</span>
          <span className="text-white font-bold text-base">{progress.round}</span>
        </div>

        {/* Wins / Trophies */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#251a14] rounded border border-[#d4a359]/60 shadow-[0_0_8px_rgba(212,163,89,0.2)]">
          <Trophy className="w-4 h-4 text-[#d4a359] animate-pulse" />
          <span className="text-[#d4a359]">WINS</span>
          <span className="text-[#f3c98b] font-bold text-base">{progress.wins}/10</span>
        </div>

        {/* Lives (Hearts) */}
        <div className="flex items-center space-x-1 px-3 py-1 bg-[#251a14] rounded border border-[#6e4c34]">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <div className="flex space-x-1">
            {Array.from({ length: progress.maxLives }).map((_, idx) => (
              <span 
                key={idx}
                className={`inline-block w-3 h-3 rounded-full transition-all ${
                  idx < progress.maxLives - progress.losses 
                    ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]' 
                    : 'bg-[#4a3528]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Gold */}
        <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#251a14] rounded border border-[#eab308]/60">
          <Coins className="w-4 h-4 text-[#eab308]" />
          <span className="text-[#eab308] font-bold text-base">{progress.gold}</span>
          <span className="text-xs text-[#a89080]">G</span>
        </div>

        {/* Power Status Gauge */}
        <div className="flex items-center space-x-2 px-3 py-1 bg-[#1a1e24] rounded border border-[#00f2fe]/40">
          <Sparkles className="w-4 h-4 text-[#00f2fe]" />
          <span className="text-xs text-[#00f2fe]">VOLT:</span>
          <span className={`font-bold text-sm ${totalPowerGen >= totalPowerUse ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPowerUse} / {totalPowerGen}V
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenBlueprint();
          }}
          className="flex items-center space-x-1 px-3 py-1.5 bg-[#3a281d] hover:bg-[#523929] border border-[#d4a359] text-[#f3c98b] rounded text-xs md:text-sm font-cinzel transition-all shadow-md active:scale-95"
          title="공방 블루프린트 공유/불러오기"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">블루프린트</span>
        </button>

        <button
          onClick={handleToggleSound}
          className="p-1.5 bg-[#251a14] hover:bg-[#3d2c22] border border-[#6e4c34] text-[#d4a359] rounded transition-all active:scale-95"
          title={isMuted ? '음소거 해제' : '음소거'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};
