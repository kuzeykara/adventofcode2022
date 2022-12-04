import { readFileSync } from 'fs';

const inputFile = 'input.txt'

const input = readFileSync(inputFile, 'utf-8').replace(/\r/g, '');


function part01() {
    function findTheDuplicate(rucksack: string): string {
        const firstHalf: string = rucksack.slice(0, rucksack.length/2);
        const secondHalf: string = rucksack.slice(rucksack.length/2, rucksack.length);

        for (let i=0; i<firstHalf.length; i++) {
            let currChar = firstHalf[i];
            if (secondHalf.includes(currChar)) {
                return currChar;
            }
        }

        return '';
    }

    function calculatePriority(char: string): number {
        // a=97-122
        // A=65-90
        const charCode = char.charCodeAt(0);
        if (charCode > 96) {
            return charCode-96
        } else {
            return charCode-38
        }
    }

    const rucksacks = input.split('\n');
    let prioritySum: number = 0;

    rucksacks.forEach( (rucksack: string) => {
        prioritySum += calculatePriority(findTheDuplicate(rucksack));
    } );

    console.log(prioritySum);
}

function part02() {
    function initializeElfGroups(rucksacks: string[]): string[][] {
        let elfGroups: string[][] = [];

        let elfGroup: string[] = [];
        for (let i=0; i<rucksacks.length; i++) {
            let currRucksack: string = rucksacks[i];
            switch(i%3) {
                case 0:
                    elfGroup.push(currRucksack);
                    break;
                case 1:
                    elfGroup.push(currRucksack);
                    break;
                case 2:
                    elfGroup.push(currRucksack);
                    elfGroups.push(elfGroup);
                    elfGroup = [];
                    break;
            }
        }

        return elfGroups;
    }

    function findTheBadge(elfGroup: string[]): string {
        const rucksack1: string = elfGroup[0];
        const rucksack2: string = elfGroup[1];
        const rucksack3: string = elfGroup[2];
        let charMatches: string[] = []

        // find matches for the first 2 rucksacks
        for (let i=0; i<rucksack1.length; i++) {
            let currChar = rucksack1.charAt(i);
            if (rucksack2.includes(currChar)) {
                charMatches.push(currChar);
            }
        }

        // compare matches to the 3rd rucksack
        for (let i=0; i<charMatches.length; i++) {
            let currChar = charMatches[i];
            if (rucksack3.includes(currChar)) {
                return currChar;
            }
        }

        return '';
    }

    function calculatePriority(char: string): number {
        // a=97-122
        // A=65-90
        const charCode = char.charCodeAt(0);
        if (charCode > 96) {
            return charCode-96
        } else {
            return charCode-38
        }
    }

    const rucksacks: string[] = input.split('\n');
    const elfGroups: string[][] = initializeElfGroups(rucksacks);
    let prioritySum: number = 0;

    elfGroups.forEach( (elfGroup: string[]) => {
        prioritySum += calculatePriority(findTheBadge(elfGroup));
    } );


    console.log(prioritySum);
}


//part01();
part02();
