import { readFileSync } from 'fs';

/** There is a much simpler way to do the 2nd part:
 * 1) Sort the array in the descending order
 * 2) Calculate the sum of the first 3 elements :)
 */

const filename = 'input.txt'

const elves: string = readFileSync(filename, 'utf-8')
    .replace(/\r/g, "");                        // remove all \r characters to avoid issues

    
function part01(): void {
    const calories: string[] = elves.split('\n\n');
    const caloriesGrouped: number[][] = calories.map( (calorie) => {
        const calories: number[] = calorie.split('\n').map(Number);
        return calories;
    } );
    const caloriesCalculated: number[] = caloriesGrouped.map( (calGroup) => {
        let sum = 0;
        for (let i=0; i<calGroup.length; i++) {
            sum += calGroup[i];
         }
        return sum;
    } );
    const mostCals = Math.max(...caloriesCalculated);
        
    console.log(mostCals);
}

function part02(): void {
    const calories: string[] = elves.split('\n\n');
    const caloriesGrouped: number[][] = calories.map( (calorie) => {
        const calories: number[] = calorie.split('\n').map(Number);
        return calories;
    } );
    const caloriesCalculated: number[] = caloriesGrouped.map( (calGroup) => {
        let sum = 0;
        for (let i=0; i<calGroup.length; i++) {
            sum += calGroup[i];
         }
        return sum;
    } );

    // calculate top3
    let top3: number[] = [0, 0, 0];
    for (let i=0; i<caloriesCalculated.length; i++) {
        let currNum = caloriesCalculated[i];
        if (currNum > top3[0]) {
            // replace 3rd and 2nd
            let prev2nd = top3[1];
            top3[1] = top3[0];
            top3[2] = prev2nd; 
            // set new 1st
            top3[0] = currNum;
        } else if (currNum > top3[1]) {
            // replace 3rd
            top3[2] = top3[1];
            // set new 2nd
            top3[1] = currNum;
        } else if (currNum > top3[2]) {
            // set new 3rd
            top3[2] = currNum;
        }
    }

    //calculate top3 sum
    let top3Sum=0;
    for (let i=0; i<top3.length; i++) {
        top3Sum += top3[i];
    }
    // simpler way to calculate the sum:
    // console.log(top3.reduce( (prev, curr) => prev+curr, 0));

    console.log(top3Sum);
}

part01();
part02();
