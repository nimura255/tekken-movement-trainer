export function calcTrainingAccuracy(correct: number, total: number) {
  if (!total) {
    return 100;
  }

  return Math.trunc((correct / total) * 100);
}
