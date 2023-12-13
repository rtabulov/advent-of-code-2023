import { join } from 'path';
import { isSymbol } from 'util';

export async function gearRatiosWithInput() {
  const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
  return gearRatios(input);
}

export function gearRatios(input: string) {
  const lines = input.split('\n').filter(Boolean);
  const gears = findGears(lines);
  return gears
    .map((pos) => getGearRatio(pos, lines))
    .filter((adjs) => adjs.length === 2)
    .map(([a, b]) => +a * +b)
    .reduce((a, b) => a + b, 0);
}

interface Position {
  line: number;
  idx: number;
}

function getGearRatio(gearPosition: Position, lines: string[]) {
  const adjacentNums: string[] = [];

  let line: string;
  let num: string;

  // check left side
  line = lines[gearPosition.line];
  num = '';
  for (let i = gearPosition.idx - 1; i >= 0; i--) {
    const letter = line[i];
    if (isDigit(letter)) {
      num = letter + num;
    } else {
      break;
    }
  }

  if (num.length) {
    adjacentNums.push(num);
  }

  // check right side
  line = lines[gearPosition.line];
  num = '';
  for (let i = gearPosition.idx + 1; i < line.length; i++) {
    const letter = line[i];
    if (isDigit(letter)) {
      num += letter;
    } else {
      break;
    }
  }

  if (num.length) {
    adjacentNums.push(num);
  }

  let start: number;
  let end: number;
  let section: string;

  // check top side
  start = gearPosition.idx - 1;
  end = gearPosition.idx + 1;
  line = lines[gearPosition.line - 1];
  section = line.slice(start, end + 1);

  for (let i = start; i >= 0 && start > 0; i--) {
    if (!isDigit(line[i])) {
      break;
    }

    start -= 1;
  }

  for (let i = end; i < line.length && end < line.length; i++) {
    if (!isDigit(line[i])) {
      break;
    }

    end += 1;
  }

  section = line.slice(start, end + 1);
  adjacentNums.push(...(section.match(/\d+/g) || []));

  // check bottom side
  start = gearPosition.idx - 1;
  end = gearPosition.idx + 1;
  line = lines[gearPosition.line + 1];
  section = line.slice(start, end + 1);

  for (let i = start; i >= 0 && start > 0; i--) {
    if (!isDigit(line[i])) {
      break;
    }

    start -= 1;
  }

  for (let i = end; i < line.length && end < line.length; i++) {
    if (!isDigit(line[i])) {
      break;
    }

    end += 1;
  }

  section = line.slice(start, end + 1);
  adjacentNums.push(...(section.match(/\d+/g) || []));

  return adjacentNums;
}

function findGears(lines: string[]) {
  const positions: Array<Position> = [];
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    for (let idx = 0; idx < line.length; idx++) {
      const letter = line[idx];
      if (letter === '*') {
        positions.push({ line: lineIdx, idx });
      }
    }
  }
  return positions;
}

function findNumbers(line: string): { num: string; idx: number }[] {
  const results = [];

  let currentNum = '';
  for (let i = 0; i < line.length; i++) {
    const letter = line[i];
    if (isDigit(letter)) {
      currentNum += letter;
    } else {
      if (currentNum.length) {
        results.push({ num: currentNum, idx: i - currentNum.length });
      }
      currentNum = '';
    }
  }
  if (currentNum.length) {
    results.push({ num: currentNum, idx: line.length - currentNum.length });
  }
  return results;
}

export function gearRatiosPart1(input: string) {
  const lines = input.split('\n').filter(Boolean);
  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const numbers = findNumbers(line);

    numbers.forEach(({ num, idx }) => {
      const startIdx = Math.max(idx - 1, 0);
      const endIdx = idx + Math.min(num.length + 1, line.length - 1);

      const prevLineIdx = i - 1;
      const nextLineIdx = i + 1;

      let concatLines = lines[i].slice(startIdx, endIdx);

      if (prevLineIdx >= 0) {
        concatLines += '|' + lines[prevLineIdx].slice(startIdx, endIdx);
      }

      if (nextLineIdx < lines.length) {
        concatLines += '|' + lines[nextLineIdx].slice(startIdx, endIdx);
      }

      // console.log({ num, concatLines, idx, startIdx, endIdx });
      if (Array.from(concatLines).some(isASymbol)) {
        sum += +num;
        return;
      }
    });
  }

  return sum;
}

function isDigit(a: string): boolean {
  return '0123456789'.includes(a);
}

function isASymbol(a: string): boolean {
  return !'.|0123456789'.includes(a);
}
