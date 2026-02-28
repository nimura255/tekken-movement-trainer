import { useState, useEffect } from 'react';
import { Accordion } from '$/ui/Accordion';
import { calcTrainingAccuracy } from '$/utils/training-stats';
import type { HighScoresListItem } from './types';
import {
  getHighScores,
  subscribeToHighScoresChanges,
  unsubscribeFromHighScoresChanges
} from './utils';

import styles from './HighScoresList.module.css';

type HighScoresListProps = {
  sequenceKey: string;
};

export function HighScoresList({ sequenceKey }: HighScoresListProps) {
  const [items, setItems] = useState<HighScoresListItem[]>([]);

  useEffect(() => {
    setItems(getHighScores(sequenceKey));
  }, [sequenceKey])

  useEffect(() => {
    subscribeToHighScoresChanges(sequenceKey, setItems);

    return () => {
      unsubscribeFromHighScoresChanges(sequenceKey, setItems);
    }
  }, [sequenceKey]);

  return (
    <Accordion title="High Scores">
      {
        items.length
          ? (
            <ul className={styles.listContainer}>
              {items.map((item, index) => {
                const accuracy = calcTrainingAccuracy(item.correct, item.total);

                return (
                  <li key={index} className={styles.listItem}>
                    <div className={styles.stats}>
                      <span>Correct: {item.correct}</span>
                      <span>Total: {item.total}</span>
                      <span>Accuracy: {accuracy}%</span>
                    </div>
                    <span>{formatDate(item.timestamp)}</span>
                  </li>
                )
              })}
            </ul>
          )
          : <div className={styles.placeholder}>No high scores yet</div>
      }
    </Accordion>
  );
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp);

  return date.toLocaleString();
}

