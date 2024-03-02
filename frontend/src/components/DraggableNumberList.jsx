import React, { useRef, useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableNumber from './DraggableNumber';

const DraggableNumberList = () => {
    const [numbers, setNumbers] = useState([1, 1, 1, 1]);
    const refs = useRef(numbers.map(() => React.createRef()));
    const [interactions] = useState({ 0: [2, 3], 1: [2, 3], 2: [0, 1], 3: [0, 1] }); // Define interactions here

    const handleCollide = useCallback((id1, id2) => {
        if (id1 !== id2) {
            setNumbers((prev) => prev.map((num, idx) => {
                if (idx === id1) return (num + prev[id2]) % 10;
                return num;
            }));
        }
    }, []);

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                height: '100px',
                width: '100px'
            }}>
                {numbers.map((num, idx) => {
                    return <DraggableNumber ref={refs.current[idx]} key={idx} id={idx} number={num} onCollide={handleCollide} interactions={interactions[idx]} />;
                })}
            </div>
        </DndProvider>
    );
};

export default DraggableNumberList;