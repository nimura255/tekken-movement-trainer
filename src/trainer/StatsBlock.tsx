import styles from "$/trainer/Trainer.module.css";
import {classNames} from "$/utils/classNames.ts";

type StatsBlockProps = {
  total: number;
  correct: number;
}

export function StatsBlock({correct, total}: StatsBlockProps) {
  const accuracy = calcAccuracy(correct, total);

  return (
    <div className={styles.statsContainer}>
      <div className={classNames(styles.statItem, styles.accuracyStatItem)}>
        <span className={styles.statItemLabel}>Accuracy</span>
        <span>{accuracy}%</span>
        <div className={styles.barContainer}>
          <div className={styles.bar} style={{width: `${accuracy}%`}} />
        </div>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statItemLabel}>Total</span>
        <span>{total}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statItemLabel}>Correct</span>
        <span>{correct}</span>
      </div>
    </div>
  );
}

function calcAccuracy(correct: number, total: number) {
  if (!total) {
    return 100;
  }

  return Math.trunc((correct / total) * 100);
}
