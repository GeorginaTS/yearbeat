export function calculateScore(correct: number, guess: number): number {
  const diff = Math.abs(correct - guess)
  if (diff === 0) return 1000
  if (diff <= 1) return 800
  if (diff <= 3) return 600
  if (diff <= 5) return 400
  if (diff <= 10) return 200
  if (diff <= 20) return 50
  return 0
}
