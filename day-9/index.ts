import { asyncReadFile } from '../util.ts'

function getLastSecretNumber(numbers: number[]) {
  const lastNums = []
  let nextNumsArr = numbers

  while (nextNumsArr.filter((num) => num !== 0).length) {
    lastNums.push(...nextNumsArr.slice(-1))

    nextNumsArr = nextNumsArr
      .filter((_, idx) => idx !== 0)
      .map((num, idx) => num - nextNumsArr[idx])
  }

  return lastNums.reduce((sum, num) => sum + num, 0)
}

function getFirstSecretNumber(numbers: number[]) {
  const lastNums = []
  let nextNumsArr = numbers.reverse()

  while (nextNumsArr.filter((num) => num !== 0).length) {
    lastNums.push(...nextNumsArr.slice(-1))

    nextNumsArr = nextNumsArr
      .filter((_, idx) => idx !== 0)
      .map((num, idx) => {
        return nextNumsArr[idx] - num
      })
  }
  return lastNums.reverse().reduce((res, num) => num - res, 0)
}

function parseNumberArrays(input: string[]) {
  return input.map((line) => line.split(' ').map((s) => parseInt(s)))
}

function partOne(input: string[]) {
  return parseNumberArrays(input).reduce(
    (sum, nums) => sum + getLastSecretNumber(nums),
    0,
  )
}

function partTwo(input: string[]) {
  return parseNumberArrays(input).reduce(
    (sum, nums) => sum + getFirstSecretNumber(nums),
    0,
  )
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
console.log('Part two: ', partTwo(input))
