import type {DirectionInput} from '$/types';
import {NotationCellProto} from '$/ui/NotationCellProto';
import {classNames} from '$/utils/classNames';

import styles from './NotationItemsList.module.css';

type NotationItemsListProps = {
  items: DirectionInput[];
  className?: string;
};

export function NotationItemsList({items, className}: NotationItemsListProps) {
  return (
    <div className={classNames(styles.list, className)}>
      {items.map((item, index) => (
        <NotationCellProto
          key={`${item}-${index}`}
          direction={item}
          className={styles.listItem}
        />
      ))}
    </div>
  )
}
