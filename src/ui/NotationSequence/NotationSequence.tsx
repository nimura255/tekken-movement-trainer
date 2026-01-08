import type {DirectionInput} from '$/types';
import {NotationCell} from '$/ui/NotationCell';

import styles from './NotationSequence.module.css';
import type {NotationCellState} from "$/ui/NotationCell";

type NotationSequenceProps = {
  sequence: DirectionInput[];
  currentCellIndex?: number;
}

export function NotationSequence({sequence, currentCellIndex}: NotationSequenceProps) {
  return (
    <div className={styles.container}>
      {sequence.map((item, index) => (
        <NotationCell
          direction={item}
          key={`${item}-${index}`}
          state={convertIndexToState(index, currentCellIndex)}
        />
      ))}
    </div>
  )
}

function convertIndexToState(cellIndex: number, currentIndex: number | undefined): NotationCellState {
  if (typeof currentIndex !== 'number') {
    return 'neutral';
  }

  if (cellIndex === currentIndex) {
    return 'current';
  }

  if (cellIndex < currentIndex) {
    return 'complete'
  }

  return 'neutral';
}
