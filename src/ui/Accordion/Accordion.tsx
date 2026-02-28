import {
  useState,
  useId,
  type ReactNode
} from 'react';
import { Button } from '$/ui/Button';
import { classNames } from '$/utils/classNames';
import { ChevronIcon } from './ChevronIcon';

import styled from './Accordion.module.css';

type AccordionProps = {
  ariaLevel?: number;
  children?: ReactNode;
  title: string;
}

export function Accordion({ ariaLevel = 3, children, title }: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentPanelId = useId();
  const headerButtonId = useId();

  const onButtonClick = () => setIsExpanded(state => !state);

  return (
    <div className={classNames(styled.container, { [styled.containerExpanded]: isExpanded })}>
      <div role="heading" aria-level={ariaLevel}>
        <Button
          aria-expanded={isExpanded}
          aria-controls={contentPanelId}
          id={headerButtonId}
          className={styled.headerButton}
          onClick={onButtonClick}
        >
          <span className={styled.headerButtonText}>
            {title}
          </span>

          <ChevronIcon className={styled.headerButtonIcon} />
        </Button>
      </div>

      <section
        aria-labelledby={headerButtonId}
        id={contentPanelId}
        className={styled.contentPanel}
        aria-hidden={!isExpanded}
      >
        {children}
      </section>
    </div>
  );
}
