import { readFileSync } from "fs";

const inputFile = 'input.txt';
const input: string = readFileSync(inputFile, 'utf-8').replace(/\r/g, '');

function part01() {
    class Monkey {
        private id: number;
        private items: number[];
        private operation: string[];
        private test: number[] = [];
        private itemInspectionCount: number;
    
        public constructor(
            id: number, startingItems: number[], operation: string[], 
            testCondition: number, testTrue: number, testFalse: number 
        ) {
            this.id = id;
            this.items = startingItems;
            this.operation = operation;
            // divisible by:
            this.test.push(testCondition);
            // if true: throw to monkey with id:
            this.test.push(testTrue);
            // if false: throw to monkey with id:
            this.test.push(testFalse);
            this.itemInspectionCount = 0;
        }
    
        public getId(): number {return this.id;}
    
        public getItems(): number[] {return this.items;}
    
        public getItemInspectionCount(): number {return this.itemInspectionCount;}
    
        public getFirstItem(): number|null {
            if (this.items.length > 0) {
                return this.items[0];
            } else {
                return null;
            }
        };
    
        public inspectItem(): number {
            console.log(`Monkey ${this.id} inspects the item with the worry level of ${this.items[0]}.`);
            let currItem: number = this.items[0];
            // parse operation
            let currOperation = this.operation
                .map( (element: string) => { return element.replace('old', String(currItem)) } );
            
            const op: string = currOperation[1].charAt(0);
            const num1: number = Number(currOperation[0]);
            const num2: number = Number(currOperation[2]);
            switch (op) {
                case '+':
                    currItem = num1+num2;
                    break;
                case '*':
                    currItem = num1*num2;
                    break;
            }
            console.log(`The new worry level is ${currItem}`);
            // monkey is bored
            this.items[0] = Math.floor(currItem/3);
            console.log(`Monkey is bored with the item. New worry level is ${this.items[0]}`);
            
            this.itemInspectionCount += 1;
            return this.items[0];
        }
    
        public throwItem(): number {
            // remove the first element from the array (assuming it's not empty)
            let currItem: number = this.items.shift() as number;
            // return the id of the monkey to throw
            if (currItem % this.test[0] == 0) {
                console.log(`Item with wl ${currItem} is thrown to monkey ${this.test[1]}`);
                return this.test[1];
            } else {
                console.log(`Item with wl ${currItem} is thrown to monkey ${this.test[2]}`);
                return this.test[2];
            }
        }
    
        public catchItem(item: number) {
            this.items.push(item);
            console.log(`Monkey ${this.id} catches the item with the wl ${item}`);
        }
    }

    function initializeMonkeys(monkeyDesc: string[]): Monkey[] {
        let monkeys: Monkey[] = [];

        monkeyDesc.forEach( (monkey: string) => {
            let currMonkeyDesc: string[][] = monkey.split('\n').map( (line: string) => {
                return line.split(' ');
            } );
            let currMonkey: Monkey = new Monkey(
                Number(currMonkeyDesc[0][1].replace(':', '')),
                currMonkeyDesc[1].slice(4)
                    .map( (str: string) => {return str.replace(',', '')} )
                    .map(Number),
                currMonkeyDesc[2].slice(5),
                Number(currMonkeyDesc[3][5]),
                Number(currMonkeyDesc[4][9]),
                Number(currMonkeyDesc[5][9])
            );
            monkeys.push(currMonkey);
        } );

        return monkeys;
    }

    function executeARound(monkeys: Monkey[]) {
        monkeys.forEach( (monkey: Monkey) => {
            let firstItem: number|null = monkey.getFirstItem();
            // throw until no more items are left
            while (firstItem != null) {
                firstItem = monkey.inspectItem();
                monkeys[monkey.throwItem()].catchItem(firstItem);

                firstItem = monkey.getFirstItem();
            }
        } );
    }

    function calcMonkeyBusiness(monkeys: Monkey[]): number {
        console.log('\n\nCalculating monkey business...');
        let mostActive: number[] = [0, 0];
        monkeys.forEach( (monkey: Monkey) => {
            let currInspCount: number = monkey.getItemInspectionCount();
            if (currInspCount > mostActive[0]) {
                // biggest
                mostActive[1] = mostActive[0];
                mostActive[0] = currInspCount;
            } else if (currInspCount > mostActive[1]) {
                // second biggest
                mostActive[1] = currInspCount;
            }
        } );
        console.log(`Most active monkeys inspected items ${mostActive[0]} and ${mostActive[1]} times.`);

        return mostActive[0]*mostActive[1];
    }

    const monkeysDesc: string[] = input.split('\n\n');
    const monkeys: Monkey[] = initializeMonkeys(monkeysDesc);

    // 20 turns
    for (let i=0; i<20; i++) {
        executeARound(monkeys);
    }
    const monkeyBusiness: number = calcMonkeyBusiness(monkeys);

    console.log(monkeyBusiness);
}

function part02() {
    
}
/*
This solution to part 2 doesn't work since it runs into the same problem with the base10 (original) solution
Sadly I spent an unnecessarily long time on this and I wanted to keep it :(
function IWroteOperationsForBase1000ButItDoesntDoTheJob() {
    const BASE_THOUSAND_DIGITS = 100

    function convertToBaseThousand(value: number): number[] {
        // initializing the result array
        let result: number[] = [];
        for (let i=0; i<BASE_THOUSAND_DIGITS; i++) {
            result.push(0);
        }

        let newValue: number = value;
        for (let i=BASE_THOUSAND_DIGITS-1; i>=0; i--) {
            let toCarry: number = newValue-999;
            if (toCarry > 0) {
                result[i] = newValue%1000;
                newValue = (newValue-result[i]) / 1000;
            } else {    
                result[i] = newValue;
                break;
            }
        }

        return result;
    }

    function sumBaseThousand(num1: number[], num2: number[]): number[] {
        // initializing the result array
        let result: number[] = [];
        for (let i=0; i<BASE_THOUSAND_DIGITS; i++) {
            result.push(0);
        }

        for (let i=BASE_THOUSAND_DIGITS-1; i>=0; i--) {
            let digit1: number = num1[i];
            let digit2: number = num2[i];
            let digitSum: number = digit1+digit2;
            let toCarry: number = digitSum-999;
            if (toCarry>0) {
                if (i-1 >= 0) {
                    num1[i-1] += 1;
                }
                result[i] = digitSum-1000;
            } else {
                result[i] = digitSum;
            }
        }

        return result;
    }

    function sumMultipleBaseThousand(nums: number[][]): number[] {
        let newNums: number[][] = nums;
        while (newNums.length >= 2) {
            let sum: number[] = sumBaseThousand(newNums[0], newNums[1]);
            newNums.shift();
            newNums[0] = sum;
        }

        return newNums[0];
    }

    function multBaseThousand(num1: number[], num2: number[]): number[] {
        let allMultResults: number[][] = [];
        for (let i=BASE_THOUSAND_DIGITS-1; i>=0; i--) {
            let digit2: number = num2[i];
            let multResultsBT: number[][] = [];
            for (let j=BASE_THOUSAND_DIGITS-1; j>=0; j--) {
                let digit1: number = num1[j];
                let multDigit: number = digit2*Math.pow(1000,BASE_THOUSAND_DIGITS-i-1) * digit1*Math.pow(1000,BASE_THOUSAND_DIGITS-j-1);
                multResultsBT.push(convertToBaseThousand(multDigit));
            }
            // sum the results
            allMultResults.push(sumMultipleBaseThousand(multResultsBT));
        }

        return sumMultipleBaseThousand(allMultResults);
    }

    function modulusBaseThousand(numBT: number[], value: number): number {
        const modulus1k: number = 1000%value;
        let digitMods: number[] = [];
        for (let i=BASE_THOUSAND_DIGITS-1; i>=0; i--) {
            let currDigit: number = numBT[i];
            let digitPowerModulus: number = Math.pow(modulus1k, (BASE_THOUSAND_DIGITS-i-1));
            let digitModulus = currDigit*digitPowerModulus;
            digitMods.push(digitModulus);
        }

        let sumModuluses: number = 0;
        digitMods.forEach( (mod: number) => {
            sumModuluses += mod;
        } );

        if (sumModuluses==0) return 0;

        return (sumModuluses%value);
    }

    
    class Monkey {
        private id: number;
        private items: number[][];
        private operation: string[];
        private test: number[] = [];
        private itemInspectionCount: number;

        public constructor(
            id: number, startingItems: number[][], operation: string[], 
            testCondition: number, testTrue: number, testFalse: number 
        ) {
            this.id = id;
            this.items = startingItems;
            this.operation = operation;
            // divisible by:
            this.test.push(testCondition);
            // if true: throw to monkey with id:
            this.test.push(testTrue);
            // if false: throw to monkey with id:
            this.test.push(testFalse);
            this.itemInspectionCount = 0;
        }
    
        public getId(): number {return this.id;}
    
        public getItems(): number[][] {return this.items;}
    
        public getItemInspectionCount(): number {return this.itemInspectionCount;}
    
        public getFirstItem(): number[]|null {
            if (this.items.length > 0) {
                return this.items[0];
            } else {
                return null;
            }
        };
    
        public inspectItem(): number[] {
            console.log(`Monkey ${this.id} inspects the item with the worry level of ${this.items[0]}.`);
            let currItem: number[] = this.items[0];
            // parse operation
            let currOperation = this.operation;
            
            const op: string = currOperation[1].charAt(0);
            let num1: number[] = [];
            let num2: number[] = [];
            if (currOperation[0] === 'old') {
                num1 = currItem;
            } else {
                num1 = convertToBaseThousand(Number(currOperation[0]));
            }
            if (currOperation[2] === 'old') {
                num2 = currItem;
            } else {
                num2 = convertToBaseThousand(Number(currOperation[2]));
            }
            switch (op) {
                case '+':
                    //currItem = num1+num2;
                    currItem = sumBaseThousand(num1, num2);
                    break;
                case '*':
                    //currItem = num1*num2;
                    currItem = multBaseThousand(num1, num2);
                    break;
            }
            console.log(`The new worry level is ${currItem}`);
            // monkey is not bored!
            this.items[0] = currItem;
            
            this.itemInspectionCount += 1;
            return this.items[0];
        }
    
        public throwItem(): number {
            // remove the first element from the array (assuming it's not empty)
            let currItem: number[] = this.items.shift() as number[];
            // return the id of the monkey to throw
            //currItem % this.test[0]
            if (modulusBaseThousand(currItem, this.test[0]) == 0) {
                console.log(`Item with wl ${currItem} is thrown to monkey ${this.test[1]}`);
                return this.test[1];
            } else {
                console.log(`Item with wl ${currItem} is thrown to monkey ${this.test[2]}`);
                return this.test[2];
            }
        }
    
        public catchItem(item: number[]) {
            this.items.push(item);
            console.log(`Monkey ${this.id} catches the item with the wl ${item}`);
        }
    }

    function initializeMonkeys(monkeyDesc: string[]): Monkey[] {
        let monkeys: Monkey[] = [];

        monkeyDesc.forEach( (monkey: string) => {
            let currMonkeyDesc: string[][] = monkey.split('\n').map( (line: string) => {
                return line.split(' ');
            } );
            let currMonkey: Monkey = new Monkey(
                Number(currMonkeyDesc[0][1].replace(':', '')),
                currMonkeyDesc[1].slice(4)
                    .map( (str: string) => {return str.replace(',', '')} )
                    .map(Number)
                    .map( (num: number) => {
                        return convertToBaseThousand(num);
                    } ),
                currMonkeyDesc[2].slice(5),
                Number(currMonkeyDesc[3][5]),
                Number(currMonkeyDesc[4][9]),
                Number(currMonkeyDesc[5][9])
            );
            monkeys.push(currMonkey);
        } );

        return monkeys;
    }

    function executeARound(monkeys: Monkey[]) {
        monkeys.forEach( (monkey: Monkey) => {
            let firstItem: number[]|null = monkey.getFirstItem();
            // throw until no more items are left
            while (firstItem != null) {
                firstItem = monkey.inspectItem();
                monkeys[monkey.throwItem()].catchItem(firstItem);

                firstItem = monkey.getFirstItem();
            }
        } );
    }

    function calcMonkeyBusiness(monkeys: Monkey[]): number {
        console.log('\n\nCalculating monkey business...');
        let mostActive: number[] = [0, 0];
        monkeys.forEach( (monkey: Monkey) => {
            let currInspCount: number = monkey.getItemInspectionCount();
            if (currInspCount > mostActive[0]) {
                // biggest
                mostActive[1] = mostActive[0];
                mostActive[0] = currInspCount;
            } else if (currInspCount > mostActive[1]) {
                // second biggest
                mostActive[1] = currInspCount;
            }
        } );
        console.log(`Most active monkeys inspected items ${mostActive[0]} and ${mostActive[1]} times.`);

        return mostActive[0]*mostActive[1];
    }

    const monkeysDesc: string[] = input.split('\n\n');
    const monkeys: Monkey[] = initializeMonkeys(monkeysDesc);

    // 10.000 turns!
    for (let i=0; i<1; i++) {
        console.log(`################## ROUND ${i} ##################`);
        executeARound(monkeys);
    }
    const monkeyBusiness: number = calcMonkeyBusiness(monkeys);

    console.log(monkeyBusiness);
}
*/

//part01();
part02();
