import { readFileSync } from "fs";

const inputFile = 'input.txt';
const input: string = readFileSync(inputFile, 'utf-8').replace(/\r/g, '');

/**
    addx V takes two cycles to complete. After two cycles, the X register is increased by the value V. (V can be negative.)
    noop takes one cycle to complete. It has no other effect.
 */

function part01() {
    function addX(x: number, value: number): number {
        return x+value;
    }

    function passCycle(currCycle: number, x: number): number {
        let signalStr: number = 0;
        
        if ( (currCycle+20)%40 == 0 ) {
            // interesting signal
            signalStr = currCycle*x;
        }

        return signalStr;
    }

    function execute(instructions: string[][]): number {
        let x: number = 1;
        let cycle: number = 1;
        let totalSignalStrength: number = 0;

        instructions.forEach( (instruction: string[]) => {
            if (instruction[0] === 'noop') {
                // do nothing for a cycle
                totalSignalStrength += passCycle(cycle, x);
                cycle++;
            } else {
                totalSignalStrength += passCycle(cycle, x);
                cycle++;
                totalSignalStrength += passCycle(cycle, x);
                cycle++;
                x = addX(x, Number(instruction[1]));
            }
        } );

        return totalSignalStrength;
    }

    const inputInstructions: string[][] = input
    .split('\n')
    .map( (instr: string) => {
        return instr.split(' ');
    } );
    const totSignalStr: number = execute(inputInstructions);

    console.log(totSignalStr);
}

function part02() {
    
}

part01();
//part02();
