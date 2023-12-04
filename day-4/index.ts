import { asyncReadFile } from '../util.ts';

const input =
  (await asyncReadFile(new URL('input.txt', import.meta.url))) ?? [];

const game = parseGame(input);

game.cards.forEach((card) => {
  const currentId = card.cardId;
  const winCount = card.matchedNumberCount;
  const currentCardCount = game.cardCounts[currentId];

  for (let i = 1; i <= winCount; i++) {
    game.cardCounts[i + currentId] += currentCardCount;
  }
});

console.log(
  Object.values(game.cardCounts).reduce((acc, curr) => acc + curr, 0),
);

//

interface Game {
  cardCounts: CardCounts;
  cards: Card[];
}

interface CardCounts {
  [cardId: number]: number;
}

interface Card {
  cardId: number;
  winningNumbers: number[];
  yourNumbers: number[];
  matchedNumberCount: number;
}

function parseGame(input: string[]) {
  const cards = parseCards(input);
  const cardCounts: CardCounts = {};
  cards.forEach((card) => (cardCounts[card.cardId] = 1));
  return { cards, cardCounts } satisfies Game;
}

function parseCards(input: string[]) {
  return input.map((line, index) => {
    const numbers = line.split(':')[1].trim().split('|');

    const getNumbers = (line: string) =>
      line
        .trim()
        .split(' ')
        .filter((n) => n.length)
        .map((n) => parseInt(n, 10));

    const winningNumbers = getNumbers(numbers[0]);
    const yourNumbers = getNumbers(numbers[1]);

    return {
      cardId: index + 1,
      winningNumbers,
      yourNumbers,
      matchedNumberCount: getNumberOfWinningPoints(yourNumbers, winningNumbers),
    } satisfies Card;
  });
}

function getNumberOfWinningPoints(
  yourNumbers: number[],
  winningNumbers: number[],
) {
  const resSet = new Set([...winningNumbers, ...yourNumbers]);
  return winningNumbers.length + yourNumbers.length - resSet.size;
}

function getCardPoints(card: Card) {
  return card.matchedNumberCount === 0
    ? 0
    : Math.pow(2, card.matchedNumberCount - 1);
}
