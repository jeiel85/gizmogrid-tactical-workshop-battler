// ==========================================
// GizmoGrid: Tactical Workshop Battler
// Asynchronous Enemy Ghost Builds Database (Rank 1 - 10)
// ==========================================

import { WorkshopGridSnapshot } from '../types/game';
import { GIZMO_DICT } from './gizmos';

export const GHOST_PRESETS: WorkshopGridSnapshot[] = [
  // Rank 1: 수습공 러스티 (Apprentice Rusty)
  {
    playerGhostId: '수습공 러스티 (Apprentice)',
    rankRating: 1050,
    placedGizmos: [
      {
        id: 'r1_battery',
        itemData: GIZMO_DICT['pocket_battery'],
        gridX: 2,
        gridY: 2,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.5
      },
      {
        id: 'r1_dagger_1',
        itemData: GIZMO_DICT['clockwork_dagger'],
        gridX: 3,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 0.75
      },
      {
        id: 'r1_dagger_2',
        itemData: GIZMO_DICT['clockwork_dagger'],
        gridX: 3,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 0.75
      }
    ],
    wireLinks: [
      {
        id: 'w1_1',
        fromGizmoId: 'r1_battery',
        fromPortIndex: 0,
        toGizmoId: 'r1_dagger_1',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w1_2',
        fromGizmoId: 'r1_battery',
        fromPortIndex: 0,
        toGizmoId: 'r1_dagger_2',
        toPortIndex: 0,
        isActive: true
      }
    ]
  },

  // Rank 2: 톱니바퀴 잭 (Jack the Saw)
  {
    playerGhostId: '톱니바퀴 잭 (Jack the Saw)',
    rankRating: 1120,
    placedGizmos: [
      {
        id: 'r2_dynamo',
        itemData: GIZMO_DICT['steam_dynamo'],
        gridX: 1,
        gridY: 2,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.2
      },
      {
        id: 'r2_saw',
        itemData: GIZMO_DICT['steam_sawblade'],
        gridX: 3,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.6
      },
      {
        id: 'r2_shield',
        itemData: GIZMO_DICT['steam_shield_emitter'],
        gridX: 3,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.6
      }
    ],
    wireLinks: [
      {
        id: 'w2_1',
        fromGizmoId: 'r2_dynamo',
        fromPortIndex: 0,
        toGizmoId: 'r2_saw',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w2_2',
        fromGizmoId: 'r2_dynamo',
        fromPortIndex: 1,
        toGizmoId: 'r2_shield',
        toPortIndex: 0,
        isActive: true
      }
    ]
  },

  // Rank 3: 연금술사 헬레나 (Alchemist Helena)
  {
    playerGhostId: '연금술사 헬레나 (Helena)',
    rankRating: 1200,
    placedGizmos: [
      {
        id: 'r3_dynamo',
        itemData: GIZMO_DICT['steam_dynamo'],
        gridX: 1,
        gridY: 2,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.2
      },
      {
        id: 'r3_splitter',
        itemData: GIZMO_DICT['copper_splitter'],
        gridX: 3,
        gridY: 2,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.6
      },
      {
        id: 'r3_dagger',
        itemData: GIZMO_DICT['clockwork_dagger'],
        gridX: 4,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 0.8
      },
      {
        id: 'r3_dynamite',
        itemData: GIZMO_DICT['dynamite_launcher'],
        gridX: 4,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.6
      },
      {
        id: 'r3_plating',
        itemData: GIZMO_DICT['brass_plating'],
        gridX: 1,
        gridY: 4,
        rotation: 0,
        isPowered: true,
        powerReceived: 0.8
      }
    ],
    wireLinks: [
      {
        id: 'w3_1',
        fromGizmoId: 'r3_dynamo',
        fromPortIndex: 0,
        toGizmoId: 'r3_splitter',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w3_2',
        fromGizmoId: 'r3_splitter',
        fromPortIndex: 0,
        toGizmoId: 'r3_dagger',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w3_3',
        fromGizmoId: 'r3_dynamo',
        fromPortIndex: 1,
        toGizmoId: 'r3_dynamite',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w3_4',
        fromGizmoId: 'r3_splitter',
        fromPortIndex: 0,
        toGizmoId: 'r3_plating',
        toPortIndex: 0,
        isActive: true
      }
    ]
  },

  // Rank 4: 불도저 기관사 (Bulldozer Engineer)
  {
    playerGhostId: '불도저 기관사 (Bulldozer)',
    rankRating: 1280,
    placedGizmos: [
      {
        id: 'r4_dynamo_1',
        itemData: GIZMO_DICT['steam_dynamo'],
        gridX: 1,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.2
      },
      {
        id: 'r4_dynamo_2',
        itemData: GIZMO_DICT['steam_dynamo'],
        gridX: 1,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.2
      },
      {
        id: 'r4_transformer',
        itemData: GIZMO_DICT['stepup_transformer'],
        gridX: 3,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 2.2
      },
      {
        id: 'r4_saw_1',
        itemData: GIZMO_DICT['steam_sawblade'],
        gridX: 5,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.0
      },
      {
        id: 'r4_repair',
        itemData: GIZMO_DICT['auto_repair_wrench'],
        gridX: 3,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.6
      }
    ],
    wireLinks: [
      {
        id: 'w4_1',
        fromGizmoId: 'r4_dynamo_1',
        fromPortIndex: 0,
        toGizmoId: 'r4_transformer',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w4_2',
        fromGizmoId: 'r4_transformer',
        fromPortIndex: 0,
        toGizmoId: 'r4_saw_1',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w4_3',
        fromGizmoId: 'r4_dynamo_2',
        fromPortIndex: 0,
        toGizmoId: 'r4_repair',
        toPortIndex: 0,
        isActive: true
      }
    ]
  },

  // Rank 5: 테슬라 공학사 니콜라 (Engineer Nikola)
  {
    playerGhostId: '테슬라 공학사 니콜라 (Nikola)',
    rankRating: 1360,
    placedGizmos: [
      {
        id: 'r5_tesla_acc',
        itemData: GIZMO_DICT['tesla_accumulator'],
        gridX: 1,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 6.0
      },
      {
        id: 'r5_arc_cannon',
        itemData: GIZMO_DICT['tesla_arc_cannon'],
        gridX: 4,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.5
      },
      {
        id: 'r5_aegis',
        itemData: GIZMO_DICT['aegis_forcefield'],
        gridX: 1,
        gridY: 4,
        rotation: 0,
        isPowered: true,
        powerReceived: 2.5
      }
    ],
    wireLinks: [
      {
        id: 'w5_1',
        fromGizmoId: 'r5_tesla_acc',
        fromPortIndex: 0,
        toGizmoId: 'r5_arc_cannon',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w5_2',
        fromGizmoId: 'r5_tesla_acc',
        fromPortIndex: 1,
        toGizmoId: 'r5_aegis',
        toPortIndex: 0,
        isActive: true
      }
    ]
  },

  // Rank 6: 크랭크 대령 (Colonel Crank)
  {
    playerGhostId: '크랭크 대령 (Colonel Crank)',
    rankRating: 1450,
    placedGizmos: [
      {
        id: 'r6_tesla_acc',
        itemData: GIZMO_DICT['tesla_accumulator'],
        gridX: 1,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 6.0
      },
      {
        id: 'r6_gatling',
        itemData: GIZMO_DICT['brass_gatling'],
        gridX: 4,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 2.8
      },
      {
        id: 'r6_saw',
        itemData: GIZMO_DICT['steam_sawblade'],
        gridX: 4,
        gridY: 4,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.8
      },
      {
        id: 'r6_shield',
        itemData: GIZMO_DICT['steam_shield_emitter'],
        gridX: 1,
        gridY: 4,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.4
      }
    ],
    wireLinks: [
      {
        id: 'w6_1',
        fromGizmoId: 'r6_tesla_acc',
        fromPortIndex: 0,
        toGizmoId: 'r6_gatling',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w6_2',
        fromGizmoId: 'r6_tesla_acc',
        fromPortIndex: 1,
        toGizmoId: 'r6_saw',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w6_3',
        fromGizmoId: 'r6_tesla_acc',
        fromPortIndex: 2,
        toGizmoId: 'r6_shield',
        toPortIndex: 0,
        isActive: true
      }
    ]
  },

  // Rank 7: 박격포 장인 볼트 (Master Bolt)
  {
    playerGhostId: '박격포 장인 볼트 (Master Bolt)',
    rankRating: 1540,
    placedGizmos: [
      {
        id: 'r7_flywheel',
        itemData: GIZMO_DICT['perpetual_flywheel'],
        gridX: 1,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 8.5
      },
      {
        id: 'r7_mortar',
        itemData: GIZMO_DICT['steam_mortar'],
        gridX: 3,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 4.5
      },
      {
        id: 'r7_dynamite',
        itemData: GIZMO_DICT['dynamite_launcher'],
        gridX: 4,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 2.0
      },
      {
        id: 'r7_plating',
        itemData: GIZMO_DICT['brass_plating'],
        gridX: 1,
        gridY: 4,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.5
      }
    ],
    wireLinks: [
      {
        id: 'w7_1',
        fromGizmoId: 'r7_flywheel',
        fromPortIndex: 0,
        toGizmoId: 'r7_mortar',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w7_2',
        fromGizmoId: 'r7_flywheel',
        fromPortIndex: 1,
        toGizmoId: 'r7_dynamite',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w7_3',
        fromGizmoId: 'r7_flywheel',
        fromPortIndex: 2,
        toGizmoId: 'r7_plating',
        toPortIndex: 0,
        isActive: true
      }
    ]
  },

  // Rank 8: 진공관 사제 옴 (Ohm the High Priest)
  {
    playerGhostId: '진공관 사제 옴 (High Priest Ohm)',
    rankRating: 1650,
    placedGizmos: [
      {
        id: 'r8_flywheel',
        itemData: GIZMO_DICT['perpetual_flywheel'],
        gridX: 1,
        gridY: 2,
        rotation: 0,
        isPowered: true,
        powerReceived: 8.5
      },
      {
        id: 'r8_tube',
        itemData: GIZMO_DICT['vacuum_tube_amplifier'],
        gridX: 3,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.5
      },
      {
        id: 'r8_arc_cannon',
        itemData: GIZMO_DICT['tesla_arc_cannon'],
        gridX: 4,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 5.5
      },
      {
        id: 'r8_aegis',
        itemData: GIZMO_DICT['aegis_forcefield'],
        gridX: 3,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.0
      }
    ],
    wireLinks: [
      {
        id: 'w8_1',
        fromGizmoId: 'r8_flywheel',
        fromPortIndex: 0,
        toGizmoId: 'r8_tube',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w8_2',
        fromGizmoId: 'r8_tube',
        fromPortIndex: 0,
        toGizmoId: 'r8_arc_cannon',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w8_3',
        fromGizmoId: 'r8_flywheel',
        fromPortIndex: 1,
        toGizmoId: 'r8_aegis',
        toPortIndex: 0,
        isActive: true
      }
    ]
  },

  // Rank 9: 영구동력학 교수 반헤이븐 (Professor Van Haven)
  {
    playerGhostId: '영구동력학 교수 반헤이븐 (Prof. Van Haven)',
    rankRating: 1780,
    placedGizmos: [
      {
        id: 'r9_flywheel',
        itemData: GIZMO_DICT['perpetual_flywheel'],
        gridX: 1,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 8.5
      },
      {
        id: 'r9_gatling',
        itemData: GIZMO_DICT['brass_gatling'],
        gridX: 4,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.0
      },
      {
        id: 'r9_arc',
        itemData: GIZMO_DICT['tesla_arc_cannon'],
        gridX: 4,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 3.5
      },
      {
        id: 'r9_repair',
        itemData: GIZMO_DICT['auto_repair_wrench'],
        gridX: 1,
        gridY: 4,
        rotation: 0,
        isPowered: true,
        powerReceived: 1.5
      }
    ],
    wireLinks: [
      {
        id: 'w9_1',
        fromGizmoId: 'r9_flywheel',
        fromPortIndex: 0,
        toGizmoId: 'r9_gatling',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w9_2',
        fromGizmoId: 'r9_flywheel',
        fromPortIndex: 1,
        toGizmoId: 'r9_arc',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w9_3',
        fromGizmoId: 'r9_flywheel',
        fromPortIndex: 2,
        toGizmoId: 'r9_repair',
        toPortIndex: 0,
        isActive: true
      }
    ]
  },

  // Rank 10: [명예의 전당 보스] 시계장치 거신 골리앗 (Clockwork Colossus Goliath)
  {
    playerGhostId: '★ 시계장치 거신 골리앗 (Clockwork Colossus)',
    rankRating: 2000,
    placedGizmos: [
      {
        id: 'r10_flywheel_1',
        itemData: GIZMO_DICT['perpetual_flywheel'],
        gridX: 1,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 8.5
      },
      {
        id: 'r10_flywheel_2',
        itemData: GIZMO_DICT['perpetual_flywheel'],
        gridX: 1,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 8.5
      },
      {
        id: 'r10_mortar',
        itemData: GIZMO_DICT['steam_mortar'],
        gridX: 3,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 5.0
      },
      {
        id: 'r10_gatling',
        itemData: GIZMO_DICT['brass_gatling'],
        gridX: 4,
        gridY: 3,
        rotation: 0,
        isPowered: true,
        powerReceived: 4.0
      },
      {
        id: 'r10_aegis',
        itemData: GIZMO_DICT['aegis_forcefield'],
        gridX: 6,
        gridY: 1,
        rotation: 0,
        isPowered: true,
        powerReceived: 4.0
      }
    ],
    wireLinks: [
      {
        id: 'w10_1',
        fromGizmoId: 'r10_flywheel_1',
        fromPortIndex: 0,
        toGizmoId: 'r10_mortar',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w10_2',
        fromGizmoId: 'r10_flywheel_2',
        fromPortIndex: 0,
        toGizmoId: 'r10_gatling',
        toPortIndex: 0,
        isActive: true
      },
      {
        id: 'w10_3',
        fromGizmoId: 'r10_flywheel_1',
        fromPortIndex: 1,
        toGizmoId: 'r10_aegis',
        toPortIndex: 0,
        isActive: true
      }
    ]
  }
];

export function getGhostForRound(round: number): WorkshopGridSnapshot {
  const index = Math.min(Math.max(round - 1, 0), GHOST_PRESETS.length - 1);
  return JSON.parse(JSON.stringify(GHOST_PRESETS[index]));
}
