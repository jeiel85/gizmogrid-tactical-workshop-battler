// ==========================================
// GizmoGrid: Tactical Workshop Battler
// Core Data Types & Models
// ==========================================

export type GizmoType = 
  | 'PowerSource' 
  | 'Conductor' 
  | 'Weapon' 
  | 'Shield' 
  | 'Transistor';

export type PortType = 'power_out' | 'power_in';

export interface Vector2Int {
  x: number;
  y: number;
}

export interface GizmoPort {
  id: string;
  type: PortType;
  // Local grid offset relative to top-left of the gizmo before rotation
  localPos: Vector2Int;
  label?: string;
}

export interface GridItemData {
  itemId: string;
  itemName: string;
  gizmoType: GizmoType;
  width: number;
  height: number;
  powerInputPorts: Vector2Int[];
  powerOutputPorts: Vector2Int[];
  basePowerConsumption: number; // For weapons, shields, etc. (0 if passive or power source)
  outputEffectValue: number;    // Damage for weapons, shield for shields, generation for batteries
  cost: number;
  tier: number;
  description: string;
  flavorText?: string;
  iconName: string; // Lucide icon or custom SVG key
  soundType?: 'light' | 'heavy' | 'electric' | 'steam';
}

export interface PlacedGizmo {
  id: string;                   // Unique instance ID
  itemData: GridItemData;
  gridX: number;                // 0-indexed top-left X in grid
  gridY: number;                // 0-indexed top-left Y in grid
  rotation: number;             // 0, 90, 180, 270 degrees
  
  // Dynamic runtime state
  isPowered?: boolean;
  powerReceived?: number;
  isOverheated?: boolean;       // If disabled after Overdrive
  lastFiredTime?: number;
}

export interface WireConnection {
  id: string;
  fromGizmoId: string;
  fromPortIndex: number;        // Index in powerOutputPorts
  toGizmoId: string;
  toPortIndex: number;          // Index in powerInputPorts
  isActive?: boolean;           // Currently carrying current
  voltage?: number;
}

export interface WorkshopGridSnapshot {
  playerGhostId: string;
  rankRating: number;
  placedGizmos: PlacedGizmo[];
  wireLinks: WireConnection[];
  totalPowerGen?: number;
  totalPowerUse?: number;
}

export interface CombatEntity {
  id: string;
  name: string;
  isPlayer: boolean;
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  gridSnapshot: WorkshopGridSnapshot;
  isOverdriveActive: boolean;
  overdriveRemainingSec: number;
  overdriveUsed: boolean;
}

export interface CombatLogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'attack' | 'shield' | 'overdrive' | 'destroy' | 'info' | 'critical';
  isPlayerSource: boolean;
}

export interface FloatingNumber {
  id: string;
  x: number;
  y: number;
  value: number;
  type: 'damage' | 'shield' | 'heal' | 'crit';
}

export type GamePhase = 
  | 'workshop' 
  | 'combat' 
  | 'round_result' 
  | 'hall_of_fame' 
  | 'game_over';

export interface PlayerProgress {
  round: number;
  wins: number;
  losses: number;
  maxLives: number;
  gold: number;
  rankRating: number;
  inventoryBench: GridItemData[]; // Items bought but not yet placed on grid
}
