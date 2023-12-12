import { join } from 'path';

const DIGITS_OBJ = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const;

export async function trebuchetWithInput() {
  const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
  return trebuchet(input);
}

export async function trebuchet(input: string) {
  const lines = input.split('\n').filter(Boolean);
  console.log('=============================');
  return lines
    .map((str) => Array.from(str))
    .map((str) => findFirstDigit(str) * 10 + findLastDigit(str))
    .reduce((a, b) => a + b, 0);
}

function findFirstDigit(letterArray: Array<string>): number {
  let collection = '';
  for (let i = 0; i < letterArray.length; i++) {
    const letter = letterArray[i];

    // check if digit
    if (letter.match(/\d/)) {
      return +letter;
    }

    collection += letter;

    // check if digit word
    const digitWord = Object.keys(DIGITS_OBJ).find((key) =>
      collection.includes(key),
    );

    if (digitWord) {
      // @ts-expect-error
      return DIGITS_OBJ[digitWord];
    }
  }

  throw new Error('no digit found');
}

function findLastDigit(letterArray: Array<string>): number {
  let collection = '';
  for (let i = letterArray.length - 1; i >= 0; i--) {
    const letter = letterArray[i];

    // check if digit
    if (letter.match(/\d/)) {
      return +letter;
    }

    collection = letter + collection;

    // check if digit word
    const digitWord = Object.keys(DIGITS_OBJ).find((key) =>
      collection.includes(key),
    );

    if (digitWord) {
      // @ts-expect-error
      return DIGITS_OBJ[digitWord];
    }
  }

  throw new Error(`no digit found in "${letterArray.join('')}"`);
}
