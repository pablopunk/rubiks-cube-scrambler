var Cube = (function () {
    function Cube() {
        // Define the six faces of the cube
        this.faces = "DLBURF";
        // This will contain a history of all the states to make sure we don't repeat a state
        this.states = [];
        // Which stickers are part of the same layer and should move along with the face
        this.edges = {
            D: [46, 45, 44, 38, 37, 36, 22, 21, 20, 14, 13, 12],
            L: [24, 31, 30, 40, 47, 46, 0, 7, 6, 20, 19, 18],
            B: [26, 25, 24, 8, 15, 14, 6, 5, 4, 36, 35, 34],
            U: [18, 17, 16, 34, 33, 32, 42, 41, 40, 10, 9, 8],
            R: [28, 27, 26, 16, 23, 22, 4, 3, 2, 44, 43, 42],
            F: [30, 29, 28, 32, 39, 38, 2, 1, 0, 12, 11, 10]
        };
    }
    // Sets the cube to the solved state
    Cube.prototype.reset = function () {
        this.states = ["yyyyyyyyoooooooobbbbbbbbwwwwwwwwrrrrrrrrgggggggg"];
    };
    // Twist the cube according to a move in WCA notation
    Cube.prototype.twist = function (state, move) {
        var i, k, prevState, face = move.charAt(0), faceIndex = this.faces.indexOf(move.charAt(0)), turns = move.length > 1 ? (move.charAt(1) === "2" ? 2 : 3) : 1;
        state[0] = state.join("");
        for (i = 0; i < turns; i++) {
            prevState = state.slice(0);
            // Rotate the stickers on the face itself
            for (k = 0; k < 8; k++) {
                state[(faceIndex * 8) + k] = prevState[(faceIndex * 8) + ((k + 6) % 8)];
            }
            // Rotate the adjacent stickers that are part of the same layer
            for (k = 0; k < 12; k++) {
                state[this.edges[face][k]] = prevState[this.edges[face][(k + 9) % 12]];
            }
        }
        return state.join("");
    };
    // Scramble the cube
    Cube.prototype.scramble = function () {
        var count = 0, total = 25, state, prevState = this.states[this.states.length - 1], move, moves = [], modifiers = ["", "'", "2"];
        while (count < total) {
            // Generate a random move
            move = this.faces[Math.floor(Math.random() * 6)] + modifiers[Math.floor(Math.random() * 3)];
            // Don't move the same face twice in a row
            if (count > 0 && move.charAt(0) === moves[count - 1].charAt(0)) {
                continue;
            }
            // Avoid move sequences like "R L R", which is the same as "R2 L"
            if (count > 1 && move.charAt(0) === moves[count - 2].charAt(0) &&
                moves[count - 1].charAt(0) === this.faces.charAt((this.faces.indexOf(move.charAt(0)) + 3) % 6)) {
                continue;
            }
            state = this.twist([prevState], move);
            if (this.states.indexOf(state[0]) === -1) {
                // If this state hasn't yet been encountered, save it and move on
                moves[count] = move;
                this.states[count] = state;
                count++;
                prevState = state;
            }
        }
        return moves;
    };
    Cube.prototype.getScramble = function () {
        this.reset();
        var i, scramble = this.scramble(), len = scramble.length, result = "";
        for (i = 0; i < len; i += 5) {
            // Only allow a line break every 5 moves
            result += scramble.slice(i, i + 5) + " ";
        }
        return result.split(',').join(' ');
    };
    return Cube;
}());
//# sourceMappingURL=cube.js.map