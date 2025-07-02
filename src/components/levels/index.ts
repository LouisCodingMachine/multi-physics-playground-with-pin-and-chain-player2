export type LevelFactory = (world: Matter.World) => Matter.Body[];  // 레벨 생성 함수 시그니처 정의
// src/levels/index.ts
// 이 파일을 생성하여 레벨 팩토리 함수를 관리합니다
import { createLevel1 } from './level1';
import { createLevel2 } from './level2';
import { createLevel3 } from './level3';
import { createLevel4 } from './level4';
import { createLevel5 } from './level5';
import { createLevel6 } from './level6';
import { createLevel7 } from './level7';
import { createLevel8 } from './level8';
import { createLevel9 } from './level9';
import { createLevel10 } from './level10';
import { createLevel11 } from './level11';
import { createLevel12 } from './level12';
import { createLevel13 } from './level13';
import { createLevel14 } from './level14';
import { createLevel15 } from './level15';
import { createLevel16 } from './level16';
import { createLevel17 } from './level17';
import { createLevel18 } from './level18';
import { createLevel19 } from './level19';
import { createLevel20 } from './level20';
// import { createLevel20 } from './level21';
// import { createLevel20 } from './level22';
// import { createLevel20 } from './level23';
// import { createLevel20 } from './level24';

export const levelFactories: Record<number, LevelFactory> = {
  1: createLevel1,
  2: createLevel2,
  3: createLevel3,
  4: createLevel4,
  5: createLevel5,
  6: createLevel6,
  7: createLevel7,
  8: createLevel8,
  9: createLevel9,
  10: createLevel10,
  11: createLevel11,
  12: createLevel12,
  13: createLevel13,
  14: createLevel14,
  15: createLevel15,
  16: createLevel16,
  17: createLevel17,
  18: createLevel18,
  19: createLevel19,
  20: createLevel20,
  // 21: createLevel21,
  // 22: createLevel22,
  // 23: createLevel23,
  // 24: createLevel24,
};
