import { useState } from 'react';
import { Button } from '$/ui/Button';
import { Modal } from '$/ui/Modal';
import { GamepadMapper } from '$/gamepad-mapper';

import styles from './SettingsMenu.module.css';

export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {isOpen
        ? (
          <Modal>
            Settings
            <div className={styles.settingsMenuContainer}>
              <GamepadMapper />
            </div>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </Modal>
        )
        : (
          <Button className={styles.openSettingsButton} onClick={() => setIsOpen(true)}>
            Settings
          </Button>
        )
      }
    </>
  )
}
