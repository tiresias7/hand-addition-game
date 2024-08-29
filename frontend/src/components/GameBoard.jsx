import React, { useState, useCallback, useRef, useEffect } from 'react';
import Hand from './Hand';
import { EasyBotStrategy } from './strategy/EasyBotStrategy';
import { DebugBotStrategy } from './strategy/DebugBotStrategy';
// import { MediumBotStrategy } from './strategy/MediumBotStrategy';
// import { HardBotStrategy } from './strategy/HardBotStrategy';
import { ImpossibleBotStrategy } from './strategy/ImpossibleBotStrategy';

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
    const [botDifficulty, setBotDifficulty] = useState('impossible'); // Add difficulty level

    const playerHandsRef = useRef(playerHands);
    const botHandsRef = useRef(botHands);

    const botStrategy = useRef(new ImpossibleBotStrategy());

    useEffect(() => {
        playerHandsRef.current = playerHands;
    }, [playerHands]);

    useEffect(() => {
        botHandsRef.current = botHands;
    }, [botHands]);

    // useEffect(() => {
    //     // Change bot strategy based on difficulty level
    //     switch (botDifficulty) {
    //         // case 'medium':
    //         //     botStrategy.current = new MediumBotStrategy();
    //         //     break;
    //         // case 'hard':
    //         //     botStrategy.current = new HardBotStrategy();
    //         //     break;
    //         case 'impossible':
    //             botStrategy.current = new ImpossibleBotStrategy();
    //         default:
    //             botStrategy.current = new DebugBotStrategy();
    //     }
    // }, [botDifficulty]);

    useEffect(() => {
        checkGameOver(); // Call checkGameOver after any change in playerHands or botHands
    }, [playerHands, botHands]);

    const checkGameOver = useCallback(() => {
        const playerActive = playerHands.some(hand => hand.isActive);
        const botActive = botHands.some(hand => hand.isActive);

        if (!playerActive) {
            setGameOver(true);
            setWinner('Player');
        } else if (!botActive) {
            setGameOver(true);
            setWinner('Bot');
        }
    }, [playerHands, botHands]);

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
        }, 1000);
    }, [checkGameOver]);

    const handleBotMove = useCallback(() => {
        const { botHandId, playerHandId } = botStrategy.current.makeMove(botHandsRef.current, playerHandsRef.current);

        setBotHands(prevBotHands => {
            const newBotHands = prevBotHands.map(hand => {
                if (hand.id === botHandId) {
                    const playerHand = playerHandsRef.current.find(hand => hand.id === playerHandId);
                    const newValue = (hand.value + playerHand.value) % 10;
                    return { ...hand, value: newValue, isActive: newValue !== 0 };
                }
                return hand;
            });
            return newBotHands;
        });

        setBotMoving(false);
        checkGameOver();
    }, [checkGameOver]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
            <h1>Hand Addition Game</h1>
            {/* <div>
                <label>Choose Bot Difficulty: </label>
                <select value={botDifficulty} onChange={(e) => setBotDifficulty(e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div> */}
            {gameOver ? (
                <div style={{ marginTop: '20px' }}>
                    <h2>Game Over</h2>
                    <p>{winner} wins!</p>
                </div>
            ) : (
                <>
                    <div style={{ height: '50px', marginTop: '20px' }}>
                        <p style={{ visibility: botMoving ? 'visible' : 'hidden' }}>Bot is thinking...</p>
                    </div>
                    <Hand
                        hands={botHands}
                        onCollide={handlePlayerCollide}
                        isPlayer={false}
                        isDisabled={botMoving}
                    />
                    <Hand
                        hands={playerHands}
                        onCollide={handlePlayerCollide}
                        isPlayer={true}
                        isDisabled={botMoving}
                    />
                </>
            )}
        </div>
    );
};

export default GameBoard;
