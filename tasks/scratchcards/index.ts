import { join } from 'path';

export async function scratchcardsWithInput() {
  const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
  return scratchcards(input);
}

export function scratchcards(input: string) {
  const lines = input.split('\n').filter(Boolean);
  const copies = new Array(lines.length).fill(1);
  const cards = getCards(lines);
  const matches = cards.map(getMatches);
  matches.forEach((matchCount, idx) => {
    for (let i = idx + 1; i < idx + matchCount + 1; i++) {
      copies[i] += copies[idx];
    }
    // console.log(copies);
  });
  return copies.reduce((a, b) => a + b, 0);
}

interface Card {
  winners: string[];
  draw: string[];
  id: string;
}

function getCards(lines: string[]): Card[] {
  return lines.map((line) => {
    const [id, data] = line.split(':');
    const [winnersRaw, drawRaw] = data.trim().split(' | ');
    return {
      id,
      winners: winnersRaw.split(' ').filter(Boolean),
      draw: drawRaw.split(' '),
    };
  });
}

function getPoints(card: Card): number {
  const matches = getMatches(card);
  if (matches === 0) {
    return 0;
  }

  return 2 ** (matches - 1);
}

function getMatches({ draw, winners }: Card): number {
  return draw.reduce((result, num) => {
    if (winners.includes(num)) {
      return result + 1;
    }
    return result;
  }, 0);
}
