import { asyncReadFile } from '../util.ts'

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

const maxX = input[0].length - 1
const maxY = input.length - 1

interface Location {
  x: number
  y: number
  pipe: Pipe
  id: string
}

interface PathCursor {
  firstLocation: Location
  location: Location
  previousLocation: Location
}

const adjacentDiffs = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
]

const pipesDirMap = {
  '|': 'vertical',
  F: 'both',
  L: 'both',
  J: 'both',
  '-': 'horizontal',
  '7': 'both',
  S: 'both',
} as const

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

const pipeLocationsMap = getPipeLocationsMap(input)
const pipeLocations = Array.from(pipeLocationsMap.values())

function isPipe(char: string): char is Pipe {
  return Object.keys(pipesMap).includes(char)
}

function getAllLocationsEntries(input: string[]) {
  return input.flatMap((line, y) =>
    line
      .split('')
      .map((c, x) => [c, x] as const)
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
}

function getPipeLocationsMap(input: string[]) {
  return new Map<string, Location>(
    getAllLocationsEntries(input).filter(([_, c]) => isPipe(c.pipe)),
  )
}

const findDuplicate = (arr: string[]) =>
  arr.filter((item, index) => arr.indexOf(item) !== index)[0]

function isXYValid(x: number, y: number) {
  return x >= 0 && x <= maxX && y >= 0 && y <= maxY
}

function getInitialPathCursors(startLocation: Location): PathCursor[] {
  const locations = Array.from(pipeLocationsMap.values())

  return locations
    .filter(({ x, y, pipe }) => {
      const diffX = x - startLocation.x
      const diffY = y - startLocation.y

      const adjacentX = Math.abs(diffX) <= 1 && x >= 0 && x <= maxX
      const adjacentY = Math.abs(diffY) <= 1 && y >= 0 && y <= maxY

      const validDir = Boolean(
        pipesMap['S'].find(([x, y]) => x === diffX && y === diffY),
      )
      const isPrevS = pipesMap[pipe].some(
        ([sDiffX, sDiffY]) =>
          x + sDiffX === startLocation.x && y + sDiffY === startLocation.y,
      )

      return adjacentX && adjacentY && pipe !== 'S' && validDir && isPrevS
    })
    .map((l) => ({
      previousLocation: startLocation,
      location: l,
      firstLocation: l,
    }))
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
  const { previousLocation, location, firstLocation } = cursor
  const { x, y } = location
  const { x: prevX, y: prevY } = previousLocation

  const possibleIds = pipesMap[location.pipe].map(
    ([diffX, diffY]) => `${x + diffX}-${y + diffY}`,
  )
  const possibleLocations = adjacentDiffs
    .map(([diffX, diffY]) => [x + diffX, y + diffY])
    .filter(([x, y]) => isXYValid(x, y) && (x !== prevX || y !== prevY))
    .map(([x, y]) => `${x}-${y}`)
    .map((locId) => pipeLocationsMap.get(locId))
    .filter(Boolean)
    .filter((loc) => possibleIds.includes(loc!.id))

  const possiblePathCursors = possibleLocations.map(
    (loc) =>
      ({
        previousLocation: location,
        location: loc,
        firstLocation,
      }) as PathCursor,
  )

  return possiblePathCursors.filter((c) => isValidPathCursor(c))
}

function isLocationInLoop(
  location: Location,
  pathLocationsMap: Record<string, Location>,
) {
  const { x, y } = location
  let breakLines = []

  const isPartOfLoop = Boolean(pathLocationsMap[location.id])

  if (isPartOfLoop) return false

  for (let i = x; i <= maxX; i++) {
    const dir = pipesDirMap[pathLocationsMap[`${i}-${y}`]?.pipe]
    if (['vertical', 'both'].includes(dir))
      breakLines.push(pathLocationsMap[`${i}-${y}`]?.pipe)
  }

  let breaklinesCount = 0

  for (let i = 0; i < breakLines.length; i++) {
    const pipe = breakLines[i]

    if (['L', 'F'].includes(pipe)) {
      if (i + 1 < breakLines.length) {
        if (['L7', 'FJ'].includes(`${pipe}${breakLines[i + 1]}`)) {
          breaklinesCount++
        }
        i++
      }
    } else {
      breaklinesCount++
    }
  }

  return breaklinesCount % 2 === 1
}

function partOne() {
  const startLocation = pipeLocations.find((l) => l.pipe === 'S')!

  let step = 1
  let currentPathCursors = getInitialPathCursors(startLocation)

  let finish = false

  while (!finish) {
    currentPathCursors = currentPathCursors.flatMap((c) =>
      getNextPathCursors(c),
    )
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

function partTwo() {
  const startLocation = pipeLocations.find((l) => l.pipe === 'S')!

  let currentPathCursors = getInitialPathCursors(startLocation)
  let finish = false

  let pathMap = currentPathCursors.reduce(
    (map, cursor) => {
      map[cursor.firstLocation.id] = []
      return map
    },
    {} as Record<string, Location[]>,
  )
  const pathLocations = []

  while (!finish) {
    currentPathCursors.forEach((cursor) => {
      pathMap[cursor.firstLocation.id].push(cursor.location)
    })

    currentPathCursors = currentPathCursors.flatMap((c) =>
      getNextPathCursors(c),
    )

    const cursorLocationIds = currentPathCursors.map((c) => c.location.id)

    const duplicateLocationId = findDuplicate(cursorLocationIds)

    if (duplicateLocationId) {
      const [a, b] = currentPathCursors
        .filter((c) => c.location.id === duplicateLocationId)
        .map((c) => c.firstLocation.id)
      const finalLocation = pipeLocationsMap.get(duplicateLocationId)
      pathLocations.push(
        ...pathMap[a],
        ...pathMap[b],
        finalLocation,
        startLocation,
      )
      finish = true
    }
  }

  const pathLocationsMap = pathLocations.reduce(
    (map, loc) => {
      map[loc!.id] = loc!
      return map
    },
    {} as Record<string, Location>,
  )

  let sum = 0

  getAllLocationsEntries(input).forEach(([id, loc]) => {
    if (isLocationInLoop(loc, pathLocationsMap)) sum++
  })

  return sum
}

console.log('Part one: ', partOne())
console.log('Part two: ', partTwo())
