import React, { useState } from 'react';
import styles from './accordion.module.scss';
import { ChevronDownIcon } from '@radix-ui/react-icons';

interface CollapsibleAccordionProps {
  title: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<CollapsibleAccordionProps> = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.collapsible} ${isOpen ? styles.open : ''}`}>
      <div className={styles.collapsible__header} onClick={toggleAccordion}>
        <span>{title}</span>
        <div className={styles.collapsible__header__arrow}>
          <ChevronDownIcon />
        </div>
      </div>
      <div className={styles.collapsible__content}>{children}</div>
    </div>
  );
};

export default AccordionItem;
