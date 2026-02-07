import type {DirectionInput} from '$/types';
import {NotationCell, type NotationCellState} from '$/ui/NotationCell';

import styles from './NotationSequence.module.css';

type NotationSequenceProps = {
  sequence: DirectionInput[];
  currentCellIndex?: number;
  alignCells?: 'start' | 'end' | 'center';
}

export function NotationSequence({sequence, currentCellIndex, alignCells}: NotationSequenceProps) {
  return (
    <div className={styles.container} style={{justifyContent: alignCells}}>
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
