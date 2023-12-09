import { asyncReadFile } from '../util.ts'

function partOne(input: string[]) {
  return input.length
}

function partTwo(input: string[]) {
  return input.length
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
console.log('Part two: ', partTwo(input))
