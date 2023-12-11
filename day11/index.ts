import { arrayRange, asyncReadFile } from '../util.ts'

interface Position {
  x: number
  y: number
}

type PositionsMap = Map<string, Position>

function arrayDiff<T>(a: T[], b: T[]): T[] {
  return a.filter((ac) => !b.includes(ac))
}

function getEmptyIndexes(input: string[], positionsMap: PositionsMap) {
  const galaxyPositions = Array.from(positionsMap.values())

  const maxX = input[0].length - 1
  const maxY = input.length - 1

  const xs = Array.from(new Set(galaxyPositions.map(({ x }) => x)))
  const ys = Array.from(new Set(galaxyPositions.map(({ y }) => y)))

  const xAll = arrayRange(0, maxX)
  const yAll = arrayRange(0, maxY)

  const x = arrayDiff(xAll, xs)
  const y = arrayDiff(yAll, ys)

  return { x, y }
}

function getPositionsMap(input: string[]) {
  const map = new Map<string, Position>()
  let id = 1
  const maxX = input[0].length
  const maxY = input.length

  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      if (input[y][x] === '#') map.set(`${id++}`, { x, y })
    }
  }

  return map
}

function getDistance(
  from: Position,
  to: Position,
  emptyIndexes: { x: number[]; y: number[] },
  emptyLength: number,
) {
  const { x, y } = emptyIndexes
  const { x: fromX, y: fromY } = from
  const { x: toX, y: toY } = to

  const minX = Math.min(fromX, toX)
  const maxX = Math.max(fromX, toX)
  const minY = Math.min(fromY, toY)
  const maxY = Math.max(fromY, toY)
  const extraX = x.filter((x) => x > minX && x < maxX).length
  const extraY = y.filter((y) => y > minY && y < maxY).length

  return (
    Math.abs(from.x - to.x) +
    Math.abs(from.y - to.y) +
    (extraX + extraY) * (emptyLength - 1)
  )
}

function getSumOfDistances(
  positionsMap: PositionsMap,
  emptyIndexes: { x: number[]; y: number[] },
  emptyLength: number,
) {
  const distanceMap = new Map<string, number>()
  const positionEntries = Array.from(positionsMap.entries())

  let sum = 0

  const distanceId = (fromId: string, toId: string) =>
    [fromId, toId].sort().join('-')

  positionEntries.forEach(([fromId, fromPos]) => {
    positionEntries.forEach(([toId, toPos]) => {
      const id = distanceId(fromId, toId)
      if (!distanceMap.get(id)) {
        distanceMap.set(
          id,
          getDistance(fromPos, toPos, emptyIndexes, emptyLength),
        )
        sum += distanceMap.get(id) ?? 0
      }
    })
  })

  return sum
}

function partOne(input: string[]) {
  const positionsMap = getPositionsMap(input)
  const emptyIndexes = getEmptyIndexes(input, positionsMap)
  return getSumOfDistances(positionsMap, emptyIndexes, 2)
}

function partTwo(input: string[]) {
  const positionsMap = getPositionsMap(input)
  const emptyIndexes = getEmptyIndexes(input, positionsMap)
  return getSumOfDistances(positionsMap, emptyIndexes, 1000000)
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
console.log('Part two: ', partTwo(input))
