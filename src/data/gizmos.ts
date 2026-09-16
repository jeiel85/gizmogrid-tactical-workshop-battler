// ==========================================
// GizmoGrid: Tactical Workshop Battler
// Gizmo Database (20+ Steampunk Workshop Parts)
// ==========================================

import { GridItemData } from '../types/game';

export const GIZMO_CATALOG: GridItemData[] = [
  // --- 1. 전원 공급원 (Power Source) ---
  {
    itemId: 'pocket_battery',
    itemName: '초소형 볼타 전지',
    gizmoType: 'PowerSource',
    width: 1,
    height: 1,
    powerInputPorts: [],
    powerOutputPorts: [{ x: 0, y: 0 }],
    basePowerConsumption: 0,
    outputEffectValue: 1.5, // 1.5V 전력 생성
    cost: 3,
    tier: 1,
    description: '작지만 끈질긴 1구 구리 아연 전지. 단일 무기나 전선에 안정적으로 전력을 공급합니다.',
    flavorText: '공방 수습생들이 가장 먼저 납땜하는 기초 전원 장치.',
    iconName: 'BatteryCharging',
    soundType: 'electric'
  },
  {
    itemId: 'steam_dynamo',
    itemName: '황동 증기 다이나모',
    gizmoType: 'PowerSource',
    width: 2,
    height: 1,
    powerInputPorts: [],
    powerOutputPorts: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
    basePowerConsumption: 0,
    outputEffectValue: 3.2, // 3.2V 2구 출력
    cost: 6,
    tier: 2,
    description: '소형 피스톤으로 가동되는 다이나모. 2개의 출력 단자로 고전력을 동시에 송출합니다.',
    flavorText: '석탄 분말과 고온 증기로 맹렬히 회전하는 황동 로터.',
    iconName: 'Cpu',
    soundType: 'steam'
  },
  {
    itemId: 'tesla_accumulator',
    itemName: '테슬라 대용량 축전기',
    gizmoType: 'PowerSource',
    width: 2,
    height: 2,
    powerInputPorts: [],
    powerOutputPorts: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }],
    basePowerConsumption: 0,
    outputEffectValue: 6.0, // 6.0V 3구 출력
    cost: 11,
    tier: 3,
    description: '진공 유리관 속 번개를 가둔 축전기. 3개의 단자에 거대한 전력을 뿜어냅니다.',
    flavorText: '근처에 서있기만 해도 머리카락이 곤두서는 고전압 방전체.',
    iconName: 'Zap',
    soundType: 'electric'
  },
  {
    itemId: 'perpetual_flywheel',
    itemName: '영구 동력 플라이휠',
    gizmoType: 'PowerSource',
    width: 2,
    height: 2,
    powerInputPorts: [],
    powerOutputPorts: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
    basePowerConsumption: 0,
    outputEffectValue: 8.5, // 8.5V 4구 출력
    cost: 16,
    tier: 4,
    description: '비전 역학으로 제작된 4구 초중량 플라이휠. 전 공방 시스템에 무한에 가까운 전력을 순환시킵니다.',
    flavorText: '한 번 회전하기 시작하면 멈추지 않는 공학적 기적.',
    iconName: 'RotateCw',
    soundType: 'heavy'
  },

  // --- 2. 회로 배선 & 도체/트랜지스터 (Conductor & Transistor) ---
  {
    itemId: 'copper_splitter',
    itemName: '구리 릴레이 스플리터',
    gizmoType: 'Transistor',
    width: 1,
    height: 1,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [{ x: 0, y: 0 }],
    basePowerConsumption: 0.1,
    outputEffectValue: 1.0, // 1 입력 전력을 그대로 복제/중계
    cost: 2,
    tier: 1,
    description: '1개의 입력 전력을 받아 다중 전선으로 분기해 주는 핵심 배선 릴레이.',
    flavorText: '전선이 부족할 땐 구리 접점을 더 엮으면 된다.',
    iconName: 'Split',
    soundType: 'electric'
  },
  {
    itemId: 'stepup_transformer',
    itemName: '승압 변압 트랜스포머',
    gizmoType: 'Transistor',
    width: 2,
    height: 1,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [{ x: 1, y: 0 }],
    basePowerConsumption: 0.5,
    outputEffectValue: 1.4, // 출력 전력을 40% 증폭
    cost: 5,
    tier: 2,
    description: '입력된 전력을 1.4배로 증폭하여 출력 단자로 뿜어냅니다. 고화력 무기 연결 필수 부품.',
    flavorText: '묵직한 웅웅거림과 함께 코일이 새빨갛게 달아오릅니다.',
    iconName: 'Gauge',
    soundType: 'electric'
  },
  {
    itemId: 'clockwork_sequencer',
    itemName: '태엽식 펄스 시퀀서',
    gizmoType: 'Transistor',
    width: 1,
    height: 2,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [{ x: 0, y: 1 }],
    basePowerConsumption: 0.3,
    outputEffectValue: 1.6, // 주기적 리듬 증폭
    cost: 6,
    tier: 2,
    description: '일정한 틱 간격으로 전력을 응축해 발사하여 무기 치명타 확률을 25% 상승시킵니다.',
    flavorText: '째깍거리는 금속 태엽의 정밀한 심장박동.',
    iconName: 'Clock',
    soundType: 'light'
  },
  {
    itemId: 'vacuum_tube_amplifier',
    itemName: '오버드라이브 3극 진공관',
    gizmoType: 'Transistor',
    width: 1,
    height: 1,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [{ x: 0, y: 0 }],
    basePowerConsumption: 0.8,
    outputEffectValue: 1.8, // 80% 고출력 증폭
    cost: 9,
    tier: 3,
    description: '극도로 높은 전압 증폭률을 자랑합니다. 오버드라이브 발동 시 효과가 2.5배로 폭주합니다.',
    flavorText: '오렌지빛 필라멘트가 뿜어내는 백열의 힘.',
    iconName: 'Radio',
    soundType: 'electric'
  },

  // --- 3. 무기 액추에이터 (Weapon) ---
  {
    itemId: 'clockwork_dagger',
    itemName: '태엽 단검 발사기',
    gizmoType: 'Weapon',
    width: 1,
    height: 1,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [],
    basePowerConsumption: 0.5,
    outputEffectValue: 6, // 6 피해
    cost: 3,
    tier: 1,
    description: '0.5V의 적은 전력으로 빠르게 적을 찌르는 경량 스프링 단검. (피해량: 6)',
    flavorText: '주머니에 쏙 들어가는 은밀한 공방의 호신구.',
    iconName: 'Sword',
    soundType: 'light'
  },
  {
    itemId: 'steam_sawblade',
    itemName: '고속 회전 증기 톱날',
    gizmoType: 'Weapon',
    width: 2,
    height: 1,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [],
    basePowerConsumption: 1.0,
    outputEffectValue: 14, // 14 피해
    cost: 5,
    tier: 1,
    description: '전력이 통하면 고속 회전하여 적의 장갑을 썰어냅니다. (피해량: 14, 출혈 효과)',
    flavorText: '톱니마다 튀는 불꽃이 공방의 어둠을 밝힌다.',
    iconName: 'Disc',
    soundType: 'heavy'
  },
  {
    itemId: 'brass_gatling',
    itemName: '황동 4연장 개틀링포',
    gizmoType: 'Weapon',
    width: 2,
    height: 2,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [],
    basePowerConsumption: 2.0,
    outputEffectValue: 24, // 6 x 4연발 총 24 피해
    cost: 9,
    tier: 2,
    description: '전력 펄스 1회당 4연장 총열이 4회 연속 사격하여 총 24의 강력한 피해를 입힙니다.',
    flavorText: '황동 탄피가 우수수 쏟아지는 경쾌한 금속 교향곡.',
    iconName: 'Crosshair',
    soundType: 'heavy'
  },
  {
    itemId: 'tesla_arc_cannon',
    itemName: '테슬라 아크 방전포',
    gizmoType: 'Weapon',
    width: 2,
    height: 2,
    powerInputPorts: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
    powerOutputPorts: [],
    basePowerConsumption: 2.8,
    outputEffectValue: 36, // 36 피해 + 실드 관통
    cost: 13,
    tier: 3,
    description: '적의 실드를 50% 관통하여 직접 본체에 번개 타격을 가합니다. (피해량: 36, 실드 관통 50%)',
    flavorText: '공기를 찢는 보랏빛 아크 방전의 굉음.',
    iconName: 'ZapOff',
    soundType: 'electric'
  },
  {
    itemId: 'steam_mortar',
    itemName: '중장갑 증기 박격포',
    gizmoType: 'Weapon',
    width: 3,
    height: 1,
    powerInputPorts: [{ x: 1, y: 0 }],
    powerOutputPorts: [],
    basePowerConsumption: 3.5,
    outputEffectValue: 55, // 55 대형 폭발 피해
    cost: 15,
    tier: 4,
    description: '거대한 고압 증기 포탄을 곡사 발사하여 적 머신에 막대한 치명타를 입힙니다. (피해량: 55)',
    flavorText: '발사 반동에 공방 전체가 요동친다.',
    iconName: 'Bomb',
    soundType: 'heavy'
  },
  {
    itemId: 'dynamite_launcher',
    itemName: '붉은 화약 투척기',
    gizmoType: 'Weapon',
    width: 1,
    height: 2,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [],
    basePowerConsumption: 1.2,
    outputEffectValue: 18,
    cost: 6,
    tier: 2,
    description: '도화선에 불꽃을 튀겨 전방에 즉각 폭발물을 던집니다. (피해량: 18)',
    flavorText: '화약 냄새야말로 공방의 진정한 향기.',
    iconName: 'Flame',
    soundType: 'heavy'
  },

  // --- 4. 방어 및 특수 기계 (Shield & Utility) ---
  {
    itemId: 'steam_shield_emitter',
    itemName: '증기 차폐막 분출기',
    gizmoType: 'Shield',
    width: 1,
    height: 2,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [],
    basePowerConsumption: 0.8,
    outputEffectValue: 14, // 14 실드 생성
    cost: 4,
    tier: 1,
    description: '고압 수증기를 뿜어내어 적의 포격을 완충하는 증기 실드를 전개합니다. (실드: +14)',
    flavorText: '한 치 앞도 보이지 않는 빽빽한 고온 증기 장벽.',
    iconName: 'Shield',
    soundType: 'steam'
  },
  {
    itemId: 'brass_plating',
    itemName: '강화 황동 장갑판',
    gizmoType: 'Shield',
    width: 2,
    height: 1,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [],
    basePowerConsumption: 0.5,
    outputEffectValue: 10, // 10 실드 + 패시브 내구도
    cost: 4,
    tier: 1,
    description: '두꺼운 황동 철판. 전력 공급 시 추가로 차폐 자기장을 형성합니다. (실드: +10)',
    flavorText: '단단한 황동은 어떤 파편도 튕겨낸다.',
    iconName: 'ShieldCheck',
    soundType: 'heavy'
  },
  {
    itemId: 'aegis_forcefield',
    itemName: '이지스 전자기 장막 코어',
    gizmoType: 'Shield',
    width: 2,
    height: 2,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [],
    basePowerConsumption: 2.2,
    outputEffectValue: 32, // 32 대량 실드
    cost: 11,
    tier: 3,
    description: '강력한 전자석 코어로 적의 탄환 궤적을 왜곡시키며 거대한 실드를 형성합니다. (실드: +32)',
    flavorText: '회전하는 4개의 솔레노이드가 푸른 역장을 엮어낸다.',
    iconName: 'ShieldAlert',
    soundType: 'electric'
  },
  {
    itemId: 'auto_repair_wrench',
    itemName: '자동 수리 공방 키트',
    gizmoType: 'Shield',
    width: 1,
    height: 2,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [],
    basePowerConsumption: 1.2,
    outputEffectValue: 12, // 12 체력 수리
    cost: 7,
    tier: 2,
    description: '작은 로봇 집게발이 손상된 본체 부품을 즉석에서 용접하고 수리합니다. (체력: +12 수리)',
    flavorText: '전투 중에도 망치질 소리는 멈추지 않는다.',
    iconName: 'Wrench',
    soundType: 'light'
  },
  {
    itemId: 'kinetic_absorber',
    itemName: '운동 에너지 충격 흡수기',
    gizmoType: 'Shield',
    width: 1,
    height: 1,
    powerInputPorts: [{ x: 0, y: 0 }],
    powerOutputPorts: [{ x: 0, y: 0 }], // 통과하여 전원 재공급
    basePowerConsumption: 0.4,
    outputEffectValue: 8,
    cost: 6,
    tier: 2,
    description: '적의 타격 충격을 스프링으로 흡수해 실드로 전환하고, 뒷단으로 펄스를 전달합니다. (실드: +8)',
    flavorText: '충격도 잘 다루면 훌륭한 동력이 된다.',
    iconName: 'Activity',
    soundType: 'light'
  }
];

// Quick lookup map
export const GIZMO_DICT: Record<string, GridItemData> = GIZMO_CATALOG.reduce((acc, item) => {
  acc[item.itemId] = item;
  return acc;
}, {} as Record<string, GridItemData>);
