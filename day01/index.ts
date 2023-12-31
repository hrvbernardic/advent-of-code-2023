import { URL } from 'url'
import { asyncReadFile } from '../util.ts'

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

const validStringMap = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const

let calibrationValues = input.map((text) => getStringCalibrationValue(text))

const stringSum = calibrationValues.reduce((sum, value) => sum + value, 0)
console.log(stringSum)

//

function getStringCalibrationValue(text: string) {
  const matches = Object.keys(validStringMap)
    .flatMap((str) =>
      getAllOccurrences(text, str).map((o) => ({
        index: o.index,
        val: validStringMap[o.value],
      })),
    )
    .sort((a, b) => a.index - b.index)

  const first = matches.at(0)?.val
  const last = matches.at(-1)?.val

  return parseInt(`${first}${last}`)
}

function getAllOccurrences(mainString: string, subString: string) {
  let indices = []
  let currentIndex = mainString.indexOf(subString)

  while (currentIndex !== -1) {
    indices.push(currentIndex)
    currentIndex = mainString.indexOf(subString, currentIndex + 1)
  }

  return indices.map((i) => ({
    index: i,
    value: subString as keyof typeof validStringMap,
  }))
}
