import GameBoard from './components/GameBoard';
import { DndProvider } from 'react-dnd';
import { MultiBackend } from 'react-dnd-multi-backend';
import { HTML5toTouch } from 'rdndmb-html5-to-touch';


function App() {
  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="App">
        <GameBoard />
      </div>
    </DndProvider>
  );
}

export default App;