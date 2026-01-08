import {useEffect, useState} from "react";

export function GamepadsList() {
  const [gamepadsMap, setGamepadsMap] = useState<Record<string, Gamepad>>({});

  useEffect(() => {
    const onGamePadConnect = (event: GamepadEvent) => {
      console.log(event);

      setGamepadsMap(state => ({...state, [event.gamepad.id]: event.gamepad}))
    };

    window.addEventListener('gamepadconnected', onGamePadConnect);

    return () => {
      window.removeEventListener('gamepadconnected', onGamePadConnect);
    }
  }, []);

  return <div>{Object.keys(gamepadsMap)}</div>
}
