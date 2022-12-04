import { readFileSync } from 'fs';

const filename = 'input.txt';

const strategyGuide: string = readFileSync(filename, 'utf-8').replace(/\r/g, '');

/** Score calculation:
 * (1 for Rock, 2 for Paper, and 3 for Scissors)
 * +
 * (0 if you lost, 3 if the round was a draw, and 6 if you won)
 */

enum _YourMovePoints {
    ROCK = 1,
    PAPER = 2,
    SCISSORS = 3
}

enum _ResultPoints {
    LOSS = 0,
    DRAW = 3,
    WIN = 6
}


function part01() {
    /** 
     * First column: Opponent move (A for Rock, B for Paper, and C for Scissors)
     * Second column: Your response (X for Rock, Y for Paper, and Z for Scissors)
    */
    const moves: number[][] = strategyGuide
        .split('\n')
        .map( (moveGroup: string) => {
            moveGroup = moveGroup.replace('A', '1')
                .replace('B', '2')
                .replace('C', '3')
                .replace('X', '-1')
                .replace('Y', '-2')
                .replace('Z', '-3');
            return moveGroup.split(' ');
        } )
        .map( (moveGroup: string[]) => {
            return moveGroup.map(Number);
        } ) ;
    
    let points: number = 0
    for (let i=0; i<moves.length; i++) {
        let currMoves: number[] = moves[i];
        //calculate result
        const result: number = currMoves[0] + currMoves[1];
        //calculate points
        switch (result) {
            case 0:
                points += _ResultPoints.DRAW
                break;
            case 1:
                points += _ResultPoints.LOSS
                break;
            case 2:
                points += _ResultPoints.WIN
                break;
            case -1:
                points += _ResultPoints.WIN
                break;
            case -2:
                points += _ResultPoints.LOSS
                break;
        }
        switch (currMoves[1]) {
            case -1:
                points += _YourMovePoints.ROCK;
                break;
            case -2:
                points += _YourMovePoints.PAPER;
                break;
            case -3:
                points += _YourMovePoints.SCISSORS;
                break;
        }
    }

    console.log(points);
}


function part02() {
    /** 
     * First column: Opponent move (A for Rock, B for Paper, and C for Scissors)
     * Second column: Round end (X for Loss, Y for Draw, and Z for Win)
    */
    const moves: string[][] = strategyGuide
        .split('\n')
        .map( (moveGroup: string) => {
            return moveGroup.split(' ');
        } );
    
    let points: number = 0;
    for (let i=0; i<moves.length; i++) {
        let currMoves: string[] = moves[i];
        switch (currMoves[1]) {
            case 'X':
                //lose
                points += _ResultPoints.LOSS;
                switch (currMoves[0]) {
                    case 'A':
                        points += _YourMovePoints.SCISSORS;
                        break;
                    case 'B':
                        points += _YourMovePoints.ROCK;
                        break;
                    case 'C':
                        points += _YourMovePoints.PAPER;
                        break;
                }
                break;
            case 'Y':
                //draw
                points += _ResultPoints.DRAW;
                switch (currMoves[0]) {
                    case 'A':
                        points += _YourMovePoints.ROCK;
                        break;
                    case 'B':
                        points += _YourMovePoints.PAPER;
                        break;
                    case 'C':
                        points += _YourMovePoints.SCISSORS;
                        break;
                }
                break;
            case 'Z':
                //win
                points += _ResultPoints.WIN;
                switch (currMoves[0]) {
                    case 'A':
                        points += _YourMovePoints.PAPER;
                        break;
                    case 'B':
                        points += _YourMovePoints.SCISSORS;
                        break;
                    case 'C':
                        points += _YourMovePoints.ROCK;
                        break;
                }
                break;
        }
    }

    console.log(points);
}


part01();
part02();
