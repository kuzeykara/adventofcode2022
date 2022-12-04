import { read, readFileSync } from "fs";

const inputFile = 'input.txt';
const input:string = readFileSync(inputFile, 'utf-8').replace(/\r/g, '');

function part01() {
    function containsTheOther(assignment1: number[], assignment2: number[]): boolean {
        if (assignment1[0] <= assignment2[0] && assignment1[1] >= assignment2[1]) {
            // 1 contains 2
            return true;
        }

        return false;
    }
    
    let containingPairs: number = 0;
    //parsing the input
    const sectionAssignmentPairs: number[][][] = input.
    split('\n')
    .map( (pair: string) => {
        return pair.split(',');
    } )
    .map( (pair: string[]) => {
        let newPair: number[][] = [];
        pair.forEach( (range: string) => {
            newPair.push(range.split('-').map(Number));
        } );

        return newPair;
    } );
    
    //check if contains
    sectionAssignmentPairs.forEach( (pair: number[][]) => {
        if (containsTheOther(pair[0], pair[1])) {
            containingPairs++;
        } else if (containsTheOther(pair[1], pair[0])) {
            containingPairs++;
        }
    } );

    console.log(containingPairs);
}

function part02() {
    function overlaps(assignment1: number[], assignment2: number[]): boolean {
        if 
        (
            (assignment1[0] <= assignment2[0] && assignment1[1] >= assignment2[1]) &&
            (assignment2[0] <= assignment1[0] && assignment2[1] >= assignment1[1])
        ) {
            // contains
            return true;
        } else if
        (
            (assignment1[1] >= assignment2[0] && assignment1[0] <= assignment2[1]) && 
            (assignment2[1] >= assignment1[0] && assignment2[0] <= assignment1[1])
        ) {
            // intersects
            return true;
        }

        return false;
    }

    let overlapCount: number = 0;
    //parsing the input
    const sectionAssignmentPairs: number[][][] = input.
    split('\n')
    .map( (pair: string) => {
        return pair.split(',');
    } )
    .map( (pair: string[]) => {
        let newPair: number[][] = [];
        pair.forEach( (range: string) => {
            newPair.push(range.split('-').map(Number));
        } );

        return newPair;
    } );

    sectionAssignmentPairs.forEach( (pair: number[][]) => {
        if ( overlaps(pair[0], pair[1]) ) {
            overlapCount++;
        }
    } );

    console.log(overlapCount);
}

//part01();
part02();
