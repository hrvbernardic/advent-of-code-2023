import { asyncReadFile } from '../util.ts'

function parse(text: string) {
  const line = joinDots(text.split(' ')[0])
  const remaining = text
    .split(' ')[1]
    .split(',')
    .map((n) => parseInt(n))

  return { line, remaining }
}

function joinDots(line: string) {
  return line.replace(/^\.+|\.+$/g, '').replace(/\.{2,}/g, '.')
}

function getMinimalCorrectString(damaged: number[]) {
  return damaged
    .map((c) => '#'.repeat(c) + '.')
    .join('')
    .slice(0, -1)
}

function isStringValid(string: string, damaged: number[]) {
  return joinDots(string) === getMinimalCorrectString(damaged)
}

function getNumberOfSolutions(line: string, remaining: number[]) {
  let sum = 0

  console.log(line, remaining)

  return sum
}

function partOne(input: string[]) {
  let sum = 0

  input.forEach((text) => {
    const { line, remaining } = parse(text)
    sum = sum + getNumberOfSolutions(line, remaining)
  })

  return sum
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
//console.log('Part two: ', partTwo(input))
