import { expect, test } from 'bun:test'
import { getDotCombinations, getSolutionsForDotCombinations } from './index.ts'

test('getDotCombinations', () => {
  expect(getDotCombinations(1, 1)).toEqual([[1]])
  expect(getDotCombinations(2, 1)).toEqual([[2]])
  expect(getDotCombinations(0, 4)).toEqual([[0, 0, 0, 0]])
  expect(getDotCombinations(1, 2)).toEqual([
    [0, 1],
    [1, 0],
  ])
})

test('getSolutionsForDotCombinations', () => {
  expect(getSolutionsForDotCombinations('#.#.###', [[1, 0, 0, 0]])).toEqual([
    '.#.#.###',
  ])
  expect(getSolutionsForDotCombinations('#.#.###', [[0, 0, 0, 0]])).toEqual([
    '#.#.###',
  ])
  expect(getSolutionsForDotCombinations('#.#.###', [[0, 1, 1, 0]])).toEqual([
    '#..#..###',
  ])
  expect(getSolutionsForDotCombinations('#.#.###', [[1, 1, 2, 1]])).toEqual([
    '.#..#...###.',
  ])
})
