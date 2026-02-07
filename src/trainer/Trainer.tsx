import {useEffect, useRef, useCallback, useState} from 'react';
import {ControlsManager} from '$/controls-manager';
import {MovementManager} from '$/movement-manager';
import type {DirectionInput} from '$/types';
import {NotationSequence} from '$/ui/NotationSequence';
import {CountdownModal} from '$/ui/CoundownModal';
import {StatsBlock} from './StatsBlock';
import {PlaybackButtons} from './PlaybackButtons';

import styles from './Trainer.module.css';

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
  const [correctSequencesCount, setCorrectSequencesCount] = useState(0);
  const [totalSequencesCount, setTotalSequencesCount] = useState(0);
  const [trainingSessionState, setTrainingSessionState] = useState<'idle' | 'paused' |  'running'>('idle')

  const [selectedSequenceKey, setSelectedSequenceKey] = useState(MovementSequenceKey.KbdLeft);
  const movesSequence = movementSequencesMap[selectedSequenceKey];

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

  const handleMoveChange = useCallback((move: DirectionInput) => {
    if (trainingSessionState !== 'running' || animationData) {
      return;
    }

    if (move !== movesSequence[moveIndex]) {
      setMoveIndex(0);
      setTotalSequencesCount(count => count + 1);

      playAnimation('restart-after-mistake', () => {
        setTrainingSessionState('running');
        setMoveIndex(0);
      })
    } else if (moveIndex < movesSequence.length - 1) {
      setMoveIndex(count => count + 1);
    } else {
      setMoveIndex(0);
      setTotalSequencesCount(count => count + 1);
      setCorrectSequencesCount(count => count + 1)
    }
  }, [animationData, moveIndex, movesSequence, playAnimation, trainingSessionState]);

  const handleMoveChangeRef = useRef(handleMoveChange);
  useEffect(() => {
    handleMoveChangeRef.current = handleMoveChange;
  }, [handleMoveChange]);

  useEffect(() => {
    const movementManager = movementManagerRef.current;
    const controlsManager = new ControlsManager({movementManager});

    const onMoveChange = (move: DirectionInput) => {
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
        sequence={movesSequence}
        currentCellIndex={trainingSessionState === 'running' ? moveIndex : undefined}
      />
      <StatsBlock correct={correctSequencesCount} total={totalSequencesCount} />

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
            setCorrectSequencesCount(0);
            setTotalSequencesCount(0);
            setTrainingSessionState('running');
          }}
          onStop={() => {
            setMoveIndex(0);
            setCorrectSequencesCount(0);
            setTotalSequencesCount(0);
            setTrainingSessionState('idle');
          }}
        />
      </div>

      {gamepads.length ? (
        <div style={{maxWidth: '309px'}}>
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
