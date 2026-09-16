import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  PlacedGizmo, 
  WireConnection, 
  GridItemData, 
  PlayerProgress, 
  WorkshopGridSnapshot,
  CombatEntity 
} from './types/game';
import { GIZMO_CATALOG, GIZMO_DICT } from './data/gizmos';
import { getGhostForRound } from './data/ghostBuilds';
import { evaluateCircuit, getRotatedDimensions } from './engine/circuitBfs';
import { initCombatEntity } from './engine/combatEngine';
import { Header } from './components/Header';
import { WorkshopGrid } from './components/WorkshopGrid';
import { ShopPanel } from './components/ShopPanel';
import { CombatArena } from './components/CombatArena';
import { BlueprintModal } from './components/BlueprintModal';
import { VictoryModal } from './components/VictoryModal';
import { soundManager } from './engine/audioEngine';

export const App: React.FC = () => {
  // Grid size constants
  const GRID_COLS = 7;
  const GRID_ROWS = 6;

  // 1. Player Progress State
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    return {
      round: 1,
      wins: 0,
      losses: 0,
      maxLives: 3,
      gold: 10,
      rankRating: 1000,
      inventoryBench: []
    };
  });

  // Bench Slots (fixed 5 capacity)
  const [benchItems, setBenchItems] = useState<(GridItemData | null)[]>([
    GIZMO_DICT['steam_sawblade'] || null,
    null,
    null,
    null,
    null
  ]);

  // 2. Placed Gizmos & Wires in Workshop
  const [placedGizmos, setPlacedGizmos] = useState<PlacedGizmo[]>([
    // Starter loadout
    {
      id: 'starter_battery',
      itemData: GIZMO_DICT['pocket_battery'],
      gridX: 1,
      gridY: 2,
      rotation: 0,
      isPowered: true,
      powerReceived: 1.5
    },
    {
      id: 'starter_dagger',
      itemData: GIZMO_DICT['clockwork_dagger'],
      gridX: 3,
      gridY: 2,
      rotation: 0,
      isPowered: true,
      powerReceived: 1.5
    }
  ]);

  const [wireLinks, setWireLinks] = useState<WireConnection[]>([
    {
      id: 'starter_wire',
      fromGizmoId: 'starter_battery',
      fromPortIndex: 0,
      toGizmoId: 'starter_dagger',
      toPortIndex: 0,
      isActive: true
    }
  ]);

  const [selectedGizmoId, setSelectedGizmoId] = useState<string | null>(null);

  // 3. Shop Items
  const [shopItems, setShopItems] = useState<GridItemData[]>([]);

  // 4. Combat & Modals State
  const [phase, setPhase] = useState<'workshop' | 'combat'>('workshop');
  const [combatEntities, setCombatEntities] = useState<{ player: CombatEntity; enemy: CombatEntity } | null>(null);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);
  const [roundResult, setRoundResult] = useState<{
    isOpen: boolean;
    result: 'win' | 'loss';
    goldEarned: number;
  }>({
    isOpen: false,
    result: 'win',
    goldEarned: 0
  });

  // Evaluate circuits whenever gizmos or wires change
  const circuitStatus = useMemo(() => {
    return evaluateCircuit(placedGizmos, wireLinks);
  }, [placedGizmos, wireLinks]);

  // Update powered state
  useEffect(() => {
    // Only update if powered state actually changed to avoid re-render loops
    let hasChanged = false;
    placedGizmos.forEach((g, idx) => {
      const evalItem = circuitStatus.placedGizmos[idx];
      if (evalItem && (g.isPowered !== evalItem.isPowered || g.powerReceived !== evalItem.powerReceived)) {
        hasChanged = true;
      }
    });

    if (hasChanged) {
      setPlacedGizmos(circuitStatus.placedGizmos);
      setWireLinks(circuitStatus.wireLinks);
    }
  }, [circuitStatus]);

  // Generate 3 random shop items based on current round
  const generateShopItems = useCallback((round: number) => {
    const maxTier = Math.min(4, Math.floor(round / 2.5) + 1);
    const pool = GIZMO_CATALOG.filter(item => item.tier <= maxTier);
    const selected: GridItemData[] = [];

    for (let i = 0; i < 3; i++) {
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      selected.push(randomItem);
    }
    return selected;
  }, []);

  // Initial shop roll
  useEffect(() => {
    setShopItems(generateShopItems(progress.round));
  }, [generateShopItems, progress.round]);

  // Buy item from shop
  const handleBuyItem = (item: GridItemData, shopIndex: number) => {
    const emptyBenchIndex = benchItems.findIndex(b => b === null);
    if (emptyBenchIndex === -1) {
      alert('보관 벤치에 빈 공간이 없습니다! 기존 부품을 배치하거나 판매하세요.');
      return;
    }

    if (progress.gold < item.cost) return;

    setProgress(prev => ({
      ...prev,
      gold: prev.gold - item.cost
    }));

    // Put into bench
    const newBench = [...benchItems];
    newBench[emptyBenchIndex] = item;
    setBenchItems(newBench);

    // Replace shop item with fresh one
    const pool = GIZMO_CATALOG.filter(g => g.tier <= Math.min(4, Math.floor(progress.round / 2.5) + 1));
    const nextItem = pool[Math.floor(Math.random() * pool.length)];
    const newShop = [...shopItems];
    newShop[shopIndex] = nextItem;
    setShopItems(newShop);
  };

  // Reroll shop
  const handleReroll = () => {
    if (progress.gold < 1) return;
    setProgress(prev => ({ ...prev, gold: prev.gold - 1 }));
    setShopItems(generateShopItems(progress.round));
  };

  // Smart Snap: find the first vacant spot on grid that fits the gizmo
  const findVacantGridPos = (width: number, height: number): { x: number; y: number } | null => {
    // Check occupied cells
    const occupied = new Set<string>();
    placedGizmos.forEach(g => {
      const dims = getRotatedDimensions(g.itemData.width, g.itemData.height, g.rotation);
      for (let dx = 0; dx < dims.width; dx++) {
        for (let dy = 0; dy < dims.height; dy++) {
          occupied.add(`${g.gridX + dx},${g.gridY + dy}`);
        }
      }
    });

    for (let y = 0; y <= GRID_ROWS - height; y++) {
      for (let x = 0; x <= GRID_COLS - width; x++) {
        let fits = true;
        for (let dx = 0; dx < width; dx++) {
          for (let dy = 0; dy < height; dy++) {
            if (occupied.has(`${x + dx},${y + dy}`)) {
              fits = false;
              break;
            }
          }
          if (!fits) break;
        }
        if (fits) return { x, y };
      }
    }
    return null;
  };

  // Place item from bench onto workshop grid (Smart Snap)
  const handlePlaceFromBench = (item: GridItemData, benchIndex: number) => {
    const spot = findVacantGridPos(item.width, item.height);
    if (!spot) {
      alert('공방 그리드에 해당 부품을 배치할 여유 공간이 없습니다!');
      return;
    }

    const newGizmo: PlacedGizmo = {
      id: `gizmo_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      itemData: item,
      gridX: spot.x,
      gridY: spot.y,
      rotation: 0,
      isPowered: false,
      powerReceived: 0
    };

    setPlacedGizmos(prev => [...prev, newGizmo]);
    setSelectedGizmoId(newGizmo.id);

    // Remove from bench
    const nextBench = [...benchItems];
    nextBench[benchIndex] = null;
    setBenchItems(nextBench);
  };

  // Return placed gizmo back to bench
  const handleReturnToBench = (gizmo: PlacedGizmo) => {
    const emptyIndex = benchItems.findIndex(b => b === null);
    if (emptyIndex === -1) {
      alert('보관 벤치에 빈 자리가 없어 복귀할 수 없습니다.');
      return;
    }

    // Remove gizmo and its connected wires
    setPlacedGizmos(prev => prev.filter(g => g.id !== gizmo.id));
    setWireLinks(prev => prev.filter(w => w.fromGizmoId !== gizmo.id && w.toGizmoId !== gizmo.id));
    setSelectedGizmoId(null);

    const nextBench = [...benchItems];
    nextBench[emptyIndex] = gizmo.itemData;
    setBenchItems(nextBench);
  };

  // Sell item from bench
  const handleSellBenchItem = (benchIndex: number) => {
    const item = benchItems[benchIndex];
    if (!item) return;

    const sellPrice = Math.max(1, Math.floor(item.cost * 0.75));
    setProgress(prev => ({ ...prev, gold: prev.gold + sellPrice }));

    const nextBench = [...benchItems];
    nextBench[benchIndex] = null;
    setBenchItems(nextBench);
  };

  // Start Asynchronous Combat against Ghost
  const handleStartCombat = (customEnemy?: WorkshopGridSnapshot) => {
    const playerSnapshot: WorkshopGridSnapshot = {
      playerGhostId: 'Player Machine',
      rankRating: progress.rankRating,
      placedGizmos,
      wireLinks
    };

    const enemySnapshot = customEnemy || getGhostForRound(progress.round);

    const playerEntity = initCombatEntity('p1', '내 공방 전함', true, playerSnapshot, 100 + (progress.round - 1) * 10);
    const enemyEntity = initCombatEntity('e1', enemySnapshot.playerGhostId, false, enemySnapshot, 90 + (progress.round - 1) * 15);

    setCombatEntities({ player: playerEntity, enemy: enemyEntity });
    setPhase('combat');
  };

  // Handle combat end result
  const handleCombatEnd = (winner: 'player' | 'enemy') => {
    const isWin = winner === 'player';
    const goldReward = isWin ? 5 + progress.round : 2;

    setProgress(prev => ({
      ...prev,
      wins: isWin ? prev.wins + 1 : prev.wins,
      losses: isWin ? prev.losses : prev.losses + 1,
      gold: prev.gold + goldReward,
      rankRating: isWin ? prev.rankRating + 35 : Math.max(800, prev.rankRating - 20)
    }));

    setRoundResult({
      isOpen: true,
      result: isWin ? 'win' : 'loss',
      goldEarned: goldReward
    });
  };

  // Continue to next round after combat
  const handleContinueAfterCombat = () => {
    setRoundResult(prev => ({ ...prev, isOpen: false }));
    setPhase('workshop');
    setProgress(prev => ({
      ...prev,
      round: prev.round + 1
    }));
    setShopItems(generateShopItems(progress.round + 1));
  };

  // Restart new game
  const handleRestartGame = () => {
    setProgress({
      round: 1,
      wins: 0,
      losses: 0,
      maxLives: 3,
      gold: 10,
      rankRating: 1000,
      inventoryBench: []
    });
    setBenchItems([GIZMO_DICT['steam_sawblade'] || null, null, null, null, null]);
    setPlacedGizmos([
      {
        id: 'starter_battery',
        itemData: GIZMO_DICT['pocket_battery'],
        gridX: 1,
        gridY: 2,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.5
      },
      {
        id: 'starter_dagger',
        itemData: GIZMO_DICT['clockwork_dagger'],
        gridX: 3,
        gridY: 2,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.5
      }
    ]);
    setWireLinks([
      {
        id: 'starter_wire',
        fromGizmoId: 'starter_battery',
        fromPortIndex: 0,
        toGizmoId: 'starter_dagger',
        toPortIndex: 0,
        isActive: true
      }
    ]);
    setRoundResult(prev => ({ ...prev, isOpen: false }));
    setPhase('workshop');
  };

  // Load blueprint code directly into workshop
  const handleLoadBlueprintToWorkshop = (snapshot: WorkshopGridSnapshot) => {
    setPlacedGizmos(snapshot.placedGizmos);
    setWireLinks(snapshot.wireLinks);
    setSelectedGizmoId(null);
  };

  // Check if player has at least 1 powered weapon or shield ready
  const isReadyForBattle = useMemo(() => {
    return circuitStatus.placedGizmos.some(g => g.isPowered && (g.itemData.gizmoType === 'Weapon' || g.itemData.gizmoType === 'Shield'));
  }, [circuitStatus]);

  const currentSnapshot: WorkshopGridSnapshot = {
    playerGhostId: 'Player Prototype',
    rankRating: progress.rankRating,
    placedGizmos,
    wireLinks
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Header */}
      <Header
        progress={progress}
        onOpenBlueprint={() => setIsBlueprintOpen(true)}
        totalPowerGen={circuitStatus.totalPowerGen}
        totalPowerUse={circuitStatus.totalPowerUse}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col items-center justify-center gap-6">
        {phase === 'workshop' ? (
          <div className="w-full flex flex-col items-center gap-6">
            {/* Workshop Grid & Interactive Wiring */}
            <WorkshopGrid
              gridCols={GRID_COLS}
              gridRows={GRID_ROWS}
              placedGizmos={placedGizmos}
              wireLinks={wireLinks}
              onUpdateGizmos={setPlacedGizmos}
              onUpdateWires={setWireLinks}
              onSelectGizmo={(g) => setSelectedGizmoId(g ? g.id : null)}
              selectedGizmoId={selectedGizmoId}
              onReturnToBench={handleReturnToBench}
            />

            {/* Shop & Inventory Bench */}
            <ShopPanel
              shopItems={shopItems}
              benchItems={benchItems}
              gold={progress.gold}
              onBuyItem={handleBuyItem}
              onReroll={handleReroll}
              onPlaceFromBench={handlePlaceFromBench}
              onSellBenchItem={handleSellBenchItem}
              onStartCombat={() => handleStartCombat()}
              isReadyForBattle={isReadyForBattle}
            />
          </div>
        ) : (
          /* Combat Arena */
          combatEntities && (
            <CombatArena
              initialPlayer={combatEntities.player}
              initialEnemy={combatEntities.enemy}
              onCombatEnd={handleCombatEnd}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-2 bg-[#120e0b] border-t border-[#3d2a1f] text-center text-xs text-[#a89080] font-mono-tech">
        <span>GizmoGrid: Tactical Workshop Battler • v1.0.0 • Steam & Mobile Ready</span>
      </footer>

      {/* Blueprint Sharing Modal */}
      <BlueprintModal
        currentSnapshot={currentSnapshot}
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
        onLoadBlueprintToWorkshop={handleLoadBlueprintToWorkshop}
        onStartSimulation={(simEnemy) => handleStartCombat(simEnemy)}
      />

      {/* Victory / Defeat Modal */}
      <VictoryModal
        isOpen={roundResult.isOpen}
        result={roundResult.result}
        wins={progress.wins}
        losses={progress.losses}
        maxLives={progress.maxLives}
        goldEarned={roundResult.goldEarned}
        onContinue={handleContinueAfterCombat}
        onRestartGame={handleRestartGame}
      />
    </div>
  );
};

export default App;
