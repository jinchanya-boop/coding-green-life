/**
 * Shuffles a set of MC options and returns the new correctIndex pointing at
 * the same correct option in its new position. Use inside useMemo keyed on
 * the question's id so the order is stable while a question is on screen
 * but varies question-to-question and play-to-play.
 */
export function shuffleOptions(options: string[], correctIndex: number): { options: string[]; correctIndex: number } {
  const order = options.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return {
    options: order.map((i) => options[i]),
    correctIndex: order.indexOf(correctIndex),
  }
}
