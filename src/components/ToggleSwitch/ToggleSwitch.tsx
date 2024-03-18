import React from 'react';
import styles from './toggleSwitch.module.css';
import { composeClasses } from '../../libs/utils';

interface IToggleSwitch {
  toggle: boolean;
  handler: () => void;
  outlined?: boolean;
  className?: string;
}
const ToggleSwitch: React.FC<IToggleSwitch> = ({
  toggle,
  handler,
  className,
}) => {
  return (
    <label className={composeClasses(styles.switch, className)}>
      <input checked={toggle} onChange={() => handler()} type="checkbox" />
      <span
        className={composeClasses(
          styles.slider,
          styles.round,
          !toggle && styles.blackSlider,
        )}
      />
    </label>
  );
};

export default ToggleSwitch;
