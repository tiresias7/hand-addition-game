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
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);

    const playerHandsRef = useRef(playerHands);
    const botHandsRef = useRef(botHands);

    useEffect(() => {
        playerHandsRef.current = playerHands;
    }, [playerHands]);

    useEffect(() => {
        botHandsRef.current = botHands;
    }, [botHands]);

    const checkGameOver = useCallback(() => {
        const playerActive = playerHandsRef.current.some(hand => hand.isActive);
        const botActive = botHandsRef.current.some(hand => hand.isActive);

        if (!playerActive) {
            setGameOver(true);
            setWinner('Player');
        } else if (!botActive) {
            setGameOver(true);
            setWinner('Bot');
        }
    }, []);

    const handlePlayerCollide = useCallback((playerId, botId) => {
        setPlayerHands(prevPlayerHands => {
            const botHand = botHandsRef.current.find(botHand => botHand.id === botId);
            const newPlayerHands = prevPlayerHands.map(hand => {
                if (hand.id === playerId) {
                    const newValue = (hand.value + botHand.value) % 10;
                    return { ...hand, value: newValue, isActive: newValue !== 0 };
                }
                return hand;
            });
            return newPlayerHands;
        });

        setBotMoving(true);
        setTimeout(() => {
            handleBotMove();
            checkGameOver();
        }, 1000);
    }, [checkGameOver]);

    const handleBotMove = useCallback(() => {
        setBotHands(prevBotHands => {
            const botId = prevBotHands.findIndex(hand => hand.isActive && hand.value > 0);
            const playerHand = playerHandsRef.current.find(hand => hand.isActive && hand.value > 0);
            if (botId !== -1 && playerHand) {
                const newBotHands = prevBotHands.map((hand, index) => {
                    if (index === botId) {
                        const newValue = (hand.value + playerHand.value) % 10;
                        return { ...hand, value: newValue, isActive: newValue !== 0 };
                    }
                    return hand;
                });
                return newBotHands;
            }
            return prevBotHands;
        });
        setBotMoving(false);
        checkGameOver();
    }, [checkGameOver]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
            <h1>Player vs Bot Game</h1>
            <div style={{ height: '50px', marginTop: '20px' }}> {/* Set a fixed height to avoid layout shift */}
                <p style={{ visibility: botMoving ? 'visible' : 'hidden' }}>Bot is thinking...</p>
            </div>
            {gameOver ? (
                <div style={{ marginTop: '20px' }}>
                    <h2>Game Over</h2>
                    <p>{winner} wins!</p>
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
};

export default GameBoard;
