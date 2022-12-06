import { readFileSync } from "fs";

const inputFile = 'input.txt';
const input: string = readFileSync(inputFile, 'utf-8').replace(/\r/g, '');

function part01() {
    function shiftArrayRight(array: string[], newElement: string): string[] {
        let newArr: string[] = [];
        
        for (let i=1; i<array.length; i++) {
            newArr.push(array[i]);
        }
        newArr.push(newElement);
        
        return newArr;
    }

    function isUnique(input: string[]): boolean {
        let seenValues: string[] = [];
        for (let i=0; i<input.length; i++) {
            if (seenValues.includes(input[i])) {
                return false;
            }
            seenValues.push(input[i]);
        } 
        return true;
    }

    function findSoPMarkerPosition(data: string): number {
        let last4Chars: string[] = [];

        for (let i=0; i<data.length; i++) {
            let currChar = data.charAt(i);
            if (i<=3) {
                last4Chars.push(currChar);
            } else {
                if (isUnique(last4Chars)) {
                    //found it!
                    return i;
                } else {
                    //switch
                    last4Chars = shiftArrayRight(last4Chars, currChar);
                }
            }
        }

        return -1;
    }

    const datastream: string = input;
    const sopMarkerPos: number = findSoPMarkerPosition(datastream);

    console.log(sopMarkerPos);
}

function part02() {
    
}

part01();
//part02();
