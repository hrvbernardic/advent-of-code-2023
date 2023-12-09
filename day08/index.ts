import { asyncReadFile } from '../util.ts'

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

function partOne() {
  const dirs = input[0].split('').map((d) => (d === 'L' ? 0 : 1))
  const locMap = getLocMap(input)
  let startLoc = 'AAA'
  let endLoc = 'ZZZ'

  const dirsCount = dirs.length
  let steps = 0
  let loc = startLoc

  while (loc !== endLoc) {
    const dir = dirs[steps % dirsCount]
    loc = locMap[loc][dir]
    steps++
  }

  return steps
}

function partTwo() {
  const dirs = input[0].split('').map((d) => (d === 'L' ? 0 : 1))
  const locMap = getLocMap(input)

  const startLocs = Object.keys(locMap).filter((loc) => loc[2] === 'A')
  const dirsCount = dirs.length
  let startDir = dirs[0]

  const cycles = startLocs.map((loc) => {
    let cycle = 0
    let _steps = -1
    let dir = startDir
    let currLoc = loc

    do {
      _steps++
      dir = dirs[_steps % dirsCount]
      currLoc = locMap[currLoc][dir]

      cycle++
    } while (currLoc[2] !== 'Z')

    return cycle
  })

  return cycles.reduce(lcm)
}

function getLocMap(input: string[]) {
  const locMap: { [key: string]: [string, string] } = {}

  for (let i = 2; i <= input.length - 1; i++) {
    const line = input[i]
    const loc = line.split('=')[0].trim()
    locMap[loc] = line
      .split('=')[1]
      .trim()
      .replace('(', '')
      .replace(')', '')
      .split(', ') as unknown as [string, string]
  }

  return locMap
}

function gcd(a: number, b: number): number {
  return a ? gcd(b % a, a) : b
}

function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b)
}

console.log('Part one: ', partOne())
console.log('Part two: ', partTwo())
