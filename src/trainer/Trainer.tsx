import {useEffect, useRef, useCallback, useState} from "react";
import {MovementManager} from '$/movement-manager';
import type {DirectionInput} from '$/types';
import {NotationSequence} from '$/ui/NotationSequence';
import {classNames} from '$/utils/classNames';
import styles from './Trainer.module.css';

const currentSequence: DirectionInput[] = ['b', 'n', 'b', 'db'];

export function Trainer() {
  const movementManagerRef = useRef(new MovementManager());
  const [movesSequence] = useState(currentSequence);
  const [moveIndex, setMoveIndex] = useState(0);
  const [correctMoves, setCorrectMoves] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [trainingSessionState, setTrainingSessionState] = useState<'idle' | 'paused' |  'running'>('idle')

  const [animationData, setAnimationData] = useState<undefined | {
    key: 'start' | 'restart-after-mistake';
    callback: () => void;
  }>(undefined);

  const playAnimation = useCallback((key: 'start' | 'restart-after-mistake', callback: () => void) => {
    setAnimationData({
      key,
      callback: () => {
        setAnimationData(undefined);
        callback();
      }
    });
  }, []);

  const handleMoveChange = useCallback((move: DirectionInput) => {
    if (trainingSessionState !== 'running' || animationData) {
      return;
    }

    setTotalMoves(count => count + 1);

    if (move !== movesSequence[moveIndex]) {
      setMoveIndex(0);

      playAnimation('restart-after-mistake', () => {
        setTrainingSessionState('running');
        setMoveIndex(0);
      })
      return;
    }

    setCorrectMoves(count => count + 1);

    if (moveIndex < movesSequence.length - 1) {
      setMoveIndex(count => count + 1);
    } else {
      setMoveIndex(0);
    }
  }, [animationData, moveIndex, movesSequence, playAnimation, trainingSessionState]);

  const handleMoveChangeRef = useRef(handleMoveChange);
  useEffect(() => {
    handleMoveChangeRef.current = handleMoveChange;
  }, [handleMoveChange]);

  useEffect(() => {
    const movementManager = movementManagerRef.current;
    const onMoveChange = (move: DirectionInput) => {
      handleMoveChangeRef.current(move);
    };

    movementManager.init();
    movementManager.subscribeToMove(onMoveChange);

    return () => {
      movementManager.terminate();
      movementManager.unsubscribeFromMove(onMoveChange);
    }
  }, []);

  return (
    <div className={styles.container}>
      <NotationSequence sequence={movesSequence} currentCellIndex={moveIndex} />
      <StatsBlock correct={correctMoves} total={totalMoves} />

      <div style={{display: 'flex', gap: '10px'}}>
        {animationData?.key === 'restart-after-mistake' && (
          <ErrorAnimationBanner onFinish={animationData.callback} />
        )}

        {trainingSessionState === 'idle' && (
          <button onClick={() => {
            setMoveIndex(0);
            setTrainingSessionState('running');
          }}>
            START
          </button>
        )}

        {trainingSessionState === 'paused' && (
          <button onClick={() => setTrainingSessionState('running')}>
            RESUME
          </button>
        )}

        {trainingSessionState === 'running' && (
          <button onClick={() => setTrainingSessionState('idle')}>
            PAUSE
          </button>
        )}

        {trainingSessionState !== 'idle' && (
          <>
            <button onClick={() => {
              setMoveIndex(0);
              setCorrectMoves(0);
              setTotalMoves(0);
              setTrainingSessionState('running');
            }}>
              RESTART
            </button>

            <button onClick={() => {
              setMoveIndex(0);
              setCorrectMoves(0);
              setTotalMoves(0);
              setTrainingSessionState('idle');
            }}>
              STOP
            </button>
          </>
        )}
      </div>
    </div>
  );
}

type StatsBlockProps = {
  total: number;
  correct: number;
}

function StatsBlock({correct, total}: StatsBlockProps) {
  const accuracy = calcAccuracy(correct, total);

  return (
    <div className={styles.statsContainer}>
      <div className={classNames(styles.statItem, styles.accuracyStatItem)}>
        <span className={styles.statItemLabel}>Accuracy</span>
        <span>{accuracy}%</span>
        <div className={styles.bar} />
      </div>
      <div className={styles.statItem}>
        <span className={styles.statItemLabel}>Total</span>
        <span>{total}</span>
      </div>
      <div className={styles.statItem}>
        <span className={styles.statItemLabel}>Correct</span>
        <span>{correct}</span>
      </div>
    </div>
  );
}

function calcAccuracy(correct: number, total: number) {
  if (!total) {
    return 100;
  }

  return Math.trunc((correct / total) * 100);
}

function ErrorAnimationBanner({ onFinish }: {onFinish: () => void}) {
  const [countdown, setCountDown] = useState(3);
  const timerIdRef = useRef(0);

  const timerCallback = useCallback(() => {
    if (countdown === 1) {
      setCountDown(0);
      onFinish();
    } else if (countdown > 1) {
      setCountDown(countdown - 1);
      timerIdRef.current = setTimeout(() => {
        timerCallbackRef.current();
      }, 1000);
    }
  }, [countdown, onFinish]);

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
    <div>
      <div>Restart in</div>
      <div>{countdown}</div>
    </div>
  )
}

/*

press start
  |
countdown animation
  |
run training
  |
 ...
  |
make a mistake
  |
error animation, countdown
  |
run training

 */
