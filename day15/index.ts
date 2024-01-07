import { arrayRange, asyncReadFile } from '../util.ts'

function parse(input: string[]) {
  return input[0].split(',')
}

function getHashValue(code: string) {
  let sum = 0

  for (const char of code) {
    sum += char.charCodeAt(0)
    sum *= 17
    sum %= 256
  }

  return sum
}

class Box {
  private lenseMap = new Map<string, number>()
  private labels: string[] = []

  constructor(private id: number) {}

  get hasLense() {
    return this.labels.length > 0
  }

  addLense(label: string, focalLength: number) {
    if (this.lenseMap.has(label)) {
      this.lenseMap.delete(label)
    } else {
      this.labels.push(label)
    }

    this.lenseMap.set(label, focalLength)
  }

  removeLense(label: string) {
    const lense = this.lenseMap.get(label)

    if (lense === undefined) return

    this.lenseMap.delete(label)
    this.labels = this.labels.filter((l) => l !== label)
  }

  getFocusingPower() {
    return this.labels
      .map((label) => this.lenseMap.get(label)!)
      .map((foc, i) => (1 + this.id) * (i + 1) * foc)
      .reduce((sum, pow) => sum + pow, 0)
  }
}

function partOne(input: string[]) {
  const codes = parse(input)
  let sum = 0

  for (const code of codes) {
    sum += getHashValue(code)
  }

  return sum
}

function partTwo(input: string[]) {
  const codes = parse(input)
  const boxes = arrayRange(0, 255).map((i) => new Box(i))

  for (const code of codes) {
    if (code.includes('=')) {
      const [label, focalStr] = code.split('=')
      const focalLength = parseInt(focalStr)
      const boxId = getHashValue(label)
      boxes[boxId].addLense(label, focalLength)
    } else {
      const label = code.replace('-', '')
      const boxId = getHashValue(label)
      boxes[boxId].removeLense(label)
    }
  }

  return boxes
    .filter((b) => b.hasLense)
    .reduce((sum, b) => sum + b.getFocusingPower(), 0)
}

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

console.log('Part one: ', partOne(input))
console.log('Part two: ', partTwo(input))
