import { asyncReadFile } from '../util.ts'
import { deepMatch } from 'bun'

const cacheMap = new Map<string, boolean>()
let cacheHitCount = 0

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
  //console.log('isStringValid', string, damaged)
  return joinDots(string) === getMinimalCorrectString(damaged)
}

function isValid(text: string, remaining: number[]): boolean {
  const line = joinDots(text)
  const testRemaining = line
    .split('.')
    .filter((p) => p !== '')
    .map((p) => p.length)
  return areSameArrays(remaining, testRemaining)
}

function areSameArrays(a: number[], b: number[]) {
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }

  return true
}

function isPartialValid(text: string, remaining: number[]): boolean {
  const line = joinDots(text)
  const testRemaining = line
    .split('.')
    .filter((p) => p !== '')
    .map((p) => p.length)
  return arePartialArrays(remaining, testRemaining)
}

function arePartialArrays(a: number[], b: number[]) {
  const length = Math.max(a.length, b.length)

  for (let i = 0; i < length; i++) {
    if (!a[i] || !b[i]) break
    const diff = b[i] - a[i]
    if (diff > 0) {
      return false
    } else if (diff < 0 && b.length > i + 1) {
      return false
    }
  }

  return true
}

function getAllCombinations(
  line: string,
  remaining: number[],
  oldBefore?: string,
) {
  const fromCache = cacheMap.get(line)

  //if (fromCache) {
  //  console.log('CACHE HIT, ', line, fromCache.length)
  //  cacheHitCount++
  //  return fromCache
  //}

  // NEW //
  let minimalString = getMinimalCorrectString(remaining)
  //

  let combinations = [] as string[]
  let sum = 0

  if (line.indexOf('?') === -1) {
    return isStringValid(oldBefore + line, remaining) ? 1 : 0
  }

  const [before, after] = line.replace('?', 'X').split('X')

  const checkBefore = oldBefore === undefined ? before : `${oldBefore}${before}`

  if (oldBefore && !minimalString.startsWith(joinDots(oldBefore))) {
    return sum
  }

  // check after value
  const beforePartCount = checkBefore.replaceAll('.', '').length
  const afterPartCount = after.replaceAll('.', '').replaceAll('?', '').length
  const remainingCount = remaining.reduce((sum, r) => sum + r, 0)
  if (
    beforePartCount + afterPartCount > remainingCount ||
    beforePartCount + afterPartCount < remainingCount - 1
  ) {
    return sum
  }

  sum =
    sum +
    getAllCombinations('.' + after ?? '', remaining, checkBefore) +
    getAllCombinations('#' + after ?? '', remaining, checkBefore)

  return sum
}

function getNumberOfSolutions(text: string) {
  const line = text.split(' ')[0]
  const remaining = text
    .split(' ')[1]
    .split(',')
    .map((x) => parseInt(x))

  return getAllCombinations(line, remaining)
}

function unfoldLine(text: string) {
  const line = text.split(' ')[0]
  const remaining = text
    .split(' ')[1]
    .split(',')
    .map((x) => parseInt(x))

  const unfoldedLine = (line + '?').repeat(5).slice(0, -1)
  const unfoldedRemaining = [
    ...remaining,
    ...remaining,
    ...remaining,
    ...remaining,
    ...remaining,
  ]

  return `${unfoldedLine} ${unfoldedRemaining.join(',')}`
}
let sum = 0
function partOne(input: string[]) {
  let sum = 0

  input.forEach((line) => {
    sum = sum + getNumberOfSolutions(line)
  })

  return sum
}

function partTwo(input: string[]) {
  let sum = 0

  try {
    input.forEach((line, idx) => {
      console.log(`${idx} -> ${unfoldLine(line)}`)
      sum = sum + getNumberOfSolutions(unfoldLine(line))
    })
  } catch (e) {
    console.log(e)
  }

  console.log('Cache Size', cacheMap.size)
  console.log('Cache Hit', cacheHitCount)

  return sum
}

let recursionCount = 0

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
//console.log('Part two: ', partTwo(input))
