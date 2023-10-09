import * as readline from "readline";
import HMACGenerator from './HMACGenerator';
import SecretKeyGenerator from "./SecretKeyGenerator";
import GameRules from "./GameRules";

export default class RockPaperScissorsGame {
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