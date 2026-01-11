import {useEffect, useRef, useCallback, useState} from "react";
import {MovementManager} from '$/movement-manager';
import type {DirectionInput} from '$/types';
import {NotationSequence} from '$/ui/NotationSequence';
import {CountdownModal} from '$/ui/CoundownModal';
import {StatsBlock} from './StatsBlock';
import styles from './Trainer.module.css';
import {PlaybackButtons} from './PlaybackButtons.tsx';

enum MovementSequenceKey {
  KbdLeft = 'kbd-l',
  KbdRight = 'kbd-r',
  WaveDashLeft = 'wavu-l',
  WaveDashRight = 'wavu-r',
}

const movementSequencesMap: Record<MovementSequenceKey, DirectionInput[]> = {
  [MovementSequenceKey.KbdLeft]: ['b', 'n', 'b', 'db'],
  [MovementSequenceKey.KbdRight]: ['f', 'n', 'f', 'df'],
  [MovementSequenceKey.WaveDashLeft]: ['f', 'n', 'd', 'df', 'f', 'n'],
  [MovementSequenceKey.WaveDashRight]: ['b', 'n', 'd', 'db', 'b', 'n']
};

const movementSequencesMetas: Array<{key: MovementSequenceKey, title: string}> = [
  {key: MovementSequenceKey.KbdLeft, title: 'Korean Backdash (Left)'},
  {key: MovementSequenceKey.KbdRight, title: 'Korean Backdash (Right)'},
  {key: MovementSequenceKey.WaveDashLeft, title: 'Wavedash (Left)'},
  {key: MovementSequenceKey.WaveDashRight, title: 'Wavedash (Right)'},
];

export function Trainer() {
  const movementManagerRef = useRef(new MovementManager());
  const [moveIndex, setMoveIndex] = useState(0);
  const [correctMoves, setCorrectMoves] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [trainingSessionState, setTrainingSessionState] = useState<'idle' | 'paused' |  'running'>('idle')

  const [selectedSequenceKey, setSelectedSequenceKey] = useState(MovementSequenceKey.KbdLeft);
  const movesSequence = movementSequencesMap[selectedSequenceKey];

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
      <select
        value={selectedSequenceKey}
        onChange={event => setSelectedSequenceKey(event.target.value as MovementSequenceKey)}
      >
        {movementSequencesMetas.map(({key, title}) => (
          <option key={key} value={key}>{title}</option>
        ))}
      </select>

      <NotationSequence
        sequence={movesSequence}
        currentCellIndex={trainingSessionState === 'running' ? moveIndex : undefined}
      />
      <StatsBlock correct={correctMoves} total={totalMoves} />

      <div style={{display: 'flex', gap: '10px'}}>
        {animationData?.key === 'restart-after-mistake' && (
          <CountdownModal
            onCountdownFinish={animationData.callback}
            countdownSeconds={3}
            text="Restart in"
            title="Wrong input"
            variant="error"
          />
        )}

        <PlaybackButtons
          trainerState={trainingSessionState}
          onStart={() => {
            setMoveIndex(0);
            setTrainingSessionState('running');
          }}
          onResume={() => setTrainingSessionState('running')}
          onPause={() => setTrainingSessionState('idle')}
          onReset={() => {
            setMoveIndex(0);
            setCorrectMoves(0);
            setTotalMoves(0);
            setTrainingSessionState('running');
          }}
          onStop={() => {
            setMoveIndex(0);
            setCorrectMoves(0);
            setTotalMoves(0);
            setTrainingSessionState('idle');
          }}
        />
      </div>
    </div>
  );
}
