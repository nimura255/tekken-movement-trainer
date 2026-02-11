import {classNames} from '$/utils/classNames';
import type {DirectionInput} from '$/types';
import {NotationCellProto, type NotationCellProtoProps} from '$/ui/NotationCellProto';

import styles from './NotationCell.module.css';

export type NotationCellState = 'neutral' | 'complete' | 'current';

type NotationCellProps = NotationCellProtoProps & {
  direction: DirectionInput;
  className?: string;
  state?: NotationCellState;
}

export function NotationCell({direction, state = 'neutral', className}: NotationCellProps) {
  return (
    <NotationCellProto
      direction={direction}
      className={classNames(styles.container, className, styles[state])}
    />
  );
}
