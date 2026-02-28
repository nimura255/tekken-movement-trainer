import { EventEmitter } from '$/event-emitter';
import { calcTrainingAccuracy } from '$/utils/training-stats';
import { localStorageKeyPrefix } from './constants';
import type { HighScoresListItem } from './types';

export const localStorageEventEmitter = new EventEmitter<HighScoresListItem[]>();

export function saveHighScoreRecord(sequenceKey: string, record: Pick<HighScoresListItem, 'correct' | 'total'>) {
  const items = getHighScores(sequenceKey);
  const newList = [...items, {...record, timestamp: Date.now()}]
    .sort((a, b) => {
      if (a.correct > b.correct) {
        return -1;
      }

      if (a.correct < b.correct) {
        return 1;
      }

      const accuracyOfA = calcTrainingAccuracy(a.correct, a.total);
      const accuracyOfB = calcTrainingAccuracy(b.correct, b.total);

      return accuracyOfB - accuracyOfA;
    })
    .slice(0, 5);

  saveHighScores(sequenceKey, newList);
  notifyHighScoresChange(sequenceKey, newList);
}

export function getHighScores(sequenceKey: string): HighScoresListItem[] {
  const currentHighScores = localStorage.getItem(getLocalStorageKey(sequenceKey));

  if (!currentHighScores) {
    return [];
  }

  try {
    return JSON.parse(currentHighScores);
  } catch {
    return [];
  }
}

export function notifyHighScoresChange(sequenceKey: string, items: HighScoresListItem[]) {
  localStorageEventEmitter.notify(getLocalStorageKey(sequenceKey), items);
}

export function subscribeToHighScoresChanges(
  sequenceKey: string,
  listener: (items: HighScoresListItem[]) => void
) {
  localStorageEventEmitter.subscribe(getLocalStorageKey(sequenceKey), listener);
}

export function unsubscribeFromHighScoresChanges(
  sequenceKey: string,
  listener: (items: HighScoresListItem[]) => void
) {
  localStorageEventEmitter.unsubscribe(getLocalStorageKey(sequenceKey), listener);
}

function saveHighScores(sequenceKey: string, items: HighScoresListItem[]) {
  localStorage.setItem(getLocalStorageKey(sequenceKey), JSON.stringify(items));
}

function getLocalStorageKey(key: string) {
  return `${localStorageKeyPrefix}-${key}`;
}
