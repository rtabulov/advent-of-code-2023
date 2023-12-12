import { join } from 'path';

interface GameObject {
  [k: string]: Game;
}

type Game = Array<ColorNumbers>;

interface ColorNumbers {
  red: number;
  green: number;
  blue: number;
}

export async function cubeConundrumWithInput() {
  const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
  return cubeConundrum(input);
}

export function cubeConundrum(input: string) {
  const gamesObject = parseInput(input);
  const powers = Object.values(gamesObject).map((game) =>
    minimumPowerOfGame(game),
  );
  return powers.reduce((a, b) => a + b, 0);
}

function minimumPowerOfGame(game: Game) {
  const minimums = getMinimumCubesPossible(game);
  return minimums.red * minimums.green * minimums.blue;
}

function getMinimumCubesPossible(game: Game): ColorNumbers {
  const minimums = {
    red: 0,
    green: 0,
    blue: 0,
  };
  game.forEach((set) => {
    minimums.red = Math.max(minimums.red, set.red);
    minimums.green = Math.max(minimums.green, set.green);
    minimums.blue = Math.max(minimums.blue, set.blue);
  });
  return minimums;
}

function isGamePossible(game: Game): boolean {
  const MAXIMUMS = {
    red: 12,
    green: 13,
    blue: 14,
  } as const;

  return game.every(
    (draw) =>
      draw.red <= MAXIMUMS.red &&
      draw.green <= MAXIMUMS.green &&
      draw.blue <= MAXIMUMS.blue,
  );
}

function parseInput(input: string): GameObject {
  return Object.fromEntries(
    input
      .split('\n')
      .filter(Boolean)
      .map((str) => {
        const [game, rawData] = str.split(':');
        const gameId = game.slice('Game '.length);
        const data = rawData
          .split('; ')
          .map((s) => s.trim())
          .map((set) => {
            return Object.assign(
              {
                red: 0,
                green: 0,
                blue: 0,
              },
              ...set.split(', ').map((str) => {
                const [number, color] = str.split(' ');
                return { [color]: +number };
              }),
            );
          });
        return [gameId, data];
      }),
  );
}
