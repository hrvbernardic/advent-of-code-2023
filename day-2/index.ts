import { asyncReadFile } from '../util.ts';
import { URL } from 'url';

type CubeColor = 'blue' | 'red' | 'green';
type CubeCounts = { [color in CubeColor]: number };

const cubeLimits: { [key in CubeColor]: number } = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

const games = await asyncReadFile(new URL('input.txt', import.meta.url));

const indexSum = getValidGameIndexesSum(games);
const powerSum = getSumOfPowerOfSets(games);
console.log(indexSum, powerSum);

//

function getSumOfPowerOfSets(games: string[]) {
  let powerSum = 0;
  games.forEach((game) => {
    const [_, cubes] = game.split(':');
    const rounds = cubes.split(';').map((c) => c.trim());
    const minCubeCount: CubeCounts = {
      blue: 0,
      red: 0,
      green: 0,
    };

    rounds.map(getCubeCounts).forEach((counts) => {
      Object.entries(counts).forEach(([color, count]) => {
        if (minCubeCount[color as CubeColor] < count)
          minCubeCount[color as CubeColor] = count;
      });
    });

    powerSum += minCubeCount.green * minCubeCount.red * minCubeCount.blue;
  });

  return powerSum;
}

function getValidGameIndexesSum(games: string[]) {
  let validGamesIndexSum = 0;
  games.forEach((game) => {
    const [gameInfo, cubes] = game.split(':');
    const gameIndex = parseInt(gameInfo.split(' ').at(-1) ?? '');
    const rounds = cubes.split(';').map((c) => c.trim());

    const isGameValid = rounds
      .map((r) => {
        const cubeCounts = getCubeCounts(r);
        return checkValidCubeCounts(cubeCounts);
      })
      .reduce((acc, curr) => acc && curr, true);

    if (isGameValid) {
      validGamesIndexSum += gameIndex;
    }
  });

  return validGamesIndexSum;
}

function getCubeCounts(round: string): CubeCounts {
  const colors = round.split(',').map((r) => r.trim());

  const colorCounts = {
    blue: 0,
    red: 0,
    green: 0,
  };

  colors.forEach((c) => {
    const [stringValue, color] = c.split(' ');
    colorCounts[color as CubeColor] = parseInt(stringValue);
  });

  return colorCounts;
}

function checkValidCubeCounts(counts: CubeCounts) {
  if (counts.red > cubeLimits.red) return false;
  if (counts.blue > cubeLimits.blue) return false;
  return counts.green <= cubeLimits.green;
}
