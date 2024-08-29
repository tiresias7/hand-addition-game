export class BotStrategy {
    // This method should be implemented by all subclasses to make a move
    makeMove(botHands, playerHands) {
        throw new Error("This method should be overridden by subclasses");
    }

    // Optional method to evaluate moves, which can be reused or overridden by subclasses
    evaluateMove(potentialValue, playerHands, botHands) {
        // Default evaluation logic
        if (potentialValue === 0) return -1; // Avoid 0 unless necessary
        return potentialValue;
    }
}
