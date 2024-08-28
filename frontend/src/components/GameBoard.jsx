import React, { useState, useCallback, useRef, useEffect } from 'react';
import Hand from './Hand';

const GameBoard = () => {
    const [playerHands, setPlayerHands] = useState([
        { id: 'player-hand-1', value: 1, isActive: true },
        { id: 'player-hand-2', value: 1, isActive: true }
    ]);

    const [botHands, setBotHands] = useState([
        { id: 'bot-hand-1', value: 1, isActive: true },
        { id: 'bot-hand-2', value: 1, isActive: true }
    ]);

    const [botMoving, setBotMoving] = useState(false);

    const playerHandsRef = useRef(playerHands);
    const botHandsRef = useRef(botHands);

    useEffect(() => {
        playerHandsRef.current = playerHands;
    }, [playerHands]);

    useEffect(() => {
        botHandsRef.current = botHands;
    }, [botHands]);

    const handlePlayerCollide = useCallback((playerId, botId) => {
        setPlayerHands(prevPlayerHands => {
            const botHand = botHandsRef.current.find(botHand => botHand.id === botId);
            const newPlayerHands = prevPlayerHands.map(hand => {
                if (hand.id === playerId) {
                    const newValue = (hand.value + botHand.value) % 10;
                    console.log(`Updating player hand ${hand.id} from ${hand.value} to ${newValue}`);
                    return { ...hand, value: newValue, isActive: newValue !== 0 };
                }
                return hand;
            });
            return newPlayerHands;
        });

        setBotMoving(true);
        setTimeout(handleBotMove, 1000);
    }, []);

    const handleBotMove = useCallback(() => {
        setBotHands(prevBotHands => {
            const botId = prevBotHands.findIndex(hand => hand.isActive && hand.value > 0);
            const playerHand = playerHandsRef.current.find(hand => hand.isActive && hand.value > 0);
            if (botId !== -1 && playerHand) {
                const newBotHands = prevBotHands.map((hand, index) => {
                    if (index === botId) {
                        const newValue = (hand.value + playerHand.value) % 10;
                        console.log(`Updating bot hand ${hand.id} from ${hand.value} to ${newValue}`);
                        return { ...hand, value: newValue, isActive: newValue !== 0 };
                    }
                    return hand;
                });
                return newBotHands;
            }
            return prevBotHands;
        });
        setBotMoving(false);
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
            <h1>Player vs Bot Game</h1>
            <Hand
                hands={botHands}
                onCollide={handlePlayerCollide}
                isPlayer={false}
            />
            <Hand
                hands={playerHands}
                onCollide={handlePlayerCollide}
                isPlayer={true}
            />
            {botMoving && <p>Bot is thinking...</p>}
        </div>
    );
};

export default GameBoard;
