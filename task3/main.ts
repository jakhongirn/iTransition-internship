import RockPaperScissorsGame from "./RockPaperScissorsGame";

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