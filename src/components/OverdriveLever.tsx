import React from 'react';
import { soundManager } from '../engine/audioEngine';
import { Flame, AlertTriangle } from 'lucide-react';

interface OverdriveLeverProps {
  isActive: boolean;
  isUsed: boolean;
  remainingSec: number;
  onPullLever: () => void;
}

export const OverdriveLever: React.FC<OverdriveLeverProps> = ({
  isActive,
  isUsed,
  remainingSec,
  onPullLever
}) => {
  const handleClick = () => {
    if (isUsed || isActive) return;
    soundManager.playOverdriveLever();
    onPullLever();
  };

  return (
    <div className="flex flex-col items-center select-none">
      {/* Industrial Warning Header */}
      <div className="flex items-center space-x-1 mb-1 text-[11px] font-mono-tech tracking-wider text-[#f97316]">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span className="font-bold">OVERDRIVE FUSE LEVER</span>
      </div>

      {/* Lever Console Frame */}
      <div className="relative w-36 h-48 bg-[#18120e] border-4 border-[#8c5338] rounded-2xl shadow-steampunk p-2 flex flex-col items-center justify-between overflow-hidden">
        {/* Warning Stripes */}
        <div 
          className="absolute inset-x-0 top-0 h-2 opacity-50"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #f97316, #f97316 8px, #000 8px, #000 16px)'
          }}
        />

        {/* Status Lamp */}
        <div className="mt-2 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full border border-[#000] ${
            isActive 
              ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,1)] animate-ping' 
              : isUsed 
              ? 'bg-stone-700' 
              : 'bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]'
          }`} />
          <span className="text-[10px] font-mono-tech text-[#d4a359]">
            {isActive ? '300% 폭주 중!' : isUsed ? '퓨즈 소손' : '준비 완료'}
          </span>
        </div>

        {/* 3D Mechanical Lever Track & Handle */}
        <div className="relative w-12 h-28 bg-[#0f0b09] rounded-full border-2 border-[#523929] flex flex-col items-center justify-between p-1.5 shadow-inner">
          {/* Lever Track Slot */}
          <div className="absolute top-3 bottom-3 w-2 bg-[#050403] rounded-full" />

          {/* Draggable / Clickable Handle */}
          <button
            onClick={handleClick}
            disabled={isUsed || isActive}
            style={{
              transform: isActive || isUsed ? 'translateY(56px)' : 'translateY(0px)',
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            className={`relative z-10 w-10 h-10 rounded-full border-2 shadow-lg flex items-center justify-center transition-all ${
              isActive
                ? 'bg-gradient-to-b from-[#f97316] to-[#dc2626] border-amber-200 shadow-overdrive-glow animate-pulse'
                : isUsed
                ? 'bg-[#3b2b22] border-stone-700 cursor-not-allowed text-stone-500'
                : 'bg-gradient-to-b from-[#d4a359] via-[#b06947] to-[#8c5338] border-[#f3c98b] hover:scale-105 active:scale-95 cursor-pointer shadow-brass-glow'
            }`}
            title={isUsed ? '전투당 1회만 사용 가능' : '과부하 퓨즈 레버를 당기세요!'}
          >
            <Flame className={`w-5 h-5 ${isActive ? 'text-white animate-bounce' : isUsed ? 'text-stone-600' : 'text-amber-100'}`} />
          </button>
        </div>

        {/* Bottom Timer / Status Text */}
        <div className="text-center font-mono-tech">
          {isActive ? (
            <div className="text-xs font-bold text-red-400 animate-pulse">
              남은 시간: {remainingSec.toFixed(1)}s
            </div>
          ) : isUsed ? (
            <div className="text-[10px] text-stone-500">
              DISCHARGED
            </div>
          ) : (
            <button
              onClick={handleClick}
              className="text-[11px] font-cinzel font-bold text-[#f97316] hover:underline"
            >
              [레버 당기기]
            </button>
          )}
        </div>
      </div>
      
      <span className="text-[10px] text-[#a89080] font-mono-tech mt-1 text-center max-w-[140px]">
        전투당 딱 1회! 3초간 300% 폭주 & 100% 치명타
      </span>
    </div>
  );
};
