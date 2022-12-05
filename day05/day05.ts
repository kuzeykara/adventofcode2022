import { readFileSync } from "fs";
import { exit } from "process";

const inputFile = 'input.txt';
const inputFile2 = 'input2.txt';
const input = readFileSync(inputFile, 'utf-8').replace(/\r/g, '');
const input2 = readFileSync(inputFile2, 'utf-8').replace(/\r/g, '');

function part01() {
    function parseStartingCrates(stackInput: string): string[][] {
        const startingStacks: string[] = stackInput.split('\n');
        const stackCount: number = startingStacks[startingStacks.length-1].replace(/ /g, '').length;
        const currMaxDepth: number = startingStacks.length-1;
        
        // initializing the stacks array
        let stacks: string[][] = []
        for (let i=0; i<stackCount; i++) {
            stacks.push([]);
        }

        for (let i=0; i<currMaxDepth; i++) {
            let currLine: string = startingStacks[i];
            for (let j=0; j<currLine.length-2; j+=4) {
                let currCrate:string  = currLine.slice(j, j+3);
                if (currCrate !== '   ') {
                    stacks[Math.floor(j/4)].push(currCrate);
                }
            }
        }

        stacks = stacks.map( (stack: string[]) => {
            return stack.reverse();
        } );

        return stacks;
    }

    function parseInstructions(instructionsInput: string): number[][] {
        let parsedInstructions: number[][] = []
        let splitInstructions: string[][] = instructionsInput
        .split('\n').map( (instruction: string) => {
            return instruction.split(' ');
        } );

        splitInstructions.forEach( (instruction: string[]) => {
            parsedInstructions.push([Number(instruction[1]), Number(instruction[3]), Number(instruction[5])]);
        } );

        return parsedInstructions;
    }

    function moveCrates(count: number, from: number, to: number, currStacks: string[][]): string[][] {
        let newStacks: string[][] = currStacks;
        let crate: string = '';

        for (let i=0; i<count; i++) {
            crate = (newStacks[from-1].length > 0) ? newStacks[from-1].pop() as string : '';
            if (crate==='') {
                console.error('ERROR: Tried to get a crate from an empty stack!');
                exit(1);
            }
            newStacks[to-1].push(crate);
        }

        return newStacks;
    }

    function findTheTopsOfStacks(stacks: string[][]): string {
        let theTops: string = '';

        let currTop: string = '';
        stacks.forEach( (stack: string[]) => {
            //assuming no empty stacks!
            currTop = stack[stack.length-1];
            //stripping
            currTop = currTop.replace('[', '').replace(']', '');
            theTops = theTops + currTop;
        } );

        return theTops;
    }

    const stacks: string[][] = parseStartingCrates(input2);
    const instructions: number[][] = parseInstructions(input);
    let finalStacks: string[][] = stacks;

    instructions.forEach( (instruction: number[]) => {
        finalStacks = moveCrates(instruction[0], instruction[1], instruction[2], finalStacks);
    } );

    const theMessage: string = findTheTopsOfStacks(finalStacks);

    console.log(theMessage);
}

function part02() {
    
}

part01();
//part02();
