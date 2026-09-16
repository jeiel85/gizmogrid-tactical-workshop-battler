// ==========================================
// GizmoGrid: Tactical Workshop Battler
// Blueprint Codec (Export/Import/Share)
// ==========================================

import { WorkshopGridSnapshot } from '../types/game';
import { GIZMO_DICT } from '../data/gizmos';

/**
 * Encode a workshop grid snapshot into a portable Blueprint string.
 * Uses compact JSON + Base64 encoding.
 */
export function exportBlueprintCode(snapshot: WorkshopGridSnapshot): string {
  try {
    const compactData = {
      v: 1,
      id: snapshot.playerGhostId,
      r: snapshot.rankRating,
      g: snapshot.placedGizmos.map(g => ({
        i: g.itemData.itemId,
        x: g.gridX,
        y: g.gridY,
        r: g.rotation
      })),
      w: snapshot.wireLinks.map(w => ({
        f: w.fromGizmoId,
        fp: w.fromPortIndex,
        t: w.toGizmoId,
        tp: w.toPortIndex
      }))
    };

    const json = JSON.stringify(compactData);
    const base64 = btoa(encodeURIComponent(json));
    return `GIZMO-${base64}`;
  } catch (err) {
    console.error('Failed to export blueprint:', err);
    return '';
  }
}

/**
 * Decode a Blueprint string back into a WorkshopGridSnapshot.
 */
export function importBlueprintCode(code: string): WorkshopGridSnapshot | null {
  try {
    let cleanCode = code.trim();
    if (cleanCode.startsWith('GIZMO-')) {
      cleanCode = cleanCode.replace('GIZMO-', '');
    }

    const json = decodeURIComponent(atob(cleanCode));
    const data = JSON.parse(json);

    if (!data || !Array.isArray(data.g)) {
      return null;
    }

    // Reconstruct placed gizmos with full item data
    const placedGizmos = data.g.map((item: { i: string; x: number; y: number; r: number }, idx: number) => {
      const template = GIZMO_DICT[item.i];
      if (!template) return null;
      return {
        id: `imported_gizmo_${idx}_${Date.now()}`,
        itemData: template,
        gridX: item.x,
        gridY: item.y,
        rotation: item.r || 0,
        isPowered: false,
        powerReceived: 0
      };
    }).filter(Boolean);

    // Reconstruct wire links
    // Since imported gizmo IDs were generated, map from original index if needed
    const wireLinks = (data.w || []).map((w: { f: string; fp: number; t: string; tp: number }, idx: number) => {
      return {
        id: `imported_wire_${idx}_${Date.now()}`,
        fromGizmoId: w.f,
        fromPortIndex: w.fp,
        toGizmoId: w.t,
        toPortIndex: w.tp,
        isActive: false
      };
    });

    return {
      playerGhostId: data.id || 'Blueprint-Prototype',
      rankRating: data.r || 1000,
      placedGizmos,
      wireLinks
    };
  } catch (err) {
    console.error('Failed to parse blueprint code:', err);
    return null;
  }
}
