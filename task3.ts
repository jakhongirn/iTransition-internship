import * as crypto from "crypto";
import * as readline from "readline";

//1. Create key and hmac generator

class HMACGenerator {
    generateHMAC(key: Buffer, value: string): string {
        return crypto.createHmac("sha3-256", key).update(value).digest("hex");
    }
}

class SecretKeyGenerator {
    generateRandomKey(): Buffer {
        return crypto.randomBytes(32);
    }
}

//2. Build rules of game

class GameRules {
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

// Build game class and its logic
class RockPaperScissorsGame {
    private key: Buffer;
    private moves: string[];
    private hmacCalculator: HMACGenerator;
    private gameRules: GameRules;
  
    constructor(moves: string[]) {
      this.moves = moves;
      this.key = new SecretKeyGenerator().generateRandomKey();
      this.hmacCalculator = new HMACGenerator();
      this.gameRules = new GameRules(this.moves);
    }
  
    private generateComputerMove(): number {
      return Math.floor(Math.random() * this.moves.length) + 1;
    }
  
    start(): void {
      const computerMove = this.generateComputerMove();
      const computerMoveName = this.moves[computerMove - 1];
  
      console.log(`HMAC: ${this.hmacCalculator.generateHMAC(this.key, computerMoveName)}`);
      console.log('Available moves:');
      this.moves.forEach((move, index) => {
        console.log(`${index + 1} - ${move}`);
      });
      console.log('0 - exit');
      console.log('? - help');
  
      const game = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
  
      game.question('Enter your move: ', (input: string) => {
        const userInput = input.trim();
        if (userInput === '0') {
          game.close();
          return;
        }
  
        else if (userInput === '?') {
          this.displayHelp();
          game.question('Enter your move: ', this.handleUserMove.bind(this, computerMove, game));
        } else {
          return this.handleUserMove(computerMove, game, userInput)
    }});
    }
  
    private displayHelp(): void {
      const table = this.gameRules.displayTable();
      console.log('Help Table:');
      for (const row of table) {
        console.log(row.join('\t'));
      }
    }
  
    private handleUserMove(computerMove: number, game: readline.Interface, input: string): void {
      const playerMove = parseInt(input);
      if (isNaN(playerMove) || playerMove < 1 || playerMove > this.moves.length) {
        console.log('Invalid input. Please enter a valid move.');
        game.question('Enter your move: ', this.handleUserMove.bind(this, computerMove, game));
      } else {
        const playerMoveName = this.moves[playerMove - 1];
        const result = this.gameRules.findWinner(playerMove, computerMove);
  
        console.log(`Your move: ${playerMoveName}`);
        console.log(`Computer move: ${this.moves[computerMove - 1]}`);
        const sayResult = result === "Draw!" ? `It's a ${result}` : `You ${result}` 
        console.log(sayResult);
        console.log(`HMAC key: ${this.key.toString('hex').toUpperCase()}`);
  
        game.close();
      }
    }
  }
  
  function main(): void {
    const args = process.argv.slice(2);
  
    if (args.length < 3 || args.length % 2 !== 1 || new Set(args).size !== args.length) {
      console.error('Invalid inputs. Please provide an odd number of non-repeating strings.\nExample: node index.js rock paper scissors lizard Spock');
      process.exit(1);
    }
  
    const game = new RockPaperScissorsGame(args);
    game.start();
  }
  
  main();
