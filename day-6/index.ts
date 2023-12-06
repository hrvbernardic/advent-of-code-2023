import { asyncReadFile } from '../util.ts';

const input =
  (await asyncReadFile(new URL('input.txt', import.meta.url))) ?? [];

console.log('Part one: ', partOne(input));
console.log('Part two: ', partTwo(input));

//

function partOne(input: string[]) {
  const races = getRaces(input);
  return races
    .map((r) => getNumberOfWinningPlans(r))
    .reduce((m, c) => m * c, 1);
}

function partTwo(input: string[]) {
  const race = getOneRace(input);
  return getNumberOfWinningPlans(race);
}

function getNumberOfWinningPlans(race: Race) {
  const { distance, time } = race;
  let winningGames = 0;

  for (let i = 0; i <= time; i++) {
    const hold = i;
    const speed = hold;
    const distanceCovered = (time - hold) * speed;

    if (distanceCovered > distance) winningGames++;
  }

  return winningGames;
}

function getOneRace(input: string[]): Race {
  const parseLine = (line: string) =>
    parseInt(
      line
        .split(':')[1]
        .trim()
        .split(' ')
        .filter((n) => n.length)
        .join(''),
    );
  const time = parseLine(input[0]);
  const distance = parseLine(input[1]);
  return {
    time,
    distance,
  };
}

function getRaces(input: string[]): Race[] {
  const parseLine = (line: string) =>
    line
      .split(':')[1]
      .trim()
      .split(' ')
      .filter((n) => n.length)
      .map((n) => parseInt(n));

  const times = parseLine(input[0]);
  const distances = parseLine(input[1]);

  return times.map((time, index) => ({ time, distance: distances[index] }));
}

interface Race {
  distance: number;
  time: number;
}
