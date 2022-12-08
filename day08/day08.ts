import { readFileSync } from "fs";

const inputFile = 'input.txt';
const input: string = readFileSync(inputFile, 'utf-8').replace(/\r/g, '');

function part01() {
    function parseTreesInput(input: string): number[][] {
        let treesGrid: number[][] = input.split('\n').map( (line: string) => {
            let treeLine: number[] = [];
            for (let i=0; i<line.length; i++) {
                let currChar = line.charAt(i);
                treeLine.push(Number(currChar));
            }
            return treeLine;
        } );

        return treesGrid;
    }

    function isVisibleFromDirection(treeHeight: number, treesCovering: number[]): boolean {
        for (let i=0; i<treesCovering.length; i++) {
            if (treesCovering[i] >= treeHeight) {
                return false;
            }
        }
        return true;
    }

    function isTreeVisible(treePos: number[], grid: number[][]): boolean {
        let leftSide: number[] = [];
        let rightSide: number[] = [];
        let topSide: number[] = [];
        let bottomSide: number[] = [];
        let treeHeight: number = 0;

        // establish the sides
        for (let y=0; y<grid.length; y++) {
            for (let x=0; x<grid[y].length; x++) {
                if (x == treePos[0] && y == treePos[1]) {
                    // ourNumber
                    treeHeight = grid[y][x];
                } else if (y == treePos[1]) {
                    // same y
                    if (x < treePos[0]) {
                        leftSide.push(grid[y][x]);
                    } else {
                        rightSide.push(grid[y][x]);
                    }
                } else if (x == treePos[0]) {
                    // same x
                    if (y < treePos[1]) {
                        topSide.push(grid[y][x]);
                    } else {
                        bottomSide.push(grid[y][x]);
                    }
                }
            }
        }

        // check the heights from each side
        if (
            isVisibleFromDirection(treeHeight, leftSide) ||
            isVisibleFromDirection(treeHeight, rightSide) ||
            isVisibleFromDirection(treeHeight, topSide) ||
            isVisibleFromDirection(treeHeight, bottomSide)
        ) {
            return true;
        }
        
        /*
        console.log(`Left side: ${leftSide}`);
        console.log(`Right side: ${rightSide}`);
        console.log(`Top side: ${topSide}`);
        console.log(`Bottom side: ${bottomSide}`);
        */

        return false;
    }

    function visibleTreesCount(treeGrid: number[][]): number {
        let visibleTreeCount: number = 0;

        for (let y=0; y<treeGrid.length; y++) {
            for (let x=0; x<treeGrid[y].length; x++) {
                if (isTreeVisible([x, y], treeGrid)) {
                    visibleTreeCount++;
                }
            }
        }

        return visibleTreeCount;
    }

    const treeGrid: number[][] = parseTreesInput(input);
    const visibleTrees: number = visibleTreesCount(treeGrid);

    console.log(`Trees that are visible from the outside: ${visibleTrees}`);
}

function part02() {
    function parseTreesInput(input: string): number[][] {
        let treesGrid: number[][] = input.split('\n').map( (line: string) => {
            let treeLine: number[] = [];
            for (let i=0; i<line.length; i++) {
                let currChar = line.charAt(i);
                treeLine.push(Number(currChar));
            }
            return treeLine;
        } );

        return treesGrid;
    }

    function isTreeOnEdge(treePos: number[], gridHeight: number, gridLength: number): boolean {
        if (
            treePos[0] == 0 ||
            treePos[1] == 0 ||
            treePos[0] == gridLength-1 ||
            treePos[1] == gridHeight-1
        ) {
            return true;
        }

        return false;
    }

    function visibleTreeFromPos(treeHeight: number, treesCovering: number[]): number {
        let visibleTreeCount: number = 0;

        for (let i=0; i<treesCovering.length; i++) {
            if (treesCovering[i] >= treeHeight) {
                visibleTreeCount++;
                break;
            } else {
                visibleTreeCount++;
            }
        }

        return visibleTreeCount;
    }

    function calcScenicScore(treePos: number[], grid: number[][]): number {
        if (isTreeOnEdge(treePos, grid.length, grid[0].length)) return 0;

        let leftSide: number[] = [];
        let rightSide: number[] = [];
        let topSide: number[] = [];
        let bottomSide: number[] = [];
        let treeHeight: number = 0;

        // establish the sides
        for (let y=0; y<grid.length; y++) {
            for (let x=0; x<grid[y].length; x++) {
                if (x == treePos[0] && y == treePos[1]) {
                    // our number
                    treeHeight = grid[y][x];
                } else if (y == treePos[1]) {
                    // same y
                    if (x < treePos[0]) {
                        leftSide.push(grid[y][x]);
                    } else {
                        rightSide.push(grid[y][x]);
                    }
                } else if (x == treePos[0]) {
                    // same x
                    if (y < treePos[1]) {
                        topSide.push(grid[y][x]);
                    } else {
                        bottomSide.push(grid[y][x]);
                    }
                }
            }
        }
        // reversing to count from the view of the current trees position
        leftSide.reverse();
        topSide.reverse();

        return (
            visibleTreeFromPos(treeHeight, leftSide)*
            visibleTreeFromPos(treeHeight, rightSide)*
            visibleTreeFromPos(treeHeight, topSide)*
            visibleTreeFromPos(treeHeight, bottomSide)
        );
    }


    const treeGrid: number[][] = parseTreesInput(input);
    let highestScore: number = 0;

    for (let y=0; y<treeGrid.length; y++) {
        for(let x=0; x<treeGrid[y].length; x++) {
            let currScenicScore = calcScenicScore([x, y], treeGrid);
            if (currScenicScore > highestScore) highestScore = currScenicScore;
        }
    }

    console.log(`Highest scenic score: ${highestScore}`);
}

part01();
part02();
