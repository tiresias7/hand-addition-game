import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';


const DraggableNumber = React.forwardRef(({ id, number, onCollide, interactions }, ref) => {
    const [, drag] = useDrag(() => ({
        type: 'number',
        item: { id },
    }));

    const [, drop] = useDrop(() => ({
        accept: 'number',
        drop: (item) => {
            if (item.id !== id && interactions.includes(item.id)) {
                onCollide(item.id, id);
            }
        },
        canDrop: (item) => {
            return interactions.includes(item.id);
        },
    }));

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{
                cursor: 'move',
                backgroundColor: 'lightgray',
                padding: '10px',
                margin: '5px',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {number}
        </div>
    );
});

DraggableNumber.displayName = 'DraggableNumber';
DraggableNumber.propTypes = {
    id: PropTypes.number.isRequired,
    number: PropTypes.number.isRequired,
    onCollide: PropTypes.func.isRequired,
    interactions: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default DraggableNumber;