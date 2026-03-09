import { Trainer } from './trainer';
import { SettingsMenu } from '$/settings-menu';
import { ControlsConfigurationContextProvider } from '$/controls/controls-configuration';

import './App.css';

function App() {
  return (
    <ControlsConfigurationContextProvider>
      <Trainer />
      <SettingsMenu />
    </ControlsConfigurationContextProvider>
  )
}

export default App
