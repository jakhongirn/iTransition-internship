"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var readline = require("readline");
//1. Create key and hmac generator
var HMACGenerator = /** @class */ (function () {
    function HMACGenerator() {
    }
    HMACGenerator.prototype.generateHMAC = function (key, value) {
        return crypto.createHmac("sha3-256", key).update(value).digest("hex");
    };
    return HMACGenerator;
}());
var SecretKeyGenerator = /** @class */ (function () {
    function SecretKeyGenerator() {
    }
    SecretKeyGenerator.prototype.generateRandomKey = function () {
        return crypto.randomBytes(32);
    };
    return SecretKeyGenerator;
}());
//2. Build rules of game
var GameRules = /** @class */ (function () {
    function GameRules(moves) {
        this.moves = moves;
    }
    GameRules.prototype.findWinner = function (playerMove, computerMove) {
        var half = (this.moves.length - 1) / 2;
        if (computerMove === playerMove) {
            return "Draw!";
        }
        if ((computerMove - playerMove + this.moves.length) % this.moves.length <= half) {
            return "Lose!";
        }
        else {
            return "Win!";
        }
    };
    GameRules.prototype.displayTable = function () {
        var table = [];
        table.push(__spreadArray(["*"], this.moves, true));
        for (var i = 0; i < this.moves.length; i++) {
            var row = [];
            row.push(this.moves[i]);
            for (var j = 0; j < this.moves.length; j++) {
                var result = this.findWinner(i + 1, j + 1);
                row.push(result.charAt(0).toUpperCase());
            }
            table.push(row);
        }
        return table;
    };
    return GameRules;
}());
// Build game class and its logic
var RockPaperScissorsGame = /** @class */ (function () {
    function RockPaperScissorsGame(moves) {
        this.moves = moves;
        this.key = new SecretKeyGenerator().generateRandomKey();
        this.hmacCalculator = new HMACGenerator();
        this.gameRules = new GameRules(this.moves);
    }
    RockPaperScissorsGame.prototype.generateComputerMove = function () {
        return Math.floor(Math.random() * this.moves.length) + 1;
    };
    RockPaperScissorsGame.prototype.start = function () {
        var _this = this;
        var computerMove = this.generateComputerMove();
        var computerMoveName = this.moves[computerMove - 1];
        console.log("HMAC: ".concat(this.hmacCalculator.generateHMAC(this.key, computerMoveName)));
        console.log('Available moves:');
        this.moves.forEach(function (move, index) {
            console.log("".concat(index + 1, " - ").concat(move));
        });
        console.log('0 - exit');
        console.log('? - help');
        var game = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        game.question('Enter your move: ', function (input) {
            var userInput = input.trim();
            if (userInput === '0') {
                game.close();
                return;
            }
            else if (userInput === '?') {
                _this.displayHelp();
                game.question('Enter your move: ', _this.handleUserMove.bind(_this, computerMove, game));
            }
            else {
                return _this.handleUserMove(computerMove, game, userInput);
            }
        });
    };
    RockPaperScissorsGame.prototype.displayHelp = function () {
        var table = this.gameRules.displayTable();
        console.log('Help Table:');
        for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
            var row = table_1[_i];
            console.log(row.join('\t'));
        }
    };
    RockPaperScissorsGame.prototype.handleUserMove = function (computerMove, game, input) {
        var playerMove = parseInt(input);
        if (isNaN(playerMove) || playerMove < 1 || playerMove > this.moves.length) {
            console.log('Invalid input. Please enter a valid move.');
            game.question('Enter your move: ', this.handleUserMove.bind(this, computerMove, game));
        }
        else {
            var playerMoveName = this.moves[playerMove - 1];
            var result = this.gameRules.findWinner(playerMove, computerMove);
            console.log("Your move: ".concat(playerMoveName));
            console.log("Computer move: ".concat(this.moves[computerMove - 1]));
            var sayResult = result === "Draw!" ? "It's a ".concat(result) : "You ".concat(result);
            console.log(sayResult);
            console.log("HMAC key: ".concat(this.key.toString('hex').toUpperCase()));
            game.close();
        }
    };
    return RockPaperScissorsGame;
}());
function main() {
    var args = process.argv.slice(2);
    if (args.length < 3 || args.length % 2 !== 1 || new Set(args).size !== args.length) {
        console.error('Invalid inputs. Please provide an odd number of non-repeating strings.\nExample: node index.js rock paper scissors lizard Spock');
        process.exit(1);
    }
    var game = new RockPaperScissorsGame(args);
    game.start();
}
main();
