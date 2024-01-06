import { asyncReadFile } from '../util.ts'

function parse(input: string[]) {
  const maps: string[][] = []

  let current: string[] = []
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '' || i === input.length - 1) {
      maps.push(current)
      current = []
    } else {
      current.push(input[i])
    }
  }

  return maps
}

function partOne(input: string[]) {
  const maps = parse(input)
  return 0
}

function partTwo(input: string[]) {
  const maps = parse(input)
  return 0
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
console.log('Part two: ', partTwo(input))
