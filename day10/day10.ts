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
    function addX(x: number, value: number): number {
        return x+value;
    }

    function drawOnCRT(currCRTRow: string[], CRTIndex: number, x: number): string[] {
        let newCRTRow: string[] = currCRTRow;

        if (x == CRTIndex || x-1 == CRTIndex || x+1 == CRTIndex) {
            newCRTRow.push('#');
        } else {
            newCRTRow.push('.');
        }

        return newCRTRow;
    }

    function execute(instructions: string[][]): string[][] {
        let CRTScreen: string[][] = [[], [], [], [], [], []];
        let CRTIndex: number = 0;
        let CRTHeight: number = 0;
        let x: number = 1;
        let instructionIndex: number = 0;
        // busy=true -> addX called last cycle
        let busy: boolean = false;

        for (let cycle=1; cycle<241; cycle++) {
            CRTScreen[CRTHeight] = drawOnCRT(CRTScreen[CRTHeight], CRTIndex, x);
            
            let currInstruction: string[] = instructions[instructionIndex];
            if (!busy) {
                if (currInstruction[0] === 'noop') {
                    // do nothing
                    instructionIndex += 1;
                } else {
                    busy = true;
                }
            } else {
                // finishing executing
                x = addX(x, Number(currInstruction[1]));
                instructionIndex += 1;
                busy = false;
            }
            
            if (cycle%40==0) {
                CRTHeight += 1;
                CRTIndex = 0;
            } else {
                CRTIndex += 1;
            }
        }

        return CRTScreen;
    }

    function displayScreen(CRT: string[][]): void {
        let screenStr: string = '';
        
        for (let i=0; i<CRT.length; i++) {
            let currRow: string[] = CRT[i];
            for (let j=0; j<currRow.length; j++) {
                screenStr += currRow[j];
            }
            screenStr += '\n';
        }

        console.log(screenStr);
    }

    const inputInstructions: string[][] = input
    .split('\n')
    .map( (instr: string) => {
        return instr.split(' ');
    } );
    const screen: string[][] = execute(inputInstructions);

    displayScreen(screen);
}

//part01();
part02();
