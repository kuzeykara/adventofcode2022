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
    class Monkey {
        private id: number;
        private items: number[];
        private operation: string[];
        private test: number[] = [];
        private itemInspectionCount: number;
        private reduceConstant: number = 0;
    
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

        public setReduceConstant(constant: number): void {
            this.reduceConstant = constant;
        }

        public getTest(): number[] {return this.test;}
    
        public getItemInspectionCount(): number {return this.itemInspectionCount;}
    
        public getFirstItem(): number|null {
            if (this.items.length > 0) {
                return this.items[0];
            } else {
                return null;
            }
        };
    
        public inspectItem(): number {
            //console.log(`Monkey ${this.id} inspects the item with the worry level of ${this.items[0]}.`);
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
            //console.log(`The new worry level is ${currItem}`);
            // monkey is NOT bored
            this.items[0] = currItem % this.reduceConstant;
            //console.log(`I am bored with the item. New worry level is ${this.items[0]}`);
            
            this.itemInspectionCount += 1;
            return this.items[0];
        }
    
        public throwItem(): number {
            // remove the first element from the array (assuming it's not empty)
            let currItem: number = this.items.shift() as number;
            // return the id of the monkey to throw
            if (currItem % this.test[0] == 0) {
                //console.log(`Item with wl ${currItem} is thrown to monkey ${this.test[1]}`);
                return this.test[1];
            } else {
                //console.log(`Item with wl ${currItem} is thrown to monkey ${this.test[2]}`);
                return this.test[2];
            }
        }
    
        public catchItem(item: number) {
            this.items.push(item);
            //console.log(`Monkey ${this.id} catches the item with the wl ${item}`);
        }
    }

    function initializeMonkeys(monkeyDesc: string[]): Monkey[] {
        let monkeys: Monkey[] = [];
        let divisibleBy: number[] = [];

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
            divisibleBy.push(currMonkey.getTest()[0]);
        } );
        // calculate the reducing constant
        let constant: number = 1;
        divisibleBy.forEach( (num: number) => { constant *= num } );
        monkeys.forEach( (monkey: Monkey) =>  monkey.setReduceConstant(constant) )

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

    // 10.000 turns
    for (let i=0; i<10000; i++) {
        executeARound(monkeys);
    }
    const monkeyBusiness: number = calcMonkeyBusiness(monkeys);

    console.log(monkeyBusiness);
}

//part01();
part02();
