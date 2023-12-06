import { asyncReadFile } from '../util.ts';

const input =
  (await asyncReadFile(new URL('input.txt', import.meta.url))) ?? [];

console.log('Part one: ', partOne(input));
console.log('Part two: ', partTwo(input));

//

function partOne(input: string[]) {}

function partTwo(input: string[]) {}
