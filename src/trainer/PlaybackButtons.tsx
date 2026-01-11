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
        <button onClick={onStart}>
          START
        </button>
      )}

      {trainerState === 'paused' && (
        <button onClick={onResume}>
          RESUME
        </button>
      )}

      {trainerState === 'running' && (
        <button onClick={onPause}>
          PAUSE
        </button>
      )}

      {trainerState !== 'idle' && (
        <>
          <button onClick={onReset}>
            RESET
          </button>

          <button onClick={onStop}>
            STOP
          </button>
        </>
      )}
    </>
  )
}
