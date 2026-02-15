import {classNames} from '$/utils/classNames';
import {NotationCellProto, type NotationCellProtoProps} from '$/ui/NotationCellProto';

import styles from './NotationCell.module.css';

export type NotationCellState = 'neutral' | 'complete' | 'current';

type NotationCellProps = NotationCellProtoProps & {
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
