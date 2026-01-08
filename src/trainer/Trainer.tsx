import {useEffect, useRef, useCallback, useReducer, useState} from "react";
import {MovementManager} from '$/movement-manager';
import type {DirectionInput} from '$/types';
import {NotationSequence} from '$/ui/NotationSequence';
import {classNames} from '$/utils/classNames';
import styles from './Trainer.module.css';

type TrainerState = {
  total: number;
  correct: number;
  currentIndex: number;
};

type TrainerStateStartAction = {
  type: 'start';
}

type TrainerStateMoveAction = {
  type: 'move';
  payload: {
    movesSequence: DirectionInput[];
    move: DirectionInput;
  };
};

type TrainerStateAction = TrainerStateStartAction | TrainerStateMoveAction;

const currentSequence: DirectionInput[] = ['b', 'n', 'b', 'db'];

const initialTrainerState: TrainerState = {
  total: 0,
  correct: 0,
  currentIndex: 0
};

export function Trainer() {
  const movementManagerRef = useRef(new MovementManager());
  const [state, dispatch] = useReducer(trainerStateReducer, initialTrainerState);
  const [movesSequence] = useState(currentSequence);

  const handleMoveChange = useCallback((move: DirectionInput) => {
    dispatch({
      type: 'move',
      payload: {
        move,
        movesSequence: movesSequence
      }
    })
  }, [movesSequence]);
  const handleMoveChangeRef = useRef(handleMoveChange);

  useEffect(() => {
    handleMoveChangeRef.current = handleMoveChange;
  }, [handleMoveChange]);

  useEffect(() => {
    const movementManager = movementManagerRef.current;
    const onMoveChange = handleMoveChangeRef.current;

    movementManager.init();
    movementManager.subscribeToMove(onMoveChange);

    return () => {
      movementManager.terminate();
      movementManager.unsubscribeFromMove(onMoveChange);
    }
  }, []);

  return (
    <div className={styles.container}>
      <NotationSequence sequence={movesSequence} currentCellIndex={state.currentIndex} />
      <StatsBlock correct={state.correct} total={state.total} />
    </div>
  );
}

function trainerStateReducer(prevState: TrainerState, action: TrainerStateAction): TrainerState {
  if (action.type === 'start') {
    return {
      currentIndex: 0,
      total: 0,
      correct: 0,
    }
  }

  const {currentIndex, correct, total } = prevState;
  const {move, movesSequence} = action.payload;


  if (currentIndex === undefined || move !== movesSequence[currentIndex]) {
    return {
      currentIndex: 0,
      total: total + 1,
      correct: correct,
    }
  }

  if (currentIndex < movesSequence.length - 1) {
    return {
      currentIndex: currentIndex + 1,
      total: total + 1,
      correct: correct + 1,
    };
  }

  return {
    currentIndex: 0,
    total: total + 1,
    correct: correct + 1,
  }
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
  )
}

function calcAccuracy(correct: number, total: number) {
  if (!total) {
    return 100;
  }

  return Math.trunc((total / correct) * 100);
}
