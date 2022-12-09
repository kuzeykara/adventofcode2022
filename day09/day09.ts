import { readFileSync, readSync } from "fs";

const inputFile = 'input.txt';
const input: string = readFileSync(inputFile, 'utf-8').replace(/\r/g, '');

function part01() {
    function moveToDirectionOnce(currCoords: number[], direction: string): number[] {
        let newCoords: number[] = currCoords;

        switch (direction) {
            case 'R':
                newCoords = [currCoords[0]+1, currCoords[1]];
                break;
            case 'L':
                newCoords = [currCoords[0]-1, currCoords[1]];
                break;
            case 'U':
                newCoords = [currCoords[0], currCoords[1]+1];
                break;
            case 'D':
                newCoords = [currCoords[0], currCoords[1]-1];
                break;
        }

        return newCoords;
    }

    function isHeadTooFar(headCoords: number[], tailCoords: number[]): boolean {
        if (headCoords[0] == tailCoords[0]) {
            // same x
            if (Math.abs(headCoords[1]-tailCoords[1]) > 1) {
                return true;
            }
        } else if (headCoords[1] == tailCoords[1]) {
            // same y
            if (Math.abs(headCoords[0]-tailCoords[0]) > 1) {
                return true;
            }
        } else {
            // diagonal
            if ( (Math.abs(headCoords[0]-tailCoords[0])+Math.abs(headCoords[1]-tailCoords[1])) > 2) {
                return true;
            }
        }

        return false;
    }

    function recordVisited(instructions: string[][]): number[][] {
        let tailVisited: number[][] = [[0, 0]];
        let headCoords: number[] = [0, 0];
        let tailCoords: number[] = [0, 0];
        instructions.forEach( (instruction: string[]) => {
            for (let i=0; i<Number(instruction[1]); i++) {
                headCoords = moveToDirectionOnce(headCoords, instruction[0]);
                if (isHeadTooFar(headCoords, tailCoords)) {
                    //figure out the tail movement
                    if (headCoords[0] > tailCoords[0]) {
                        // go right
                        tailCoords = moveToDirectionOnce(tailCoords, 'R');
                    } else if (headCoords[0] < tailCoords[0]) {
                        // go left
                        tailCoords = moveToDirectionOnce(tailCoords, 'L');
                    }
                    if (headCoords[1] > tailCoords[1]) {
                        // go up
                        tailCoords = moveToDirectionOnce(tailCoords, 'U');
                    } else if (headCoords[1] < tailCoords[1]) {
                        // go down
                        tailCoords = moveToDirectionOnce(tailCoords, 'D');
                    }
                    //record it if not visited before
                    let alreadyVisited: boolean = false;
                    for (let j=0; j<tailVisited.length; j++) {
                        if ( tailVisited[j][0] == tailCoords[0] && tailVisited[j][1] == tailCoords[1] ) {
                            alreadyVisited = true;
                        }
                    }
                    if (!alreadyVisited) tailVisited.push(tailCoords); 
                }
            }
        } );

        return tailVisited;
    }

    const instructions: string[][] = input
    .split('\n')
    .map( (instr: string) => {
        return instr.split(' ');
    } );
    const tailVisited: number[][] = recordVisited(instructions);

    console.log(`Number of locations visited by the tail: ${tailVisited.length}`);
}

function part02() {
    function moveToDirectionOnce(currCoords: number[], direction: string): number[] {
        let newCoords: number[] = currCoords;

        switch (direction) {
            case 'R':
                newCoords = [currCoords[0]+1, currCoords[1]];
                break;
            case 'L':
                newCoords = [currCoords[0]-1, currCoords[1]];
                break;
            case 'U':
                newCoords = [currCoords[0], currCoords[1]+1];
                break;
            case 'D':
                newCoords = [currCoords[0], currCoords[1]-1];
                break;
        }

        return newCoords;
    }

    function isHeadTooFar(headCoords: number[], tailCoords: number[]): boolean {
        if (headCoords[0] == tailCoords[0]) {
            // same x
            if (Math.abs(headCoords[1]-tailCoords[1]) > 1) {
                return true;
            }
        } else if (headCoords[1] == tailCoords[1]) {
            // same y
            if (Math.abs(headCoords[0]-tailCoords[0]) > 1) {
                return true;
            }
        } else {
            // diagonal
            if ( (Math.abs(headCoords[0]-tailCoords[0])+Math.abs(headCoords[1]-tailCoords[1])) > 2) {
                return true;
            }
        }

        return false;
    }

    function moveIfNecessary(currKnot: number[], prevKnot: number[]): number[] {
        let newKnotCoord: number[] = currKnot;

        if (isHeadTooFar(prevKnot, currKnot)) {
            if (prevKnot[0] > currKnot[0]) {
                //move right
                newKnotCoord = moveToDirectionOnce(newKnotCoord, 'R');
            } else if (prevKnot[0] < currKnot[0]) {
                //move left
                newKnotCoord = moveToDirectionOnce(newKnotCoord, 'L');
            }
            if (prevKnot[1] > currKnot[1]) {
                //move up
                newKnotCoord = moveToDirectionOnce(newKnotCoord, 'U');
            } else if (prevKnot[1] < currKnot[1]) {
                // move down
                newKnotCoord = moveToDirectionOnce(newKnotCoord, 'D');
            }
        }

        return newKnotCoord;
    }

    function initializeKnots(knotCount: number): number[][] {
        let knots: number[][] = [];
        for (let i=0; i<knotCount; i++) {
            knots.push([0,0]);
        }

        return knots;
    }

    function updateVisited(currVisited: number[][], tailCoords: number[]): number[][] {
        let newVisited: number[][] = currVisited;

        let alreadyVisited: boolean = false;
        newVisited.forEach( (coord: number[]) => {
            if (coord[0] == tailCoords[0] && coord[1] == tailCoords[1]) alreadyVisited = true;
        } );
        if (!alreadyVisited) newVisited.push(tailCoords);

        return newVisited;
    }

    function recordVisited(instructions: string[][]): number[][] {
        let tailVisited: number[][] = [[0, 0]];
        let knotCoords: number[][] = initializeKnots(10);

        instructions.forEach( (instruction: string[]) => {
            for (let i=0; i<Number(instruction[1]); i++) {
                // move the head
                knotCoords[0] = moveToDirectionOnce(knotCoords[0], instruction[0]);
                for (let j=1; j<knotCoords.length; j++) {
                    // for each knot after the head
                    let currKnotCoords: number[] = knotCoords[j];
                    let prevKnotCoords: number[] = knotCoords[j-1];
                    knotCoords[j] = moveIfNecessary(currKnotCoords, prevKnotCoords);
                }
                tailVisited = updateVisited(tailVisited, knotCoords[knotCoords.length-1]);
            }
        } );

        return tailVisited;
    }

    const instructions: string[][] = input
    .split('\n')
    .map( (instr: string) => {
        return instr.split(' ');
    } );
    const tailVisited: number[][] = recordVisited(instructions);

    console.log(`Number of locations visited by the tail: ${tailVisited.length}`);
}

//part01();
part02();
