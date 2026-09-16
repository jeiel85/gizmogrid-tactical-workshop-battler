# \[GDD\] 바이럴 가방 정리 오토배틀러 분석 및 회로 배선 결투 로그라이크 기획·설계서

- **문서 버전**: v1.0.0  
- **작성 일자**: 2026-09-16  
- **프로젝트 코드명**: GizmoGrid: Tactical Workshop Battler (기즈모그리드: 공방 결투사)  
- **장르**: 그리드 인벤토리 테트리스 \+ 전력 회로 배선 & 비동기 오토배틀러 (Grid Inventory Wiring & Asynchronous Auto-Battler)  
- **타깃 플랫폼**: PC (Steam) & 모바일 (Android/iOS)

---

## 1\. 벤치마크 바이럴 게임 심층 분석

### 1.1 분석 대상

- **대표 레퍼런스**: 《Backpack Battles (백팩 배틀즈)》, 《Backpack Hero》  
- **장르 특성**: 제한된 그리드 공간에 아이템을 효율적으로 배치하여 시너지를 창출하고, 타 유저의 데이터와 비동기 결투를 벌이는 인벤토리 오토배틀러

### 1.2 바이럴 핵심 요인 (Viral Drivers)

1. **정리 강박을 자극하는 테트리스식 공간 퍼즐**:  
   - 한정된 배낭 칸에 칼, 방패, 포션 등을 회전하고 끼워 넣으며 최적의 배치(Synergy)를 찾는 과정 자체가 극도의 몰입감 제공.  
2. **대기 시간 없는 1초 비동기 PvP (Zero-Queue Async PvP)**:  
   - 상대가 실시간 접속해 있을 필요 없이, 서버에 등록된 다른 유저의 '인벤토리 고스트 빌드'와 즉시 매칭되어 빠른 게임 템포 유지.

### 1.3 나쁜 요소 및 기존 게임의 결함 (Pain Points)

1. **전투 중 플레이어 개입이 전무한 완전 방치 (Zero In-Combat Agency)**:  
   - 배치가 끝나면 전투는 100% 자동 진행되어 관전만 해야 하므로, 체력이 1 남은 아쉬운 순간에도 플레이어가 개입할 수 있는 여지가 전혀 없음.  
2. **티어 덱 고착화(Metagame Stagnation)**:  
   - 몇 가지 최적화된 메타 빌드가 정형화되면 창의적인 조합보다는 정해진 정답 아이템만 찾는 지루한 리롤 게임으로 변질됨.  
3. **모바일 작은 화면에서의 극심한 조작 피로**:  
   - 좁은 화면에서 수십 개의 작은 아이템을 핀치 줌과 드래그로 미세 조정해야 하는 인터페이스 스트레스.

---

## 2\. \+α 혁신 프로젝트: 《GizmoGrid: Tactical Workshop Battler》

> **"아이템을 넣기만 하는 가방은 끝났습니다. 전선을 연결하고 부품에 과부하를 걸어 나만의 스팀펑크 머신을 완성하세요."**

### 2.1 핵심 차별화 시스템 (+α Innovations)

| 혁신 시스템 | 상세 설명 및 해결 과제 |
| :---- | :---- |
| **\+α 1\. \[전력 배선 회로 시너지 (Circuit Wiring)\]** | 단순 인접 배치가 아닌, 배터리에서 출발하는 구리 전선(Wire)과 트랜지스터로 기계 부품을 직접 연결. 전류가 통과하는 순서에 따라 공격 속도와 버프가 증폭되는 능동적 공학 퍼즐. |
| **\+α 2\. \[전투 중 '과부하 퓨즈 레버' 개입 (Overdrive Lever)\]** | 완전 방치를 탈피: 전투당 딱 1회, 수동으로 당길 수 있는 '과부하 레버'. 3초간 모든 회로 전력을 300% 폭주시킨 뒤 퓨즈가 타버리는 하이 리스크-하이 리턴 전술 개입. |
| **\+α 3\. \[모바일 친화형 스마트 그리드 스냅 (Smart Snap)\]** | 1-Tap 터치로 빈 슬롯에 부품을 자동 정렬하고, 회로 연결 가능 포트를 하이라이트하는 모바일 최적화 UX. |
| **\+α 4\. \[블루프린트 단축 코드 공유 (Blueprint Code)\]** | 내 공방 배치를 8자리 텍스트 코드로 추출하여 커뮤니티/친구에게 공유하고, 친구 빌드를 내 실험실에 불러와 모의 전투. |

---

## 3\. 코어 게임플레이 루프

\[상점 페이즈: 부품 구매 & 그리드 확장\] ──► (배터리, 톱니바퀴, 피스톤, 코일)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼

\[공방 조립: 부품 배치 & 구리 전선 배선\] ──► (전류 루프 검증: 전류 흐름 램프 점등)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼

\[비동기 대전 돌입: 타 유저 공방 머신과 격돌\]

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├─► \[자동 전투 진행: 전력 펄스에 따른 시퀀스 공격\]

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─► \[결정적 순간: '오버드라이브 레버' 수동 발동\!\]

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼

\[승리 시 트로피 획득 & 랭크 상승\] ──► 10승 달성 시 명예의 전당 등재

---

## 4\. 게임 상태 머신 (FSM) 상세 설계

\+-------------------------------------------------------------+

|                      SHOP\_STATE\_ASSEMBLE                    |

|           (Drag Parts, Connect Wires, Check Voltage)        |

\+-------------------------------------------------------------+

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\[Press BATTLE Button\]

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼

\+-------------------------------------------------------------+

|                      BATTLE\_STATE\_RUN                       | \<--------------------+

|  \- Clock Pulse Timer (Every 0.5s Battery emits Power Pulse) |                      |

|  \- Wires transmit Current \-\> Trigger Connected Gizmos       |                      |

|  \- Auto-damage / Shield Calculation                         |                      |

\+-------------------------------------------------------------+                      |

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│                                                      |

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\[Player Pulls Overdrive Lever\]                                     |

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│                                                      |

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼                                                      |

\+-------------------------------------------------------------+                      |

|                     OVERDRIVE\_SURGE\_STATE                   |                      |

|  \- 3.0s Duration: Clock Speed x3, 100% Critical Strike      |                      |

|  \- After Surge: Overheated parts disabled for rest of fight |                      |

\+-------------------------------------------------------------+                      |

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│                                                      |

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼                                                      |

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Resume Combat Until KO) ───────────────────────────────────────+

---

## 5\. 핵심 기술 아키텍처 및 데이터 모델

### 5.1 엔진 및 기술 스택

- **엔진**: **Godot 4.3 (C\#)** 또는 **Unity 2022.3 LTS**  
- **그래프 알고리즘**: 너비 우선 탐색(BFS) 기반 회로 전류 전달 경로 탐색 엔진 (배터리 노드 \-\> 전선 엣지 \-\> 액추에이터 노드).

### 5.2 핵심 데이터 모델 (C\#)

public enum GizmoType { PowerSource, Conductor, Weapon, Shield, Transistor }

&nbsp;

\[System.Serializable\]

public class GridItemData {

&nbsp;&nbsp;&nbsp;&nbsp;public string itemId;

&nbsp;&nbsp;&nbsp;&nbsp;public string itemName;

&nbsp;&nbsp;&nbsp;&nbsp;public GizmoType gizmoType;

&nbsp;&nbsp;&nbsp;&nbsp;public int width;

&nbsp;&nbsp;&nbsp;&nbsp;public int height;

&nbsp;&nbsp;&nbsp;&nbsp;public List\<Vector2Int\> powerInputPorts;

&nbsp;&nbsp;&nbsp;&nbsp;public List\<Vector2Int\> powerOutputPorts;

&nbsp;&nbsp;&nbsp;&nbsp;public float basePowerConsumption;

&nbsp;&nbsp;&nbsp;&nbsp;public float outputEffectValue;

}

&nbsp;

\[System.Serializable\]

public class WorkshopGridSnapshot {

&nbsp;&nbsp;&nbsp;&nbsp;public string playerGhostId;

&nbsp;&nbsp;&nbsp;&nbsp;public int rankRating;

&nbsp;&nbsp;&nbsp;&nbsp;public List\<GridItemPlacement\> placedGizmos;

&nbsp;&nbsp;&nbsp;&nbsp;public List\<WireConnection\> wireLinks;

}

---

## 6\. 6주 완성 MVP 로드맵

- **Week 1\~2: 그리드 인벤토리 & 전선 배선(BFS 알고리즘) 구현**  
  - 부품 회전/배치 및 단자 간 전선 연결 전력 루프 계산기 완성.  
- **Week 3\~4: 비동기 전투 시뮬레이터 & 오버드라이브 레버**  
  - 펄스 타이머 기반 전투 엔진 및 수동 과부하 레버 조작계 구축.  
- **Week 5: 부품 40종 밸런싱 & 블루프린트 공유 코드 시스템**  
  - 공방 스냅샷 JSON 직렬화 및 단축 Base64 코드 복사/붙여넣기 연동.  
- **Week 6: 스팀 데모 빌드 패키징 & 모바일 터치 최적화**

&nbsp;