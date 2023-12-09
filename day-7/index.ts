import { asyncReadFile } from '../util.ts'

const input = await asyncReadFile(new URL('input.txt', import.meta.url))

const cardTypesMap = {
  A: 12,
  K: 11,
  Q: 10,
  J: -1,
  T: 8,
  '9': 7,
  '8': 6,
  '7': 5,
  '6': 4,
  '5': 3,
  '4': 2,
  '3': 1,
  '2': 0,
} as const

const handTypesMap = {
  FiveOfAKind: 6,
  FourOfAKind: 5,
  FullHouse: 4,
  ThreeOfAKind: 3,
  TwoPair: 2,
  OnePair: 1,
  HighCard: 0,
} as const

console.log('Res: ', solve(input))

//

function solve(input: string[]) {
  const hands = parseHands(input)
  const sortedHands = hands.sort((a, b) => compareHandsWithJokerFn(a, b))
  return sortedHands.reduce(
    (sum, hand, index) => sum + hand.bid * (index + 1),
    0,
  )
}

function parseHands(input: string[]) {
  return input.map((i) => {
    const handArr = i.split(' ')
    const cards = [...(handArr[0] as unknown as CardType[])]
    const handType = getHandType(cards)
    const hasJoker = cards.includes('J')
    const handTypeValue = handTypesMap[handType]
    const jokerNumber = cards.filter((c) => c === 'J').length
    const handTypeWithJoker = getHandTypeWithJoker(cards)
    return {
      cards,
      cardValues: cards.map((c) => cardTypesMap[c]),
      handType,
      handTypeWithJoker,
      handTypeValueWithJoker: handTypesMap[handTypeWithJoker],
      handTypeValue,
      jokerNumber,
      hasJoker,
      bid: parseInt(handArr[1]),
    } satisfies Hand
  })
}

function compareHandsWithJokerFn(a: Hand, b: Hand) {
  const aHandValue = a.handTypeValueWithJoker
  const bHandValue = b.handTypeValueWithJoker

  let ret = 0

  if (aHandValue === bHandValue) {
    for (let i = 0; i < 5; i++) {
      if (a.cardValues[i] !== b.cardValues[i]) {
        ret = a.cardValues[i] - b.cardValues[i]
        break
      }
    }
  } else {
    ret = aHandValue - bHandValue
  }

  return ret
}

function getHandType(cards: CardType[]): HandType {
  const cardTypeCountsMap: { [type in CardType]?: number } = {}

  cards.forEach(
    (cardType) =>
      (cardTypeCountsMap[cardType] = (cardTypeCountsMap[cardType] ?? 0) + 1),
  )

  const cardTypeCounts = Object.values(cardTypeCountsMap).sort((a, b) => a - b)

  if (cardTypeCounts[0] === 5) {
    return 'FiveOfAKind'
  }

  if (cardTypeCounts[1] === 4) {
    return 'FourOfAKind'
  }

  if (cardTypeCounts[0] === 2 && cardTypeCounts[1] === 3) {
    return 'FullHouse'
  }

  if (cardTypeCounts[2] === 3) {
    return 'ThreeOfAKind'
  }

  if (cardTypeCounts[1] === 2 && cardTypeCounts[2] === 2) {
    return 'TwoPair'
  }

  if (cardTypeCounts[3] === 2) {
    return 'OnePair'
  }

  return 'HighCard'
}

function getHandTypeWithJoker(cards: CardType[]): HandType {
  const cardTypeCountsMap: { [type in CardType]?: number } = {}

  const jokerCount = cards.filter((c) => c === 'J').length

  cards
    .filter((c) => c !== 'J')
    .forEach(
      (cardType) =>
        (cardTypeCountsMap[cardType] = (cardTypeCountsMap[cardType] ?? 0) + 1),
    )

  const cardTypeCounts = Object.values(cardTypeCountsMap).sort((a, b) => a - b)

  cardTypeCounts[cardTypeCounts.length - 1] += jokerCount

  // All J's
  if (Object.keys(cardTypeCountsMap).length === 0) return 'FiveOfAKind'

  if (cardTypeCounts[0] === 5) {
    return 'FiveOfAKind'
  }

  if (cardTypeCounts[1] === 4) {
    return 'FourOfAKind'
  }

  if (cardTypeCounts[0] === 2 && cardTypeCounts[1] === 3) {
    return 'FullHouse'
  }

  if (cardTypeCounts[2] === 3) {
    return 'ThreeOfAKind'
  }

  if (cardTypeCounts[1] === 2 && cardTypeCounts[2] === 2) {
    return 'TwoPair'
  }

  if (cardTypeCounts[3] === 2) {
    return 'OnePair'
  }

  return 'HighCard'
}

interface Hand {
  cards: CardType[]
  cardValues: number[]
  handType: HandType
  handTypeWithJoker: HandType
  handTypeValue: number
  handTypeValueWithJoker: number
  jokerNumber: number
  hasJoker: boolean
  bid: number
}

type HandType = keyof typeof handTypesMap

type CardType = keyof typeof cardTypesMap
