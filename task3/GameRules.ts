export default class GameRules {
    private moves: string[];

    constructor(moves: string[]) {
        this.moves = moves;
    }

    findWinner(playerMove: number, computerMove: number): string {
        const half = (this.moves.length - 1) / 2;
        if (computerMove === playerMove) {
            return "Draw!";
        }
        if (
            (computerMove - playerMove + this.moves.length) % this.moves.length <= half
        ) {
            return "Lose!";
        } else {
            return "Win!";
        }
    }

    displayTable(): string[][] {
        const table: string[][] = [];
        table.push(["*", ...this.moves]);

        for (let i = 0; i < this.moves.length; i++) {
            const row: string[] = [];
            row.push(this.moves[i]);
            for (let j = 0; j < this.moves.length; j++) {
                const result = this.findWinner(i + 1, j + 1);
                row.push(result.charAt(0).toUpperCase());
            }
            table.push(row);
        }

        return table;
    }
}