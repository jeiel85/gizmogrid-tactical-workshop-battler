// ==========================================
// GizmoGrid: Tactical Workshop Battler
// Combat Simulation Engine
// ==========================================

import { CombatEntity, CombatLogEntry, FloatingNumber, WorkshopGridSnapshot } from '../types/game';
import { evaluateCircuit } from './circuitBfs';
import { soundManager } from './audioEngine';

export interface CombatTickResult {
  player: CombatEntity;
  enemy: CombatEntity;
  logs: CombatLogEntry[];
  floatingNumbers: FloatingNumber[];
  isFinished: boolean;
  winner: 'player' | 'enemy' | null;
}

/**
 * Initialize a combat entity from a snapshot
 */
export function initCombatEntity(
  id: string,
  name: string,
  isPlayer: boolean,
  snapshot: WorkshopGridSnapshot,
  baseHp: number = 100
): CombatEntity {
  // Pre-evaluate circuits so isPowered status is ready
  const evaluated = evaluateCircuit(snapshot.placedGizmos, snapshot.wireLinks);
  const cleanSnapshot: WorkshopGridSnapshot = {
    ...snapshot,
    placedGizmos: evaluated.placedGizmos,
    wireLinks: evaluated.wireLinks,
    totalPowerGen: evaluated.totalPowerGen,
    totalPowerUse: evaluated.totalPowerUse
  };

  return {
    id,
    name,
    isPlayer,
    hp: baseHp,
    maxHp: baseHp,
    shield: 0,
    maxShield: 100,
    gridSnapshot: cleanSnapshot,
    isOverdriveActive: false,
    overdriveRemainingSec: 0,
    overdriveUsed: false
  };
}

/**
 * Executes a single clock pulse tick for both player and enemy machines.
 * Clock pulse causes powered weapon and shield gizmos to fire.
 */
export function processCombatTick(
  player: CombatEntity,
  enemy: CombatEntity,
  pulseDeltaSec: number,
  pulseCount: number = 0
): CombatTickResult {
  const nextPlayer: CombatEntity = { ...player };
  const nextEnemy: CombatEntity = { ...enemy };
  const logs: CombatLogEntry[] = [];
  const floatingNumbers: FloatingNumber[] = [];

  // Sudden Death Fatigue: If combat exceeds 25 pulses (approx 15 seconds), boilers overheat!
  if (pulseCount >= 25) {
    const fatigueDmg = Math.min(50, 4 + Math.floor((pulseCount - 25) * 2));
    nextPlayer.hp = Math.max(0, nextPlayer.hp - fatigueDmg);
    nextEnemy.hp = Math.max(0, nextEnemy.hp - fatigueDmg);

    floatingNumbers.push(
      { id: `fn_fatigue_p_${Date.now()}`, x: 25, y: 35, value: fatigueDmg, type: 'crit' },
      { id: `fn_fatigue_e_${Date.now()}`, x: 75, y: 35, value: fatigueDmg, type: 'crit' }
    );

    logs.push({
      id: `log_fatigue_${pulseCount}`,
      timestamp: new Date().toLocaleTimeString(),
      text: `⚠️ [보일러 과열] 장기전 돌입으로 양측 머신에 ${fatigueDmg}의 과열 누전 피해!`,
      type: 'destroy',
      isPlayerSource: true
    });
  }

  // Update Overdrive Timers
  if (nextPlayer.isOverdriveActive) {
    nextPlayer.overdriveRemainingSec = Math.max(0, nextPlayer.overdriveRemainingSec - pulseDeltaSec);
    if (nextPlayer.overdriveRemainingSec <= 0) {
      nextPlayer.isOverdriveActive = false;
      // Penalty: Overheat random 1 powered weapon
      const poweredWeapons = nextPlayer.gridSnapshot.placedGizmos.filter(
        g => g.isPowered && g.itemData.gizmoType === 'Weapon' && !g.isOverheated
      );
      if (poweredWeapons.length > 0) {
        poweredWeapons[0].isOverheated = true;
        logs.push({
          id: `log_${Date.now()}_overheat`,
          timestamp: new Date().toLocaleTimeString(),
          text: `⚠️ [과부하 후폭풍] [${poweredWeapons[0].itemData.itemName}]의 퓨즈가 타버려 작동 중지!`,
          type: 'destroy',
          isPlayerSource: true
        });
      }
    }
  }

  // Enemy auto-triggers overdrive when HP < 40%
  if (!nextEnemy.overdriveUsed && nextEnemy.hp <= nextEnemy.maxHp * 0.45) {
    nextEnemy.overdriveUsed = true;
    nextEnemy.isOverdriveActive = true;
    nextEnemy.overdriveRemainingSec = 3.0;
    logs.push({
      id: `log_${Date.now()}_enemy_od`,
      timestamp: new Date().toLocaleTimeString(),
      text: `🔥 [경고] 적 ${nextEnemy.name}이(가) '과부하 퓨즈 레버'를 당겨 300% 폭주합니다!`,
      type: 'overdrive',
      isPlayerSource: false
    });
  }

  if (nextEnemy.isOverdriveActive) {
    nextEnemy.overdriveRemainingSec = Math.max(0, nextEnemy.overdriveRemainingSec - pulseDeltaSec);
    if (nextEnemy.overdriveRemainingSec <= 0) {
      nextEnemy.isOverdriveActive = false;
    }
  }

  // --- 1. Player Gadgets Action ---
  const playerCrit = nextPlayer.isOverdriveActive;
  for (const gizmo of nextPlayer.gridSnapshot.placedGizmos) {
    if (!gizmo.isPowered || gizmo.isOverheated) continue;

    if (gizmo.itemData.gizmoType === 'Weapon') {
      let dmg = gizmo.itemData.outputEffectValue;
      let isCrit = playerCrit || Math.random() < 0.15;
      if (isCrit) {
        dmg = Math.round(dmg * 2.0);
      }

      // Check for shield pierce (e.g. Tesla Arc Cannon)
      const pierce = gizmo.itemData.itemId === 'tesla_arc_cannon' ? 0.5 : 0;
      applyDamageToTarget(nextEnemy, dmg, pierce, floatingNumbers, isCrit);

      if (gizmo.itemData.soundType === 'heavy') soundManager.playAttackHeavy();
      else if (gizmo.itemData.soundType === 'electric') soundManager.playPulse();
      else soundManager.playAttackLight();

      logs.push({
        id: `log_${Date.now()}_p_${gizmo.id}`,
        timestamp: new Date().toLocaleTimeString(),
        text: `⚔️ [아군] ${gizmo.itemData.itemName} 발동! ${enemy.name}에게 ${dmg}의 ${isCrit ? '치명타 피해!' : '피해!'}`,
        type: isCrit ? 'critical' : 'attack',
        isPlayerSource: true
      });

      // If enemy is destroyed by this hit, break immediately!
      if (nextEnemy.hp <= 0) break;
    } else if (gizmo.itemData.gizmoType === 'Shield') {
      const shieldVal = gizmo.itemData.outputEffectValue;
      if (gizmo.itemData.itemId === 'auto_repair_wrench') {
        if (nextPlayer.hp > 0) {
          const prevHp = nextPlayer.hp;
          nextPlayer.hp = Math.min(nextPlayer.maxHp, nextPlayer.hp + shieldVal);
          const healed = nextPlayer.hp - prevHp;
          floatingNumbers.push({
            id: `fn_heal_${Date.now()}_${Math.random()}`,
            x: 25,
            y: 60,
            value: healed,
            type: 'heal'
          });
          logs.push({
            id: `log_${Date.now()}_p_heal`,
            timestamp: new Date().toLocaleTimeString(),
            text: `🔧 [아군] 자동 수리 키트 작동! 본체 체력 +${healed} 수리 완료.`,
            type: 'shield',
            isPlayerSource: true
          });
        }
      } else {
        nextPlayer.shield = Math.min(nextPlayer.maxShield, nextPlayer.shield + shieldVal);
        soundManager.playShield();
        floatingNumbers.push({
          id: `fn_shield_${Date.now()}_${Math.random()}`,
          x: 25,
          y: 50,
          value: shieldVal,
          type: 'shield'
        });
      }
    }
  }

  // If enemy was destroyed by player's attacks, stop here - no counterattack or zombie heal!
  if (nextEnemy.hp <= 0) {
    return {
      player: nextPlayer,
      enemy: nextEnemy,
      logs: [
        ...logs,
        {
          id: `log_${Date.now()}_enemy_destroyed`,
          timestamp: new Date().toLocaleTimeString(),
          text: `💥 [적 파괴!] ${nextEnemy.name}의 동력 코어가 파괴되었습니다!`,
          type: 'destroy',
          isPlayerSource: true
        }
      ],
      floatingNumbers,
      isFinished: true,
      winner: 'player'
    };
  }

  // --- 2. Enemy Gadgets Action (Only if enemy is still alive) ---
  const enemyCrit = nextEnemy.isOverdriveActive;
  for (const gizmo of nextEnemy.gridSnapshot.placedGizmos) {
    if (!gizmo.isPowered || gizmo.isOverheated) continue;

    if (gizmo.itemData.gizmoType === 'Weapon') {
      let dmg = gizmo.itemData.outputEffectValue;
      let isCrit = enemyCrit || Math.random() < 0.12;
      if (isCrit) dmg = Math.round(dmg * 2.0);

      const pierce = gizmo.itemData.itemId === 'tesla_arc_cannon' ? 0.5 : 0;
      applyDamageToTarget(nextPlayer, dmg, pierce, floatingNumbers, isCrit);

      logs.push({
        id: `log_${Date.now()}_e_${gizmo.id}`,
        timestamp: new Date().toLocaleTimeString(),
        text: `💥 [적] ${gizmo.itemData.itemName} 발동! 아군에게 ${dmg}의 ${isCrit ? '치명타 공격!' : '공격!'}`,
        type: isCrit ? 'critical' : 'attack',
        isPlayerSource: false
      });

      // If player is destroyed, break immediately!
      if (nextPlayer.hp <= 0) break;
    } else if (gizmo.itemData.gizmoType === 'Shield') {
      const shieldVal = gizmo.itemData.outputEffectValue;
      if (gizmo.itemData.itemId === 'auto_repair_wrench') {
        // Can ONLY heal if enemy is alive
        if (nextEnemy.hp > 0) {
          nextEnemy.hp = Math.min(nextEnemy.maxHp, nextEnemy.hp + shieldVal);
          floatingNumbers.push({
            id: `fn_eheal_${Date.now()}_${Math.random()}`,
            x: 75,
            y: 60,
            value: shieldVal,
            type: 'heal'
          });
        }
      } else {
        nextEnemy.shield = Math.min(nextEnemy.maxShield, nextEnemy.shield + shieldVal);
        floatingNumbers.push({
          id: `fn_eshield_${Date.now()}_${Math.random()}`,
          x: 75,
          y: 50,
          value: shieldVal,
          type: 'shield'
        });
      }
    }
  }

  // Check victory / defeat
  let isFinished = false;
  let winner: 'player' | 'enemy' | null = null;

  if (nextEnemy.hp <= 0 && nextPlayer.hp <= 0) {
    isFinished = true;
    winner = 'player';
  } else if (nextEnemy.hp <= 0) {
    isFinished = true;
    winner = 'player';
  } else if (nextPlayer.hp <= 0) {
    isFinished = true;
    winner = 'enemy';
  }

  return {
    player: nextPlayer,
    enemy: nextEnemy,
    logs,
    floatingNumbers,
    isFinished,
    winner
  };
}

/**
 * Apply damage taking shields into account
 */
function applyDamageToTarget(
  target: CombatEntity,
  damage: number,
  pierceRatio: number,
  floatingNumbers: FloatingNumber[],
  isCrit: boolean
) {
  let directHpDmg = Math.round(damage * pierceRatio);
  let regularDmg = damage - directHpDmg;

  let shieldAbsorbed = 0;
  if (target.shield > 0) {
    if (target.shield >= regularDmg) {
      target.shield -= regularDmg;
      shieldAbsorbed = regularDmg;
      regularDmg = 0;
    } else {
      regularDmg -= target.shield;
      shieldAbsorbed = target.shield;
      target.shield = 0;
    }
  }

  const finalHpLoss = directHpDmg + regularDmg;
  target.hp = Math.max(0, target.hp - finalHpLoss);

  // Add floating number for visual impact
  floatingNumbers.push({
    id: `fn_${Date.now()}_${Math.random()}`,
    x: target.isPlayer ? 25 : 75,
    y: 40,
    value: finalHpLoss + shieldAbsorbed,
    type: isCrit ? 'crit' : 'damage'
  });
}
