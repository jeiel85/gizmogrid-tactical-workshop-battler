# ⚙️ GizmoGrid: Tactical Workshop Battler (기즈모그리드: 공방 결투사)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)

> **"아이템을 넣기만 하는 가방은 끝났습니다. 전선을 연결하고 부품에 과부하를 걸어 나만의 스팀펑크 머신을 완성하세요."**

《GizmoGrid: Tactical Workshop Battler》는 한정된 공방 그리드에 부품을 테트리스식으로 배치하고, 전원 공급원(배터리, 다이나모)에서 부품 단자까지 구리 전선을 직접 배선하여 전력을 공급하고, 비동기 PvP 대전을 펼치는 **전력 회로 배선 & 전술 공방 오토배틀러**입니다.

---

## 🎮 라이브 데모 (Live Playable Demo)

👉 **[GizmoGrid 라이브 데모 플레이하기](https://jeiel85.github.io/gizmogrid-tactical-workshop-battler/)**

---

## 🚀 4대 핵심 혁신 시스템 (+α Innovations)

| 혁신 시스템 | 상세 설명 |
| :--- | :--- |
| **🔌 1. 전력 배선 회로 시너지 (Circuit Wiring)** | 단순 인접 배치가 아닌, 배터리에서 출발하는 구리 전선(Wire)과 트랜지스터로 기계 부품을 직접 연결합니다. 너비 우선 탐색(BFS) 기반의 실시간 전력 전달 경로 계산 및 펄스 애니메이션이 제공됩니다. |
| **🕹️ 2. '과부하 퓨즈 레버' 수동 개입 (Overdrive Lever)** | 전투 중 플레이어 개입이 전무한 완전 방치를 탈피! 전투당 딱 1회, 수동으로 당길 수 있는 '과부하 레버'로 3초간 모든 회로 전력을 300% 폭주시킨 뒤 퓨즈가 타버리는 하이 리스크-하이 리턴 전술 개입이 가능합니다. |
| **📱 3. 모바일 친화형 스마트 그리드 스냅 (Smart Snap)** | 원터치 클릭으로 빈 슬롯에 부품을 자동 정렬하고, 회로 연결 가능 단자(출력/입력)를 하이라이트하는 모바일 및 데스크톱 최적화 UX. 부품 회전(R 키 또는 회전 버튼) 완벽 지원. |
| **📜 4. 블루프린트 단축 코드 공유 (Blueprint Code)** | 내 공방 배치를 텍스트 코드로 추출하여 커뮤니티/친구에게 공유하고, 친구 빌드 코드를 붙여넣어 즉시 내 실험실에서 비동기 모의 전투를 치를 수 있습니다. |

---

## 🔄 코어 게임플레이 루프

1. **상점 페이즈 (Shop & Workshop Assemble)**
   - 라운드별 골드를 획득하고 부품 암시장에서 배터리, 다이나모, 개틀링, 회전 톱날, 방벽 등을 구매합니다.
   - 공방 그리드에 부품을 스마트 배치하고 회전시킵니다.
   - 출력 단자(황동 핀)에서 입력 단자(청록 소켓)로 전선을 드래그/클릭하여 연결합니다.
   - 전압계(Volt Meter)로 전력 균형을 확인합니다.
2. **비동기 대전 (Asynchronous Combat Arena)**
   - 대전 돌입 버튼을 누르면 1초 만에 상대 랭크의 고스트 머신과 즉각 매칭됩니다.
   - 0.5초 클럭 펄스 타이머마다 배터리에서 방출된 전력이 도선을 타고 흘러 무기와 방어막을 발동시킵니다.
   - 실시간 체력, 방어막, 플로팅 데미지 숫자, 텔레타이프 전투 로그를 확인합니다.
3. **오버드라이브 레버 수동 발동 (Overdrive Surge)**
   - 승부의 분수령에서 3D 아날로그 레버를 당겨 3초간 300% 가속 펄스 & 100% 치명타를 터뜨립니다!
4. **승리 & 10승 명예의 전당 (Hall of Fame)**
   - 승리 시 전리품 골드를 수령하고 랭크를 올립니다.
   - 10승 달성 시 명예의 전당 등재 및 승리 세리머니! (3회 패배 시 공방 폐쇄)

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Steampunk Theme (황동, 구리, 진공관, 아날로그 게이지)
- **Audio**: Web Audio API 기반 절차적 사운드 신디사이저 (100% 무결점 자체 생성 SFX)
- **Algorithm**: 너비 우선 탐색(BFS) 기반 전력 위상 분배 알고리즘
- **Rendering**: SVG Cubic Bezier 곡선 전선 렌더러 + 애니메이션 펄스 이펙트
- **Deployment**: GitHub Pages CI/CD

---

## 💻 로컬 개발 및 실행 (Local Setup)

```bash
# 1. 저장소 복제
git clone https://github.com/jeiel85/gizmogrid-tactical-workshop-battler.git
cd gizmogrid-tactical-workshop-battler

# 2. 패키지 설치
npm install

# 3. 로컬 개발 서버 실행
npm run dev

# 4. 프로덕션 빌드
npm run build
```

---

## 📜 라이선스

MIT License © 2026 GizmoGrid Team
