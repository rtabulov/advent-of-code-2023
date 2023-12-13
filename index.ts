import { cubeConundrumWithInput } from './tasks/cube-conundrum';
import { trebuchetWithInput } from './tasks/trebuchet';
import { gearRatiosWithInput } from './tasks/gear-ratios';

console.log(`Day 1, Trebuchet: ${await trebuchetWithInput()}`);
console.log(`Day 2, Cube Conundrum: ${await cubeConundrumWithInput()}`);
console.log(`Day 3, Gear Ratios: ${await gearRatiosWithInput()}`);
