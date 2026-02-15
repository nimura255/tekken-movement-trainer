import back from '$/assets/b.png';
import downBack from '$/assets/db.png';
import down from '$/assets/d.png';
import downForward from '$/assets/df.png';
import forward from '$/assets/f.png';
import neutral from '$/assets/n.png';
import type {AttackInput, AttackMoveInput, DirectionInput} from '$/types';
import {AttackNotationIcon} from '$/ui/AttackNotationIcon';
import {classNames} from '$/utils/classNames';

import styles from './NotationCellProto.module.css';

export type NotationCellProtoProps = {
  direction: AttackMoveInput;
  className?: string;
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
  n: '★',
}

export function NotationCellProto({direction, className}: NotationCellProtoProps) {
  const matches = direction.match(/([dubfn]*)([1234]*)/);
  const directionPart = matches?.[1] as DirectionInput;
  const attackPart = matches?.[2] as AttackInput;

  const directionIcon = directionToIconMap[directionPart];
  const directionAlt = directionToCharMap[directionPart];

  return (
    <div className={classNames(styles.container, className)}>
      {directionIcon || directionAlt ? (
        <img
          className={styles.directionIcon}
          src={directionIcon}
          alt={directionAlt}
        />
      ) : null}
      {attackPart ? <AttackNotationIcon input={attackPart} className={styles.attackIcon} /> : null}
    </div>
  )
}
