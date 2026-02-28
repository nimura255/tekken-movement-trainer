import { Button } from '$/ui/Button';

type PlaybackButtonsProps = {
  trainerState: 'idle' | 'paused' | 'running';
  onStart: () => void;
  onResume: () => void;
  onPause: () => void;
  onReset: () => void;
  onStop: () => void;
}

export function PlaybackButtons({
  trainerState,
  onPause,
  onReset,
  onStop,
  onResume,
  onStart
}: PlaybackButtonsProps) {
  return (
    <>
      {trainerState === 'idle' && (
        <Button onClick={onStart}>
          START
        </Button>
      )}

      {trainerState === 'paused' && (
        <Button onClick={onResume}>
          RESUME
        </Button>
      )}

      {trainerState === 'running' && (
        <Button onClick={onPause}>
          PAUSE
        </Button>
      )}

      {trainerState !== 'idle' && (
        <>
          <Button onClick={onReset}>
            RESET
          </Button>

          <Button onClick={onStop}>
            STOP
          </Button>
        </>
      )}
    </>
  )
}
