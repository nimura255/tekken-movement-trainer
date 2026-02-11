import back from '$/assets/b.png';
import downBack from '$/assets/db.png';
import down from '$/assets/d.png';
import downForward from '$/assets/df.png';
import forward from '$/assets/f.png';
import neutral from '$/assets/n.png';
import type {DirectionInput} from '$/types';

export type NotationCellProtoProps = {
  direction: DirectionInput;
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
  n: '★'
}

export function NotationCellProto({direction, className}: NotationCellProtoProps) {
  return (
    <img
      className={className}
      src={directionToIconMap[direction]}
      alt={directionToCharMap[direction]}
    />
  )
}
