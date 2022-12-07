import { readFileSync } from "fs";

const inputFile = 'input.txt';
const input: string = readFileSync(inputFile, 'utf-8').replace(/\r/g, '');

interface IFile {
    name: string,
    size: number
}

interface IDirectory {
    name: string,
    parent: IDirectory | null,
    files: IFile[],
    directories: IDirectory[],
    totalSize: number
}

function part01() {
    function getParent(directory: IDirectory): IDirectory | null {
        if (directory.parent === null) {
            return null;
        }

        return directory.parent;
    }

    function calculateDirSize(directory: IDirectory): number {
        let totalSize: number = 0;
        directory.directories.forEach( (subDir: IDirectory) => {
            totalSize += subDir.totalSize;
        } );
        directory.files.forEach( (file: IFile) => {
            totalSize += file.size;
        } );
        return totalSize;
    }
 
    function updateFilesystem(newDirectory: IDirectory): IDirectory {
        let parent: IDirectory|null = getParent(newDirectory);
        
        if (parent === null) {
            return newDirectory;
        } else {
            // update parents directories
            let newParent = parent;
            newParent.directories = parent.directories.map( (directory: IDirectory) => {
                if (directory.name === newDirectory.name) {
                    return newDirectory;
                } else {
                    return directory;
                }
            } );
            newParent.totalSize = calculateDirSize(newParent);

            return updateFilesystem(newParent);
        }
    }

    function getFilesystem(commands: string[]): IDirectory {
        let rootDir: IDirectory = {name: '/', parent: null, files: [], directories: [], totalSize: 0 };
        let currCommand: string[] = [];
        
        let currDirectory: IDirectory = rootDir;
        commands.forEach( (command: string) => {
            if (command.includes('$')) {
                // command
                currCommand = command.split(' ');
                if (currCommand[1] === 'cd') {
                    // change directory
                    if (currCommand[2] === '..') {
                        currDirectory = getParent(currDirectory) as IDirectory;
                    } else {
                        let newDir: IDirectory = currDirectory;
                        currDirectory.directories.forEach( (directory: IDirectory) => {
                            if (directory.name === currCommand[2]) {
                                newDir = directory;
                            }
                        } );
                        currDirectory = newDir;
                    }
                } else if (currCommand[1] === 'ls') {
                    // do nothing
                }
            } else {
                // listing
                currCommand = command.split(' ');
                if (currCommand[0] === 'dir') {
                    // find parent=currDirectory.name
                    // if dir doesnt exist, add it
                    let dirExists = false;
                    currDirectory.directories.forEach( (directory: IDirectory) => {
                        if (directory.name === currCommand[1]) {
                            dirExists = true;
                        }
                    } );
                    // add the directory
                    if (!dirExists) {
                        currDirectory.directories.push( 
                        {
                            name: currCommand[1],
                            parent: currDirectory,
                            files: [],
                            directories: [],
                            totalSize: 0 
                        } as IDirectory );
                    }
                } else {
                    // find parent=currDirectory.name
                    // if file doesnt exist, add it
                    let fileExists = false;
                    currDirectory.files.forEach( (file: IFile) => {
                        if (file.name === currCommand[1]) {
                            fileExists = true;
                        }
                    } );
                    // add the file
                    if (!fileExists) {
                        currDirectory.files.push( 
                        {
                            name: currCommand[1],
                            size: Number(currCommand[0])
                        } as IFile );
                        currDirectory.totalSize += Number(currCommand[0]);
                    }
                }
                // update the filesystem with the new currDirectory
                rootDir = updateFilesystem(currDirectory);

            }
        } );

        return rootDir;
    }

    function toStringDirectory(directory: IDirectory): string {
        let str: string = '';
        str += '.. -> ' + (directory.parent === null ? 'null' : directory.parent.name) + '\n';
        directory.files.forEach( (file: IFile) => {
            str += `${file.size} ${file.name}\n`;
        } );
        directory.directories.forEach( (directory: IDirectory) => {
            str += `dir ${directory.name}\n`;
        } );

        return(str);
    }

    function printFileSystem(rootDir: IDirectory): void {
        console.log(`${rootDir.name} (size: ${rootDir.totalSize}):\n` + toStringDirectory(rootDir));
        rootDir.directories.forEach( (directory: IDirectory) => {
            printFileSystem(directory);
        } );
    }

    function totalSizesLT100k(rootDir: IDirectory, currSize: number=0): number {
        let totalSize: number = currSize;

        if (rootDir.totalSize <= 100000) {
            totalSize += rootDir.totalSize;
        }
        rootDir.directories.forEach( (subDir: IDirectory) => {
            totalSize = totalSizesLT100k(subDir, totalSize);
        } );
        
        return totalSize;
    }

    const commands: string[] = input.split('\n');
    const rootDirectory: IDirectory = getFilesystem(commands);

    //printFileSystem(rootDirectory);
    console.log(`Total filtered size: ${totalSizesLT100k(rootDirectory, 0)}`);
}

function part02() {
    
}

part01();
//part02();
