// EasyBotStrategy.js
import { BotStrategy } from './BotStrategy';

export class EasyBotStrategy extends BotStrategy {
    makeMove(botHands, playerHands) {
        const activeBotHands = botHands.filter(hand => hand.isActive);
        const activePlayerHands = playerHands.filter(hand => hand.isActive);
        const randomBotHand = activeBotHands[Math.floor(Math.random() * activeBotHands.length)];
        const randomPlayerHand = activePlayerHands[Math.floor(Math.random() * activePlayerHands.length)];
        return { botHandId: randomBotHand.id, playerHandId: randomPlayerHand.id };
    }
}