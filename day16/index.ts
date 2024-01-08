import { asyncReadFile } from '../util.ts'

function parse(input: string[]) {}

function partOne(input: string[]) {
  return null
}

function partTwo(input: string[]) {
  return null
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
console.log('Part two: ', partTwo(input))
