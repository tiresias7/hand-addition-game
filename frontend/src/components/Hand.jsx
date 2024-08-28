import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import PropTypes from 'prop-types';

const Hand = ({ hands, onCollide, isPlayer }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
            <h2 style={{ marginRight: '20px' }}>{isPlayer ? 'Player' : 'Bot'}</h2>
            {hands.map((hand) => {
                const [, drag] = useDrag(() => ({
                    type: 'number',
                    item: { id: hand.id },
                }));

                const [{ canDrop, isOver }, drop] = useDrop(() => ({
                    accept: 'number',
                    canDrop: (item) => {
                        if (isPlayer && item.id.startsWith('bot')) {
                            return true;
                        } else if (!isPlayer && item.id.startsWith('player')) {
                            return true;
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
                }));

                const ref = React.useRef(null);
                drag(drop(ref));

                return (
                    <div
                        key={hand.id}
                        ref={ref}
                        className="draggable-number"
                        style={{
                            cursor: isPlayer ? 'move' : 'default',
                            backgroundColor: canDrop && isOver ? 'green' : 'black',
                            padding: '10px',
                            margin: '0 10px',
                            border: canDrop ? '2px dashed green' : '2px solid red',
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
        value: PropTypes.number.isRequired
    })).isRequired,
    onCollide: PropTypes.func.isRequired,
    isPlayer: PropTypes.bool.isRequired,
};

export default Hand;
