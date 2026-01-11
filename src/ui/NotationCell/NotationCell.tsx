import back from '$/assets/b.png';
import downBack from '$/assets/db.png';
import down from '$/assets/d.png';
import downForward from '$/assets/df.png';
import forward from '$/assets/f.png';
import neutral from '$/assets/n.png';
import {classNames} from '$/utils/classNames';
import type {DirectionInput} from '$/types';

import styles from './NotationCell.module.css';

export type NotationCellState = 'neutral' | 'complete' | 'current';

type NotationCellProps = {
  direction: DirectionInput;
  className?: string;
  state?: NotationCellState;
}

const directionToIconMap: Partial<Record<DirectionInput, string>> = {
  b: back,
  db: downBack,
  d: down,
  df: downForward,
  f: forward,
  n: neutral,
}

const directionToCharMap: Partial<Record<DirectionInput, string>> = {
  b: '←',
  db: '↙',
  d: '↓',
  df: '↘',
  f: '→',
  n: '★'
}

export function NotationCell({direction, state = 'neutral', className}: NotationCellProps) {
  return (
    <img
      className={classNames(styles.container, className, styles[state])}
      src={directionToIconMap[direction]}
      alt={directionToCharMap[direction]}
    />
  )
}
