import React from 'react';
import { GridItemData } from '../types/game';
import { GizmoIconRenderer } from './WorkshopGrid';
import { soundManager } from '../engine/audioEngine';
import { RefreshCw, Swords, Coins, Sparkles, Plus, Trash2 } from 'lucide-react';

interface ShopPanelProps {
  shopItems: GridItemData[];
  benchItems: (GridItemData | null)[];
  gold: number;
  onBuyItem: (item: GridItemData, shopIndex: number) => void;
  onReroll: () => void;
  onPlaceFromBench: (item: GridItemData, benchIndex: number) => void;
  onSellBenchItem: (benchIndex: number) => void;
  onStartCombat: () => void;
  isReadyForBattle: boolean;
}

export const ShopPanel: React.FC<ShopPanelProps> = ({
  shopItems,
  benchItems,
  gold,
  onBuyItem,
  onReroll,
  onPlaceFromBench,
  onSellBenchItem,
  onStartCombat,
  isReadyForBattle
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 select-none">
      {/* 1. Shop Catalog Section */}
      <div className="bg-[#1a1410] border-2 border-[#8c5338] rounded-xl p-4 shadow-steampunk">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🛒</span>
            <h2 className="text-base md:text-lg font-bold font-cinzel text-[#f3c98b]">
              증기 공방 부품 암시장 (Workshop Parts Depot)
            </h2>
          </div>

          <button
            onClick={() => {
              if (gold >= 1) {
                soundManager.playClick();
                onReroll();
              }
            }}
            disabled={gold < 1}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono-tech transition-all active:scale-95 ${
              gold >= 1 
                ? 'bg-[#3a281d] hover:bg-[#523929] border-[#d4a359] text-[#f3c98b]' 
                : 'bg-stone-900 border-stone-800 text-stone-600 cursor-not-allowed'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>새로고침 (1G)</span>
          </button>
        </div>

        {/* 3 Shop Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {shopItems.map((item, idx) => {
            const canAfford = gold >= item.cost;
            return (
              <div
                key={`${item.itemId}_${idx}`}
                className="bg-gradient-to-b from-[#241a14] to-[#16100d] border border-[#6e4c34] rounded-lg p-3 flex flex-col justify-between hover:border-[#d4a359] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-tech text-[#a89080]">
                      Tier {item.tier} • {item.width}x{item.height}
                    </span>
                    <span className="flex items-center space-x-1 text-xs font-bold text-[#eab308]">
                      <Coins className="w-3 h-3" />
                      <span>{item.cost}G</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-[#2f221a] border border-[#8c5338] flex items-center justify-center text-[#d4a359] group-hover:scale-110 transition-transform">
                      <GizmoIconRenderer iconName={item.iconName} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#f3c98b] font-cinzel leading-tight">
                        {item.itemName}
                      </h3>
                      <span className="text-[10px] text-[#c86d51]">
                        {item.gizmoType === 'PowerSource' && '전원 공급원'}
                        {item.gizmoType === 'Weapon' && '무기 액추에이터'}
                        {item.gizmoType === 'Shield' && '방어막 기계'}
                        {item.gizmoType === 'Transistor' && '트랜지스터 릴레이'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#c4b5a5] leading-snug mb-3">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (canAfford) {
                      soundManager.playClick();
                      onBuyItem(item, idx);
                    }
                  }}
                  disabled={!canAfford}
                  className={`w-full py-1.5 rounded text-xs font-cinzel font-bold flex items-center justify-center space-x-1 transition-all active:scale-95 ${
                    canAfford
                      ? 'bg-[#8c5338] hover:bg-[#b06947] text-amber-100 border border-[#d4a359] shadow-md'
                      : 'bg-stone-900 text-stone-600 border border-stone-800 cursor-not-allowed'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>구매 ({item.cost}G)</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Bench & Action Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1a1410] border-2 border-[#8c5338] rounded-xl p-4 shadow-steampunk">
        {/* Storage Bench */}
        <div className="flex-1 w-full">
          <div className="text-xs font-cinzel text-[#d4a359] mb-2 flex items-center space-x-1">
            <span>📦 보관 벤치 (Storage Bench - 5칸)</span>
            <span className="text-[10px] text-[#a89080] font-mono-tech">(클릭 시 공방에 즉시 스마트 배치)</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {benchItems.map((slotItem, bIdx) => (
              <div
                key={bIdx}
                className="h-16 rounded-lg border border-dashed border-[#6e4c34] bg-[#140f0c] p-1 flex flex-col items-center justify-center relative group"
              >
                {slotItem ? (
                  <div className="w-full h-full flex flex-col items-center justify-between">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onPlaceFromBench(slotItem, bIdx);
                      }}
                      className="w-full h-full flex flex-col items-center justify-center text-[#d4a359] hover:text-[#f3c98b] transition-transform active:scale-90"
                      title="공방 그리드에 배치"
                    >
                      <GizmoIconRenderer iconName={slotItem.iconName} className="w-5 h-5" />
                      <span className="text-[9px] font-mono-tech truncate w-full text-center mt-0.5">
                        {slotItem.itemName}
                      </span>
                    </button>

                    {/* Sell Button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playClick();
                        onSellBenchItem(bIdx);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-900 border border-red-500 text-white flex items-center justify-center text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="판매"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-stone-700 text-xs font-mono-tech">빈 슬롯</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Start Battle Launch Button */}
        <div className="w-full md:w-auto flex flex-col items-center justify-center">
          <button
            onClick={() => {
              soundManager.playOverdriveLever();
              onStartCombat();
            }}
            disabled={!isReadyForBattle}
            className={`w-full md:w-56 py-3 px-6 rounded-xl font-cinzel font-black text-base md:text-lg flex items-center justify-center space-x-2 border-2 transition-all active:scale-95 ${
              isReadyForBattle
                ? 'bg-gradient-to-r from-[#c86d51] via-[#d4a359] to-[#8c5338] text-white border-[#f3c98b] shadow-brass-glow animate-pulse cursor-pointer hover:brightness-110'
                : 'bg-stone-900 text-stone-600 border-stone-800 cursor-not-allowed'
            }`}
          >
            <Swords className="w-6 h-6" />
            <span>비동기 대전 돌입!</span>
          </button>
          {!isReadyForBattle && (
            <span className="text-[10px] text-red-400 font-mono-tech mt-1 text-center">
              * 최소 1개 이상의 작동 가능한 부품이 필요합니다
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
