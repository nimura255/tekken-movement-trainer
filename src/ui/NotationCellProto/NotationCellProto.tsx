import type {AttackInput, AttackMoveInput, DirectionInput} from '$/types';
import {AttackNotationIcon} from '$/ui/AttackNotationIcon';
import {DirectionNotationIcon} from '$/ui/DirectionNotationIcon';
import {classNames} from '$/utils/classNames';

import styles from './NotationCellProto.module.css';

export type NotationCellProtoProps = {
  direction: AttackMoveInput;
  className?: string;
}

export function NotationCellProto({direction, className}: NotationCellProtoProps) {
  const matches = direction.match(/([dubfn]*)([1234]*)/);
  const directionPart = matches?.[1] as DirectionInput;
  const attackPart = matches?.[2] as AttackInput;

  return (
    <div className={classNames(styles.container, className)}>
      {directionPart ? <DirectionNotationIcon className={styles.directionIcon} direction={directionPart}/> : null}
      {attackPart ? <AttackNotationIcon input={attackPart} className={styles.attackIcon} /> : null}
    </div>
  )
}
