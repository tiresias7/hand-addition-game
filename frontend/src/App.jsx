import DraggableNumberList from './components/DraggableNumberList';
import GameBoard from './components/GameBoard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <GameBoard />
      </div>
    </DndProvider>
  );
}

export default App;