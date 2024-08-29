import { BotStrategy } from './BotStrategy';

export class DebugBotStrategy extends BotStrategy {
    makeMove(botHands, playerHands) {
        const botHand = botHands.find(hand => hand.isActive);
        const playerHand = playerHands.find(hand => hand.isActive);

        // Return the first available bot hand and player hand
        return { botHandId: botHand.id, playerHandId: playerHand.id };
    }
}
