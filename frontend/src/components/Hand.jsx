import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

const Hand = ({ hands, onCollide, isPlayer, isDisabled }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
            <h2 style={{ marginRight: '20px' }}>{isPlayer ? 'You' : 'Bot'}</h2>
            {hands.map((hand) => {
                const [, drag] = useDrag(() => ({
                    type: 'number',
                    item: { id: hand.id },
                    canDrag: () => hand.isActive && !isDisabled && isPlayer, // Disable dragging if isDisabled is true
                }), [hand.isActive, isDisabled]);

                const [{ canDrop, isOver }, drop] = useDrop(() => ({
                    accept: 'number',
                    canDrop: (item) => {
                        if (isDisabled) return false; // Disable drop if isDisabled is true
                        if (hand.isActive) {
                            if (isPlayer && item.id.startsWith('bot')) {
                                return true;
                            } else if (!isPlayer && item.id.startsWith('player')) {
                                return true;
                            }
                        }
                        return false;
                    },
                    drop: (item) => {
                        if (isPlayer && item.id.startsWith('bot')) {
                            onCollide(hand.id, item.id);
                        } else if (!isPlayer && item.id.startsWith('player')) {
                            onCollide(item.id, hand.id);
                        }
                    },
                    collect: (monitor) => ({
                        canDrop: monitor.canDrop(),
                        isOver: monitor.isOver(),
                    }),
                }), [hand.isActive, isDisabled]);

                const ref = useRef(null);
                drag(drop(ref));

                return (
                    <div
                        key={hand.id}
                        ref={ref}
                        className="draggable-number"
                        style={{
                            cursor: hand.isActive && !isDisabled ? (isPlayer ? 'move' : 'default') : 'not-allowed',
                            backgroundColor: canDrop && isOver ? 'green' : 'gray',
                            padding: '10px',
                            margin: '0 10px',
                            border: canDrop ? '2px dashed green' : '2px solid red',
                            opacity: hand.isActive ? 1 : 0.5,  // Dim inactive hands
                        }}
                    >
                        {hand.value}
                    </div>
                );
            })}
        </div>
    );
};

Hand.propTypes = {
    hands: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        isActive: PropTypes.bool.isRequired
    })).isRequired,
    onCollide: PropTypes.func.isRequired,
    isPlayer: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool.isRequired, // Add isDisabled prop type
};

export default Hand;
