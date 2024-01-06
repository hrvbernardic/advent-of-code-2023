import { asyncReadFile } from '../util.ts'

const cache = new Map<any, any>()
let cacheHit = 0

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

function parse(text: string) {
  const line = joinDots(text.split(' ')[0])
  const remaining = text
    .split(' ')[1]
    .split(',')
    .map((n) => parseInt(n))

  return { line, remaining }
}

function countOccurrences(inputString: string, charToCount: string): number {
  let count = 0

  for (const char of inputString) {
    if (char === charToCount) {
      count++
    }
  }

  return count
}

function joinDots(line: string) {
  return line.replace(/^\.+|\.+$/g, '').replace(/\.{2,}/g, '.')
}

function getMinimalSolutionLine(remaining: number[]) {
  return remaining
    .map((c) => '#'.repeat(c) + '.')
    .join('')
    .slice(0, -1)
}

export function getDotCombinations(
  count: number,
  indexCount: number,
): number[][] {
  const result: number[][] = []
  const currentCombination: number[] = new Array(indexCount).fill(0)

  function generateCombinations(index: number, remainingSum: number): void {
    if (index === indexCount - 1) {
      currentCombination[index] = remainingSum
      result.push([...currentCombination])
      return
    }

    for (let i = 0; i <= remainingSum; i++) {
      currentCombination[index] = i
      generateCombinations(index + 1, remainingSum - i)
    }
  }

  generateCombinations(0, count)
  return result
}

export function getSolutionsForDotCombinations(
  minimal: string,
  dotCombinations: number[][],
) {
  let pattern = '.' + minimal + '.'
  let idx = 0

  while (pattern.indexOf('.') > -1) {
    pattern = pattern.replace('.', `${idx}`)
    idx++
  }

  return dotCombinations.map((combination) => {
    let solution = pattern
    for (let i = 0; i < combination.length; i++) {
      const dotsToAdd =
        i === 0 || i === combination.length - 1
          ? combination[i]
          : combination[i] + 1
      solution = solution.replace(i.toString(), '.'.repeat(dotsToAdd))
    }
    return solution
  })
}

function getSolutionCount(text: string) {
  const { line, remaining } = parse(text)
  const minimal = getMinimalSolutionLine(remaining)
  let count = 0

  console.log(`getSolutionCount for ${line} [${remaining}]`)

  // line: ????.### 1,1,3
  // minimal: #.#.###

  const dotCount = line.length - minimal.length
  const dotIndexCount = remaining.length + 1
  const dotCombinationsKey = `${dotCount}${dotIndexCount}`

  let dotCombinations = []

  if (cache.has(dotCombinationsKey)) {
    cacheHit++
    dotCombinations = cache.get(dotCombinationsKey)!
  } else {
    dotCombinations = getDotCombinations(dotCount, dotIndexCount)
  }

  // create possible solution lines
  const possibleSolutions = getSolutionsForDotCombinations(
    minimal,
    dotCombinations,
  )

  // check valid possible solution lines

  console.log(possibleSolutions.length)

  console.info('CACHE INFO')
  console.log({
    cacheHit,
    cacheSize: cache.size,
  })

  return count
}

function partOne(input: string[]) {
  return input
    .map((text) => getSolutionCount(unfoldLine(text)))
    .reduce((sum, s) => sum + s, 0)
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
