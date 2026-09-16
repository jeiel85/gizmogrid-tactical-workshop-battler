// ==========================================
// GizmoGrid: Tactical Workshop Battler
// BFS Circuit Power Flow & Wire Topology Engine
// ==========================================

import { PlacedGizmo, WireConnection, Vector2Int } from '../types/game';

/**
 * Rotate local offset (x, y) based on gizmo width, height, and rotation degrees.
 */
export function getRotatedPortOffset(
  local: Vector2Int,
  width: number,
  height: number,
  rotation: number
): Vector2Int {
  const normRot = ((rotation % 360) + 360) % 360;
  switch (normRot) {
    case 90:
      return { x: height - 1 - local.y, y: local.x };
    case 180:
      return { x: width - 1 - local.x, y: height - 1 - local.y };
    case 270:
      return { x: local.y, y: width - 1 - local.x };
    case 0:
    default:
      return { x: local.x, y: local.y };
  }
}

/**
 * Get the bounding box size (width, height) after rotation
 */
export function getRotatedDimensions(width: number, height: number, rotation: number): { width: number; height: number } {
  const normRot = ((rotation % 360) + 360) % 360;
  if (normRot === 90 || normRot === 270) {
    return { width: height, height: width };
  }
  return { width, height };
}

/**
 * Get absolute grid position of a specific port on a placed gizmo
 */
export function getPortAbsoluteGridPos(
  gizmo: PlacedGizmo,
  portType: 'in' | 'out',
  portIndex: number
): Vector2Int {
  const ports = portType === 'in' ? gizmo.itemData.powerInputPorts : gizmo.itemData.powerOutputPorts;
  const rawOffset = ports[portIndex] || { x: 0, y: 0 };
  const rotated = getRotatedPortOffset(rawOffset, gizmo.itemData.width, gizmo.itemData.height, gizmo.rotation);
  return {
    x: gizmo.gridX + rotated.x,
    y: gizmo.gridY + rotated.y
  };
}

export interface CircuitEvaluationResult {
  placedGizmos: PlacedGizmo[];
  wireLinks: WireConnection[];
  totalPowerGen: number;
  totalPowerUse: number;
  isBalanced: boolean;
}

/**
 * 너비 우선 탐색(BFS) 기반 회로 전력 전달 엔진
 * 1. 모든 전원 공급원(PowerSource) 노드를 큐에 삽입
 * 2. 전선(WireConnection)을 따라 연결된 하류 노드로 전력(전압) 전파
 * 3. 트랜지스터/증폭기를 거치면 전력 배율(outputEffectValue) 적용
 * 4. 각 액추에이터(무기, 방패 등)에 도달한 전력이 필요 소비 전력(basePowerConsumption)을 충족하는지 검증
 */
export function evaluateCircuit(
  placedGizmos: PlacedGizmo[],
  wireLinks: WireConnection[]
): CircuitEvaluationResult {
  // Map for fast lookup
  const gizmoMap = new Map<string, PlacedGizmo>();
  placedGizmos.forEach(g => {
    gizmoMap.set(g.id, {
      ...g,
      isPowered: false,
      powerReceived: 0
    });
  });

  // Wire lookup by fromGizmoId
  const wiresFromMap = new Map<string, WireConnection[]>();
  wireLinks.forEach(w => {
    const list = wiresFromMap.get(w.fromGizmoId) || [];
    list.push(w);
    wiresFromMap.set(w.fromGizmoId, list);
  });

  let totalPowerGen = 0;
  let totalPowerUse = 0;

  // BFS Queue: [gizmoId, availablePower]
  const queue: Array<{ gizmoId: string; power: number }> = [];
  const visited = new Set<string>();

  // 1. Initialize BFS with all PowerSources
  gizmoMap.forEach((gizmo, id) => {
    if (gizmo.itemData.gizmoType === 'PowerSource') {
      const gen = gizmo.itemData.outputEffectValue;
      gizmo.isPowered = true;
      gizmo.powerReceived = gen;
      totalPowerGen += gen;
      queue.push({ gizmoId: id, power: gen });
      visited.add(id);
    }
  });

  // Track active wires
  const activeWireIds = new Set<string>();

  // 2. BFS Traversal
  while (queue.length > 0) {
    const { gizmoId, power } = queue.shift()!;
    const outgoingWires = wiresFromMap.get(gizmoId) || [];

    if (outgoingWires.length === 0) continue;

    // Power divided or distributed across outgoing connections
    const currentGizmo = gizmoMap.get(gizmoId);
    let powerMultiplier = 1.0;
    if (currentGizmo && currentGizmo.itemData.gizmoType === 'Transistor') {
      powerMultiplier = currentGizmo.itemData.outputEffectValue || 1.2;
    }

    const powerPerWire = (power * powerMultiplier) / outgoingWires.length;

    for (const wire of outgoingWires) {
      activeWireIds.add(wire.id);
      const targetGizmo = gizmoMap.get(wire.toGizmoId);
      if (!targetGizmo) continue;

      targetGizmo.powerReceived = (targetGizmo.powerReceived || 0) + powerPerWire;
      
      // Determine if target has enough power to function
      const required = targetGizmo.itemData.basePowerConsumption;
      if (targetGizmo.powerReceived >= required * 0.75) {
        targetGizmo.isPowered = true;
      }

      if (!visited.has(targetGizmo.id)) {
        visited.add(targetGizmo.id);
        // Only propagate further if it's a conductor or transistor
        if (targetGizmo.itemData.gizmoType === 'Transistor' || targetGizmo.itemData.gizmoType === 'Conductor') {
          queue.push({
            gizmoId: targetGizmo.id,
            power: targetGizmo.powerReceived
          });
        }
      }
    }
  }

  // Calculate total power usage for all powered devices
  gizmoMap.forEach(g => {
    if (g.isPowered && g.itemData.gizmoType !== 'PowerSource') {
      totalPowerUse += g.itemData.basePowerConsumption;
    }
  });

  const updatedGizmos = Array.from(gizmoMap.values());
  const updatedWires = wireLinks.map(w => ({
    ...w,
    isActive: activeWireIds.has(w.id)
  }));

  return {
    placedGizmos: updatedGizmos,
    wireLinks: updatedWires,
    totalPowerGen: Number(totalPowerGen.toFixed(1)),
    totalPowerUse: Number(totalPowerUse.toFixed(1)),
    isBalanced: totalPowerGen >= totalPowerUse
  };
}
