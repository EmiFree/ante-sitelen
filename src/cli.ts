import { anteSitelen } from "./ante";

const args = process.argv.slice(2);
const from = args.indexOf("-f");
const to = args.indexOf("-t");
const input = args.indexOf("-i");

if (from === -1 || to === -1 || input === -1) {
  console.error("Usage: bun src/cli.ts -f <1|2|3> -t <1|2|3> -i <text>");
  console.error("  1=latin  2=greek  3=cyrillic");
  process.exit(1);
}

console.log(anteSitelen(Number(args[from + 1]), Number(args[to + 1]), args[input + 1]));
