import {useCallback, useEffect, useRef, useState} from 'react';
import {classNames} from '$/utils/classNames.ts';
import styles from './CountdownModal.module.css';

type CountdownModalProps = {
  onCountdownFinish: () => void;
  countdownSeconds: number;
  title: string;
  text: string;
  variant?: 'default' | 'error';
}

export function CountdownModal({
  onCountdownFinish,
  countdownSeconds,
  title,
  text,
  variant = 'default'
}: CountdownModalProps) {
  const [countdown, setCountDown] = useState(countdownSeconds);
  const timerIdRef = useRef(0);

  const timerCallback = useCallback(() => {
    if (countdown === 1) {
      setCountDown(0);
      onCountdownFinish();
    } else if (countdown > 1) {
      setCountDown(countdown - 1);
      timerIdRef.current = setTimeout(() => {
        timerCallbackRef.current();
      }, 1000);
    }
  }, [countdown, onCountdownFinish]);

  const timerCallbackRef = useRef(timerCallback);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    timerCallbackRef.current = timerCallback;
  }, [timerCallback]);

  useEffect(() => {
    timerIdRef.current = setTimeout(() => {
      timerCallbackRef.current();
    }, 1000);

    return () => {
      clearTimeout(timerIdRef.current);
    }
  }, [])

  return (
    <div className={classNames(styles.container, {
      [styles.container_default]: variant === 'default',
      [styles.container_error]: variant === 'error',
    })}>
      <h1 className={styles.title}>{title}</h1>
      <span>{text}</span>
      <div>{countdown}</div>
    </div>
  )
}
