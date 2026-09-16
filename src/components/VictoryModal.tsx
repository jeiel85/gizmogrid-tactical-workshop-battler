import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../engine/audioEngine';
import { Trophy, Coins, Skull, ArrowRight, RotateCcw } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  result: 'win' | 'loss';
  wins: number;
  losses: number;
  maxLives: number;
  goldEarned: number;
  onContinue: () => void;
  onRestartGame: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  result,
  wins,
  losses,
  maxLives,
  goldEarned,
  onContinue,
  onRestartGame
}) => {
  if (!isOpen) return null;

  const isHallOfFame = wins >= 10;
  const isGameOver = losses >= maxLives;

  useEffect(() => {
    if (isHallOfFame) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [isHallOfFame]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-[#1a1410] border-4 border-[#8c5338] rounded-2xl w-full max-w-md p-6 shadow-steampunk text-center relative overflow-hidden">
        {/* Top Decorative Lights */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4a359] to-transparent" />

        {isHallOfFame ? (
          // 1. 10 Wins Hall of Fame Victory!
          <div>
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#d4a359]/20 border-2 border-[#f3c98b] flex items-center justify-center text-3xl shadow-brass-glow animate-bounce">
              🏆
            </div>
            <h2 className="text-2xl font-black font-cinzel text-[#f3c98b] mb-1 tracking-wider">
              명예의 전당 입성!
            </h2>
            <p className="text-xs text-[#c86d51] font-mono-tech mb-4">
              HALL OF FAME INDUCTION • 10 WINS ACHIEVED
            </p>
            <p className="text-sm text-[#f3c98b] leading-relaxed mb-6 font-mono-tech bg-[#120e0b] p-3 rounded-lg border border-[#6e4c34]">
              축하합니다! 당신의 공방 머신이 모든 라이벌을 제압하고 기계 왕국의 전설로 등재되었습니다.
            </p>

            <button
              onClick={() => {
                soundManager.playClick();
                onRestartGame();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#d4a359] to-[#8c5338] text-white font-cinzel font-bold rounded-xl border border-[#f3c98b] shadow-brass-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>새로운 공방 개업 (새 게임)</span>
            </button>
          </div>
        ) : isGameOver ? (
          // 2. Game Over (3 Losses)
          <div>
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-950/40 border-2 border-red-700 flex items-center justify-center text-3xl shadow-lg">
              <Skull className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-black font-cinzel text-red-400 mb-1 tracking-wider">
              공방 폐쇄 (GAME OVER)
            </h2>
            <p className="text-xs text-stone-500 font-mono-tech mb-4">
              모든 내구도가 소진되어 머신이 대파되었습니다.
            </p>

            <div className="bg-[#120e0b] p-3 rounded-lg border border-stone-800 mb-6 font-mono-tech text-xs text-[#a89080]">
              기록: 총 {wins}승 달성
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onRestartGame();
              }}
              className="w-full py-3 bg-[#3a281d] hover:bg-[#523929] text-[#f3c98b] font-cinzel font-bold rounded-xl border border-[#8c5338] shadow-md active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>처음부터 재도전</span>
            </button>
          </div>
        ) : result === 'win' ? (
          // 3. Regular Round Victory
          <div>
            <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-emerald-950/40 border-2 border-emerald-500 flex items-center justify-center text-2xl shadow-lg">
              <Trophy className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold font-cinzel text-emerald-400 mb-1 tracking-wider">
              전투 승리!
            </h2>
            <p className="text-xs text-[#a89080] font-mono-tech mb-4">
              상대 고스트 머신을 완파하고 전리품을 획득했습니다!
            </p>

            <div className="bg-[#120e0b] p-3 rounded-lg border border-[#523929] mb-6 flex items-center justify-around font-mono-tech">
              <div className="flex items-center space-x-1.5 text-sm text-[#eab308]">
                <Coins className="w-4 h-4" />
                <span>+{goldEarned} 골드 획득</span>
              </div>
              <div className="flex items-center space-x-1.5 text-sm text-[#d4a359]">
                <Trophy className="w-4 h-4" />
                <span>현재 {wins}/10승</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onContinue();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#8c5338] to-[#c86d51] text-white font-cinzel font-bold rounded-xl border border-[#d4a359] shadow-brass-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>공방으로 돌아가기 (상점 정비)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          // 4. Regular Round Defeat (Lives remaining)
          <div>
            <div className="w-14 h-14 mx-auto mb-2 rounded-full bg-red-950/40 border-2 border-red-600 flex items-center justify-center text-2xl shadow-lg">
              <Skull className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-xl font-bold font-cinzel text-red-400 mb-1 tracking-wider">
              전투 패배...
            </h2>
            <p className="text-xs text-[#a89080] font-mono-tech mb-4">
              머신이 파손되었습니다. 하트(라이프)가 1개 차감됩니다.
            </p>

            <div className="bg-[#120e0b] p-3 rounded-lg border border-[#523929] mb-6 flex items-center justify-around font-mono-tech">
              <div className="text-sm text-red-400">
                남은 라이프: {maxLives - losses} / {maxLives}
              </div>
              <div className="flex items-center space-x-1 text-sm text-[#eab308]">
                <Coins className="w-4 h-4" />
                <span>위로금 +{goldEarned}G</span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onContinue();
              }}
              className="w-full py-3 bg-[#3a281d] hover:bg-[#523929] text-[#f3c98b] font-cinzel font-bold rounded-xl border border-[#8c5338] shadow-md active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>머신 재정비 및 강화</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
