import { cubeConundrumWithInput } from './tasks/cube-conundrum';
import { trebuchetWithInput } from './tasks/trebuchet';
import { gearRatiosWithInput } from './tasks/gear-ratios';
import { scratchcardsWithInput } from './tasks/scratchcards';
import { fertilizerWithInput } from './tasks/if-you-give-a-seed-a-fertilizer';

console.log(`Day 1, Trebuchet: ${await trebuchetWithInput()}`);
console.log(`Day 2, Cube Conundrum: ${await cubeConundrumWithInput()}`);
console.log(`Day 3, Gear Ratios: ${await gearRatiosWithInput()}`);
console.log(`Day 4, Scratchcards: ${await scratchcardsWithInput()}`);
console.log(`Day 5, Fertilizer: ${await fertilizerWithInput()}`);
