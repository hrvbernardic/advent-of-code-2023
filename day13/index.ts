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

function generateAllPotentialSmudgeMaps(map: string[]) {
  const length = map.length
  const rowLength = map[0].length

  const maps = []

  for (let x = 0; x < length; x++) {
    for (let y = 0; y < rowLength; y++) {
      let newMap = [...map]
      const currChar = newMap[x][y]
      const newChar = currChar === '.' ? '#' : '.'
      newMap[x] = setCharAt(newMap[x], y, newChar)
      maps.push(newMap)
    }
  }

  return maps
}

function setCharAt(str: string, index: number, chr: string) {
  if (index > str.length - 1) return str
  return str.substring(0, index) + chr + str.substring(index + 1)
}

function areSubsetArrays(a: string[], b: string[]) {
  return (
    a.map((ri, idx) => b[idx] === ri).reduce((is, i) => is && i, true) ||
    b.map((ri, idx) => a[idx] === ri).reduce((is, i) => is && i, true)
  )
}

function isMirror(items: string[], forMap: string[]) {
  if (items.length === 0) return false

  const rest = forMap.slice(items.length, forMap.length)
  const rItems = [...items].reverse()

  const revRest = [...rest].reverse()
  const revRItems = [...items]

  return areSubsetArrays(rest, rItems) || areSubsetArrays(revRest, revRItems)
}

function findMirrorEndIndex(map: string[]) {
  let mirrorItems: string[] = []

  for (let i = 0; i < map.length; i++) {
    mirrorItems.push(map[i])
    if (mirrorItems[i] === map[i + 1] && isMirror(mirrorItems, map)) break
  }

  return mirrorItems.length === map.length ? 0 : mirrorItems.length
}

function findMirrorEndIndexes(map: string[]) {
  let mirrorItems: string[] = []
  let indexes = []

  for (let i = 0; i < map.length; i++) {
    mirrorItems.push(map[i])
    if (mirrorItems[i] === map[i + 1] && isMirror(mirrorItems, map))
      indexes.push(mirrorItems.length === map.length ? 0 : mirrorItems.length)
  }

  return indexes
}

function findSmudgeMirrorEndIndex(map: string[]) {
  const smudgeMaps = generateAllPotentialSmudgeMaps(map)
  const currentIndex = findMirrorEndIndex(map)

  let newIndex = 0
  let count = 0

  for (let i = 0; i < smudgeMaps.length; i++) {
    const smudgeMap = smudgeMaps[i]

    const smudgeIndexes = findMirrorEndIndexes(smudgeMap).filter(
      (idx) => idx !== currentIndex,
    )

    if (smudgeIndexes.length > 0) {
      count++
      newIndex = smudgeIndexes[0]
      break
    }
  }

  return newIndex
}

function partOne(input: string[]) {
  const maps = parse(input)
  let sum = 0

  maps.forEach((m) => {
    const verticalMirrorIndex = findMirrorEndIndex(transpose(m))
    const horizontalMirrorIndex = findMirrorEndIndex(m)

    sum += horizontalMirrorIndex * 100 + verticalMirrorIndex
  })

  return sum
}

function partTwo(input: string[]) {
  const maps = parse(input)
  let sum = 0

  maps.forEach((m) => {
    const smudgeVerticalMirrorIndex = findSmudgeMirrorEndIndex(transpose(m))
    const smudgeHorizontalMirrorIndex = findSmudgeMirrorEndIndex(m)

    sum += smudgeHorizontalMirrorIndex * 100 + smudgeVerticalMirrorIndex
  })

  return sum
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
console.log('Part two: ', partTwo(input))
