import { asyncReadFile } from '../util.ts';

const input =
  (await asyncReadFile(new URL('input.txt', import.meta.url))) ?? [];

console.log(input);

//
