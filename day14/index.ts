import { asyncReadFile } from '../util.ts'

const cache = new Map<string, string[]>()
const cycleCache = new Map<string, number>()

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

function stringify(m: string[]) {
  return m.join('')
}

function transpose(input: string[]): string[] {
  const numRows = input.length
  const numCols = input[0]?.length || 0

  if (numRows === 0 || numCols === 0) {
    return input
  }

  const transposedMatrix: string[] = []

  for (let col = 0; col < numCols; col++) {
    let rowData = ''
    for (let row = 0; row < numRows; row++) {
      rowData += input[row][col]
    }
    transposedMatrix.push(rowData)
  }

  return transposedMatrix
}

function reverse(m: string[]) {
  return m.map((l) => l.split('').reverse().join(''))
}

function tilt(map: string[]) {
  return map.map((line) =>
    line
      .split('#')
      .map((p) => p.replaceAll('.', '').padEnd(p.length, '.'))
      .join('#'),
  )
}

function getNorthBeamWeight(m: string[]) {
  let sum = 0

  const maxWeight = m.length
  const map = transpose(m)

  for (const line of map) {
    let currWeight = maxWeight
    for (const char of line) {
      if (char === 'O') {
        sum += currWeight
      }
      currWeight--
    }
  }

  return sum
}

function cycle(map: string[]) {
  let m = [...map]

  // North
  m = transpose(m)
  m = tilt(m)

  // West
  m = transpose(reverse(m))
  m = tilt(m)

  // South
  m = transpose(m)
  m = tilt(m)

  // East
  m = reverse(transpose(m))
  m = tilt(m)

  return reverse(transpose(reverse(transpose(m))))
}

function partOne(input: string[]) {
  const m = parse(input)[0]
  return getNorthBeamWeight(transpose(tilt(transpose(m))))
}

function partTwo(input: string[]) {
  let cycleCount = 1000000000
  let m = parse(input)[0]
  let cycleLength = null
  let cycleStart = null

  for (let i = 0; i < cycleCount; i++) {
    const old = [...m]
    const key = stringify(old)

    if (cycleCache.has(key)) {
      const start = cycleCache.get(key)!
      cycleStart = start
      cycleLength = i - start
      break
    }

    cycleCache.set(key, i)

    if (cache.has(key)) {
      m = cache.get(key)!
    } else {
      m = cycle(old)
      cache.set(key, m)
    }
  }

  const cacheIndex =
    ((cycleCount - cycleStart!) % cycleLength!) + cycleStart! - 1
  const mCacheKey = Array.from(cycleCache.entries()).find(
    ([_, i]) => i === cacheIndex,
  )![0]
  const mCache = cache.get(mCacheKey)!

  return getNorthBeamWeight(mCache)
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
console.log('Part two: ', partTwo(input))
