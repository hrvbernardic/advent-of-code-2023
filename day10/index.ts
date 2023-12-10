import { asyncReadFile } from '../util.ts'

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

const maxX = input[0].length - 1
const maxY = input.length - 1

type Dir = 'up' | 'down' | 'left' | 'right'

interface Location {
  x: number
  y: number
  pipe: Pipe
  id: string
}

interface PathCursor {
  location: Location
  previousLocation: Location
}

const adjacentDiffs = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
]

const pipesMap = {
  '|': [
    [0, -1],
    [0, 1],
  ],
  '-': [
    [1, 0],
    [-1, 0],
  ],
  L: [
    [0, -1],
    [1, 0],
  ],
  J: [
    [0, -1],
    [-1, 0],
  ],
  '7': [
    [0, 1],
    [-1, 0],
  ],
  F: [
    [0, 1],
    [1, 0],
  ],
  S: [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
  ],
} as const

type Pipe = keyof typeof pipesMap

const locationsMap = getLocationsMap(input)
const locations = Array.from(locationsMap.values())

function isPipe(char: string): char is Pipe {
  return Object.keys(pipesMap).includes(char)
}

function getLocationsMap(input: string[]) {
  const locationsArr = input.flatMap((line, y) =>
    line
      .split('')
      .map((c, x) => [c, x] as const)
      .filter(([c]) => isPipe(c))
      .map(([c, x]) => {
        const id = `${x}-${y}`
        const loc = {
          x,
          y,
          pipe: c as Pipe,
          id: `${x}-${y}`,
        } satisfies Location
        return [id, loc] as const
      }),
  )

  return new Map<string, Location>(locationsArr)
}

function isXYValid(x: number, y: number) {
  return x >= 0 && x <= maxX && y >= 0 && y <= maxY
}

function getInitialPathCursors(startLocation: Location): PathCursor[] {
  const locations = Array.from(locationsMap.values())

  // TODO: probably checking for diagonal positions which is wrong, Fix!!!
  return locations
    .filter(({ x, y, pipe }) => {
      const diffX = x - startLocation.x
      const diffY = y - startLocation.y

      const adjacentX = Math.abs(diffX) <= 1 && x >= 0 && x <= maxX
      const adjacentY = Math.abs(diffY) <= 1 && y >= 0 && y <= maxY

      const validDir = Boolean(
        pipesMap['S'].find(([x, y]) => x === diffX && y === diffY),
      )
      // check S is valid previous
      const isPrevS = pipesMap[pipe].some(
        ([sDiffX, sDiffY]) =>
          x + sDiffX === startLocation.x && y + sDiffY === startLocation.y,
      )

      return adjacentX && adjacentY && pipe !== 'S' && validDir && isPrevS
    })
    .map((l) => ({ previousLocation: startLocation, location: l }))
}

function isValidPathCursor(cursor: PathCursor) {
  const { previousLocation, location } = cursor
  const { x: prevX, y: prevY } = previousLocation
  const { x, y, pipe } = location

  const [aDiff, bDiff] = pipesMap[pipe]!

  if (!aDiff || !bDiff)
    throw new Error('adiff bdiff not existing for : ' + pipe)

  const aX = aDiff[0] + x
  const aY = aDiff[1] + y

  const bX = bDiff[0] + x
  const bY = bDiff[1] + y

  const aValid = isXYValid(aX, aY)
  const bValid = isXYValid(bX, bY)

  const previousValid =
    (aX === prevX && aY === prevY) || (bX === prevX && bY === prevY)

  return aValid && bValid && previousValid
}

function getNextPathCursors(cursor: PathCursor) {
  const { previousLocation, location } = cursor
  const { x, y } = location
  const { x: prevX, y: prevY } = previousLocation

  const possibleIds = pipesMap[location.pipe].map(
    ([diffX, diffY]) => `${x + diffX}-${y + diffY}`,
  )
  const possibleLocations = adjacentDiffs
    .map(([diffX, diffY]) => [x + diffX, y + diffY])
    .filter(([x, y]) => isXYValid(x, y) && (x !== prevX || y !== prevY))
    .map(([x, y]) => `${x}-${y}`)
    .map((locId) => locationsMap.get(locId))
    .filter(Boolean)
    .filter((loc) => possibleIds.includes(loc!.id))

  const possiblePathCursors = possibleLocations.map(
    (loc) => ({ previousLocation: location, location: loc }) as PathCursor,
  )

  return possiblePathCursors.filter((c) => isValidPathCursor(c))
}

function partOne(input: string[]) {
  const startLocation = locations.find((l) => l.pipe === 'S')!

  let step = 1
  let currentPathCursors = getInitialPathCursors(startLocation)

  let finish = false

  while (!finish) {
    const nextPathCursors = currentPathCursors.flatMap((c) =>
      getNextPathCursors(c),
    )
    currentPathCursors = nextPathCursors
    // check if finished
    const locIds = currentPathCursors.map((c) => c.location.id)
    const locIdSet = new Set(locIds)
    if (locIdSet.size < locIds.length) {
      finish = true
    } else {
      step++
    }
  }

  return step + 1
}

function partTwo(input: string[]) {
  const startLocation = locations.find((l) => l.pipe === 'S')!

  let currentPathCursors = getInitialPathCursors(startLocation)
  let finish = false

  // let pathMap = currentPathCursors.reduce(
  //   (map, cursor) => {
  //     map[cursor.location.id] = []
  //     return map
  //   },
  //   {} as Record<string, Location[]>,
  // )

  while (!finish) {
    // currentPathCursors.forEach((cursor) => {
    //   pathMap[cursor.location.id].push(cursor.location)
    // })

    const nextPathCursors = currentPathCursors.flatMap((c) =>
      getNextPathCursors(c),
    )
    currentPathCursors = nextPathCursors

    const locIds = currentPathCursors.map((c) => c.location.id)
    const locIdSet = new Set(locIds)
    if (locIdSet.size < locIds.length) {
      finish = true
    }
  }

  let sum = 0

  return sum
}

console.log('Part one: ', partOne(input))
console.log('Part two: ', partTwo(input))

function prettyPrintCursor(cursor: PathCursor) {
  const { previousLocation, location } = cursor
  const position = `(${location.pipe}) [${location.x},${location.y}]`
  const prevPosition = `(${previousLocation.pipe}) [${previousLocation.x},${previousLocation.y}]`
  return `Cursor: ${prevPosition} -> ${position}`
}
