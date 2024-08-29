import { BotStrategy } from "./BotStrategy";

class State {
    constructor(playerNum, opponentNum) {
        this.playerNum = [...playerNum].sort((a, b) => a - b);
        this.opponentNum = [...opponentNum].sort((a, b) => a - b);
    }

    getNextStates() {
        const playerNum = [...this.playerNum];
        const opponentNum = [...this.opponentNum];
        const nextStates = [];

        for (let p of playerNum) {
            for (let o of opponentNum) {
                const nextPlayerNum = [...opponentNum];
                const nextOpponentNum = [...playerNum];
                const n = (p + o) % 10;
                nextOpponentNum.splice(nextOpponentNum.indexOf(p), 1);
                if (n !== 0) {
                    nextOpponentNum.push(n);
                }
                const newState = new State(nextPlayerNum, nextOpponentNum);
                // 检查 newState 是否已存在于 nextStates 中
                let exists = false;
                for (let state of nextStates) {
                    if (newState.equals(state)) {
                        exists = true;
                        break;
                    }
                }

                // 如果不存在，则添加到 nextStates
                if (!exists) {
                    nextStates.push(newState);
                }
            }
        }

        return nextStates;
    }

    getNumCount() {
        return this.playerNum.length + this.opponentNum.length;
    }

    equals(other) {
        return (
            JSON.stringify(this.playerNum) === JSON.stringify(other.playerNum) &&
            JSON.stringify(this.opponentNum) === JSON.stringify(other.opponentNum)
        );
    }

    toString() {
        return `State([${this.playerNum}], [${this.opponentNum}])`;
    }
}

// function testStateClass() {
//     const state = new State([1, 1], [1, 1]);
//     console.log(state.toString()); // 应该输出 "State(1,1, 1,1)"
//     const nextStates = state.getNextStates();
//     nextStates.forEach(nextState => {
//         console.log(nextState.toString()); // 应该输出每个 nextState 的字符串表示形式
//     });
// }

// testStateClass();

function classifyStates() {
    const INITIAL_STATE = new State([1, 1], [1, 1]);
    const reachableStates = new Map();
    const stringToState = new Map();
    const bfsQueue = [INITIAL_STATE];
    reachableStates.set(INITIAL_STATE.toString(), 0); // Use the string representation of the state as the key
    stringToState.set(INITIAL_STATE.toString(), INITIAL_STATE);

    // Perform BFS to find all reachable states
    while (bfsQueue.length) {
        const state = bfsQueue.shift();
        for (let nextState of state.getNextStates()) {
            const nextStateString = nextState.toString();
            if (!reachableStates.has(nextStateString)) {
                reachableStates.set(nextStateString, reachableStates.get(state.toString()) + 1);
                stringToState.set(nextStateString, nextState);
                bfsQueue.push(nextState);
            }
        }
    }

    // console.log("Total reachable states:", reachableStates.size);

    // Construct the graph of states
    const inEdges = new Map();
    const outEdges = new Map();
    const determinedStates = new Map();

    reachableStates.forEach((_, stateString) => {
        inEdges.set(stateString, []);
        outEdges.set(stateString, []);
    });

    reachableStates.forEach((_, stateString) => {
        const state = stringToState.get(stateString);
        for (let nextState of state.getNextStates()) {
            const nextStateString = nextState.toString();
            inEdges.get(nextStateString).push(stateString);
            outEdges.get(stateString).push(nextStateString);
        }
    });

    // Determine the winning and losing states
    const queue = [];
    reachableStates.forEach((_, stateString) => {
        const state = stringToState.get(stateString);
        if (state.opponentNum.length === 0) {
            determinedStates.set(stateString, false); // Losing state
            queue.push(stateString);
        }
    });

    while (queue.length) {
        const curStateString = queue.shift();
        for (let prevStateString of inEdges.get(curStateString)) {
            if (determinedStates.has(prevStateString)) continue;

            if (!determinedStates.get(curStateString)) {
                determinedStates.set(prevStateString, true); // Winning state
                queue.push(prevStateString);
            } else {
                let allNextStatesWinning = true;
                for (let nextStateString of outEdges.get(prevStateString)) {
                    if (!determinedStates.has(nextStateString) || !determinedStates.get(nextStateString)) {
                        allNextStatesWinning = false;
                        break;
                    }
                }
                if (allNextStatesWinning) {
                    determinedStates.set(prevStateString, false); // Losing state
                    queue.push(prevStateString);
                }
            }
        }
    }

    // console.log("Total determined states:", determinedStates.size);

    // Determine the tricky states
    const trickyStates = new Map();

    determinedStates.forEach((_, stateString) => {
        for (let prevStateString of inEdges.get(stateString)) {
            if (!determinedStates.has(prevStateString)) {
                trickyStates.set(prevStateString, true); // tricky states are undetermined, but can lead to a winning state
            }
        }
    });

    // console.log("Total tricky states:", trickyStates.size);

    return { reachableStates, determinedStates, trickyStates };
}

function getStateWithHands(botHands, playerHands) {
    const botNums = botHands.map(hand => hand.value).filter(num => num !== 0);
    const playerNums = playerHands.map(hand => hand.value).filter(num => num !== 0);
    return new State(botNums, playerNums);
}

export class ImpossibleBotStrategy extends BotStrategy {
    static cachedStates = null; // Cache the states to avoid recomputing them

    constructor() {
        super(); // Call the parent class constructor

        if (!ImpossibleBotStrategy.cachedStates) {
            // console.log("Classifying states...");
            ImpossibleBotStrategy.cachedStates = classifyStates();
        }

        const { reachableStates, determinedStates, trickyStates } = ImpossibleBotStrategy.cachedStates;
        this.reachableStates = reachableStates;
        this.determinedStates = determinedStates;
        this.trickyStates = trickyStates;
    }

    getBestNextState(currentState) {
        const possibleMoves = currentState.getNextStates();

        // Look for a losing state in the possible moves
        for (let nextState of possibleMoves) {
            const nextStateString = nextState.toString();
            if (this.determinedStates.get(nextStateString) === false) {
                // console.log("Found losing state:", nextState.toString());
                return nextState;
            }
        }

        // If no losing state is found, choose a tricky state randomly
        const trickyMoves = [];
        for (let nextState of possibleMoves) {
            const nextStateString = nextState.toString();
            if (this.trickyStates.has(nextStateString)) {
                trickyMoves.push(nextState);
            }
        }
        if (trickyMoves.length > 0) {
            // console.log("Found tricky state:", trickyMoves[0].toString());
            return trickyMoves[Math.floor(Math.random() * trickyMoves.length)];
        }

        // If no tricky state is found, choose an undetermined state randomly
        const undeterminedMoves = [];
        for (let nextState of possibleMoves) {
            const nextStateString = nextState.toString();
            if (!this.determinedStates.has(nextStateString)) {
                undeterminedMoves.push(nextState);
            }
        }
        if (undeterminedMoves.length > 0) {
            // console.log("Found undetermined state:", undeterminedMoves[0].toString());
            return undeterminedMoves[Math.floor(Math.random() * undeterminedMoves.length)];
        }

        // If no undetermined state is found, choose a random state
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    makeMove(botHands, playerHands) {
        // console.log("Making move...");
        const currentState = getStateWithHands(botHands, playerHands);
        // console.log("Current state:", currentState.toString());
        const nextState = this.getBestNextState(currentState);
        // console.log("Next state:", nextState.toString());

        // Find out botHandId and playerHandId
        for (let botHand of botHands) {
            for (let playerHand of playerHands) {
                if (botHand.isActive && playerHand.isActive) {
                    const newBotHands = botHands.map(hand => {
                        if (hand.id === botHand.id) {
                            const newValue = (botHand.value + playerHand.value) % 10;
                            return { ...hand, value: newValue, isActive: newValue !== 0 };
                        }
                        return hand;
                    });
                    const newState = getStateWithHands(playerHands, newBotHands);
                    if (newState.equals(nextState)) {
                        // console.log("Found move:", { botHandId: botHand.id, playerHandId: playerHand.id });
                        return { botHandId: botHand.id, playerHandId: playerHand.id };
                    }
                }
            }
        }

        throw new Error("No valid move found");
    }
}
