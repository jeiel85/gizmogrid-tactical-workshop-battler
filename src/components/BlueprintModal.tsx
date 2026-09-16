import React, { useState } from 'react';
import { WorkshopGridSnapshot } from '../types/game';
import { exportBlueprintCode, importBlueprintCode } from '../engine/blueprintCodec';
import { soundManager } from '../engine/audioEngine';
import { Copy, Check, Download, Swords, X, FileCode } from 'lucide-react';

interface BlueprintModalProps {
  currentSnapshot: WorkshopGridSnapshot;
  isOpen: boolean;
  onClose: () => void;
  onLoadBlueprintToWorkshop: (snapshot: WorkshopGridSnapshot) => void;
  onStartSimulation: (enemySnapshot: WorkshopGridSnapshot) => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  currentSnapshot,
  isOpen,
  onClose,
  onLoadBlueprintToWorkshop,
  onStartSimulation
}) => {
  if (!isOpen) return null;

  const myCode = exportBlueprintCode(currentSnapshot);
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(myCode);
    soundManager.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportToWorkshop = () => {
    setErrorMsg(null);
    const snapshot = importBlueprintCode(inputCode);
    if (!snapshot) {
      setErrorMsg('유효하지 않은 블루프린트 코드입니다.');
      return;
    }
    soundManager.playWireConnect();
    onLoadBlueprintToWorkshop(snapshot);
    onClose();
  };

  const handleSimulate = () => {
    setErrorMsg(null);
    const snapshot = importBlueprintCode(inputCode);
    if (!snapshot) {
      setErrorMsg('유효하지 않은 블루프린트 코드입니다.');
      return;
    }
    soundManager.playOverdriveLever();
    onStartSimulation(snapshot);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#1a1410] border-2 border-[#8c5338] rounded-2xl w-full max-w-lg p-6 shadow-steampunk relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a89080] hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2 mb-4">
          <FileCode className="w-6 h-6 text-[#d4a359]" />
          <h2 className="text-lg md:text-xl font-bold font-cinzel text-[#f3c98b]">
            공방 블루프린트 교환소
          </h2>
        </div>

        {/* 1. Export Section */}
        <div className="mb-5 bg-[#120e0b] border border-[#523929] rounded-xl p-3">
          <label className="text-xs font-cinzel text-[#d4a359] block mb-1">
            내 공방 머신 코드 (클립보드로 친구에게 공유)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={myCode}
              className="flex-1 bg-[#1a1410] border border-[#6e4c34] rounded px-3 py-1.5 text-xs font-mono-tech text-[#00f2fe] truncate focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#8c5338] hover:bg-[#b06947] text-white rounded text-xs font-cinzel flex items-center space-x-1 transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : '복사'}</span>
            </button>
          </div>
        </div>

        {/* 2. Import Section */}
        <div className="bg-[#120e0b] border border-[#523929] rounded-xl p-3 mb-4">
          <label className="text-xs font-cinzel text-[#d4a359] block mb-1">
            친구 머신 코드 붙여넣기
          </label>
          <input
            type="text"
            placeholder="GIZMO-..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-[#1a1410] border border-[#6e4c34] rounded px-3 py-2 text-xs font-mono-tech text-[#f3c98b] placeholder-stone-600 focus:outline-none focus:border-[#d4a359] mb-3"
          />

          {errorMsg && (
            <p className="text-xs text-red-400 font-mono-tech mb-2">{errorMsg}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleImportToWorkshop}
              disabled={!inputCode.trim()}
              className="flex-1 py-2 bg-[#3a281d] hover:bg-[#523929] disabled:bg-stone-900 border border-[#d4a359] disabled:border-stone-800 text-[#f3c98b] disabled:text-stone-600 rounded text-xs font-cinzel flex items-center justify-center space-x-1 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>공방으로 불러오기</span>
            </button>

            <button
              onClick={handleSimulate}
              disabled={!inputCode.trim()}
              className="flex-1 py-2 bg-gradient-to-r from-[#c86d51] to-[#8c5338] hover:brightness-110 disabled:bg-stone-900 border border-[#f3c98b] disabled:border-stone-800 text-white disabled:text-stone-600 rounded text-xs font-cinzel flex items-center justify-center space-x-1 transition-all active:scale-95"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>모의 전투 실행!</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#a89080] font-mono-tech text-center">
          💡 코드를 불러오면 친구의 배치와 내 머신이 즉시 비동기 모의 전투를 치릅니다.
        </p>
      </div>
    </div>
  );
};
