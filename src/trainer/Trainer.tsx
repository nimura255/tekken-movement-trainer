import {useEffect, useRef, useCallback, useState, useMemo} from 'react';
import {ControlsManager} from '$/controls-manager';
import {MovementManager} from '$/movement-manager';
import type {AttackMoveInput} from '$/types';
import {NotationSequence} from '$/ui/NotationSequence';
import {NotationItemsList} from '$/ui/NotationItemsList';
import {CountdownModal} from '$/ui/CoundownModal';
import {StatsBlock} from './StatsBlock';
import {PlaybackButtons} from './PlaybackButtons';

import styles from './Trainer.module.css';

enum MovementSequenceKey {
  KbdLeft = 'kbd-l',
  KbdRight = 'kbd-r',
  WaveDashLeft = 'wavu-l',
  WaveDashRight = 'wavu-r',
  WgfLeft = 'wgf-l',
  EwgfLeft = 'ewgf-l',
}

const movementSequencesMap: Record<MovementSequenceKey, {move: AttackMoveInput[], strictLoop: boolean}> = {
  [MovementSequenceKey.KbdLeft]: {move: ['b', 'n', 'b', 'db'], strictLoop: true},
  [MovementSequenceKey.KbdRight]: {move: ['f', 'n', 'f', 'df'], strictLoop: true},
  [MovementSequenceKey.WaveDashLeft]: {move: ['f', 'n', 'd', 'df', 'f', 'n'], strictLoop: true},
  [MovementSequenceKey.WaveDashRight]: {move: ['b', 'n', 'd', 'db', 'b', 'n'], strictLoop: true},
  [MovementSequenceKey.WgfLeft]: {move: ['f', 'n', 'd', 'df', 'df2'], strictLoop: false},
  [MovementSequenceKey.EwgfLeft]: {move: ['f', 'n', 'd', 'df2'], strictLoop: false},
};

const movementSequencesMetas: Array<{key: MovementSequenceKey, title: string}> = [
  {key: MovementSequenceKey.KbdLeft, title: 'Korean Backdash (Left)'},
  {key: MovementSequenceKey.KbdRight, title: 'Korean Backdash (Right)'},
  {key: MovementSequenceKey.WaveDashLeft, title: 'Wavedash (Left)'},
  {key: MovementSequenceKey.WaveDashRight, title: 'Wavedash (Right)'},
  {key: MovementSequenceKey.WgfLeft, title: 'Wind God Fist (Left)'},
  {key: MovementSequenceKey.EwgfLeft, title: 'Electric Wind God Fist (Left)'}
];

export function Trainer() {
  const movementManagerRef = useRef(new MovementManager());
  const [moveIndex, setMoveIndex] = useState(0);
  const [correctSequencesCount, setCorrectSequencesCount] = useState(0);
  const [totalSequencesCount, setTotalSequencesCount] = useState(0);
  const [trainingSessionState, setTrainingSessionState] = useState<'idle' | 'paused' |  'running'>('idle')

  const [selectedSequenceKey, setSelectedSequenceKey] = useState(MovementSequenceKey.KbdLeft);
  const movesSequence = useMemo(() => movementSequencesMap[selectedSequenceKey], [selectedSequenceKey]);
  const [commandHistory, setCommandHistory] = useState<AttackMoveInput[]>([]);

  const [isWaitingForAllButtonUp, setIsWaitingForAllButtonUp] = useState(false);

  const movesSequenceToShow = useMemo(() => {
    const move = [...movesSequence.move];

    if (!movesSequence.strictLoop) {
      move.push('n');
    }

    return {
      move,
      strictLoop: movesSequence.strictLoop
    };
  }, [movesSequence]);

  const currentCellIndexToShow = useMemo(() => {
    if (trainingSessionState !== 'running') {
      return undefined;
    }

    if (isWaitingForAllButtonUp) {
      return movesSequenceToShow.move.length - 1;
    }

    return moveIndex;
  }, [trainingSessionState, moveIndex, movesSequenceToShow, isWaitingForAllButtonUp])

  const [animationData, setAnimationData] = useState<undefined | {
    key: 'start' | 'restart-after-mistake';
    callback: () => void;
  }>(undefined);

  const gamepads = useGamepadsList();

  const playAnimation = useCallback((key: 'start' | 'restart-after-mistake', callback: () => void) => {
    setAnimationData({
      key,
      callback: () => {
        setAnimationData(undefined);
        callback();
      }
    });
  }, []);

  const handleMoveChange = useCallback((move: AttackMoveInput) => {
    if (trainingSessionState !== 'running' || animationData) {
      return;
    }

    if (isWaitingForAllButtonUp) {
      if (move === 'n') {
        setIsWaitingForAllButtonUp(false);
      }

      return;
    }

    setCommandHistory(state => {
      const sliced = state.slice(-20);
      sliced.push(move);

      return sliced;
    });

    if (move !== movesSequence.move[moveIndex]) {
      setMoveIndex(0);
      setTotalSequencesCount(count => count + 1);

      playAnimation('restart-after-mistake', () => {
        setTrainingSessionState('running');
        setMoveIndex(0);
      })
    } else if (moveIndex < movesSequence.move.length - 1) {
      setMoveIndex(count => count + 1);
    } else {
      if (!movesSequence.strictLoop) {
        setIsWaitingForAllButtonUp(true);
      }

      setMoveIndex(0);
      setTotalSequencesCount(count => count + 1);
      setCorrectSequencesCount(count => count + 1)
    }
  }, [animationData, isWaitingForAllButtonUp, moveIndex, movesSequence.move, movesSequence.strictLoop, playAnimation, trainingSessionState]);

  const handleMoveChangeRef = useRef(handleMoveChange);
  useEffect(() => {
    handleMoveChangeRef.current = handleMoveChange;
  }, [handleMoveChange]);

  useEffect(() => {
    const movementManager = movementManagerRef.current;
    const controlsManager = new ControlsManager({movementManager});

    const onMoveChange = (move: AttackMoveInput) => {
      handleMoveChangeRef.current(move);
    };

    movementManager.init();
    controlsManager.init();
    movementManager.subscribeToMove(onMoveChange);

    return () => {
      movementManager.terminate();
      controlsManager.terminate()
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
        alignCells="center"
        sequence={movesSequenceToShow.move}
        currentCellIndex={currentCellIndexToShow}
      />
      <StatsBlock correct={correctSequencesCount} total={totalSequencesCount} />

      <div className={styles.playbackButtonsList}>
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
            setCorrectSequencesCount(0);
            setTotalSequencesCount(0);
            setCommandHistory([]);
            setTrainingSessionState('running');
          }}
          onStop={() => {
            setMoveIndex(0);
            setCorrectSequencesCount(0);
            setTotalSequencesCount(0);
            setCommandHistory([]);
            setTrainingSessionState('idle');
          }}
        />
      </div>

      <NotationItemsList className={styles.commandsList} items={commandHistory} />

      {gamepads.length ? (
        <div className={styles.controllersSection}>
          <span>Controllers</span>
          <div className={styles.controllersLists}>
            {gamepads.map(gamepad => (
              <div key={`#${gamepad.index}-${gamepad.id}`} className={styles.controllersListItem}>{gamepad.id}</div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function useGamepadsList() {
  const [controllers, setControllers] = useState<Gamepad[]>([]);

  useEffect(() => {
    const handleGamepadChangeEvent = () => {
      setControllers(navigator.getGamepads().filter<Gamepad>(gamepad => gamepad !== null));
    };

    window.addEventListener('gamepadconnected', handleGamepadChangeEvent);
    window.addEventListener('gamepaddisconnected', handleGamepadChangeEvent);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadChangeEvent);
      window.removeEventListener('gamepaddisconnected', handleGamepadChangeEvent);
    }
  }, []);

  return controllers;
}
