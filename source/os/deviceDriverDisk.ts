///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

   module DOS {

    // Extends DeviceDriver
    export class DeviceDriverDisk extends DeviceDriver {
        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            // More?
        }

        public getBlock(TSB:string):string {
            return sessionStorage.getItem(TSB)
        }

        private hexOfString(file_name: string):Array<string> {
            let arr = [];

            file_name.split('').forEach(letter => {
                arr.push(letter.charCodeAt(0).toString(16));
            });

            return arr
        }

        public checkFileName(file_name:string): [number, string]{ // yes i am returning a tuple, tuples are the best
            // convert string to hex
            for (let track = 0; track < _DISK.tracks; track++) {
                for (let sector = 0; sector < _DISK.sectors; sector++) {
                    for (let block = 0; block < _DISK.blocks; block++) {
                        if(track == 0 && sector == 0 && block == 0) { // skip Master boot record
                            continue;
                        }
                        // build the pointer and get the block
                        let file_block = JSON.parse(sessionStorage.getItem(`${track}:${sector}:${block}`));
                        // check blocks in use
                        if (file_block.freeBit != `0`) {
                            // Build the name from the memory and compare
                            let hex_name = ``
                            file_block.data.forEach(char => {
                                if (char != `00`) {
                                    hex_name +=  String.fromCharCode(parseInt(char, 16))
                                }
                            });
                            // Check for duplicate names
                            if (file_name == hex_name) {
                                let tsb = `${track}:${sector}:${block}`
                                return [0, tsb]; // already exists
                            } 
                          
                        }
                
                    }
                    
                }

            }
            return [1, `-1:-1:-1`];
        }   

        public getEmptyBlock():string {
            for (let track = 0; track < _DISK.tracks; track++) {
                for (let sector = 0; sector < _DISK.sectors; sector++) {
                    for (let block = 0; block < _DISK.blocks; block++) {
                        if(track == 0 && sector == 0 && block == 0) { // skip Master boot record
                            continue;
                        }
                        // build the pointer and get the block
                        let file_block = JSON.parse(sessionStorage.getItem(`${track}:${sector}:${block}`));
                        // return the first one
                        if (file_block.freeBit == `0`) {
                            return `${track}:${sector}:${block}`;
                        }
                    }
                }
            }
            // ERROR or full
            return `-1:-1:-1`
        }

        // Create a file, dont put nothin in it yet tho besides FCB stuff
        public createFile(file_name:string): number {
            // Check if that file is already in use
            if (this.checkFileName(file_name)[0] == 0) {
                return 1;
            }
            // Find a free set of blocks for the file
            let block_tsb = this.getEmptyBlock()
            if (block_tsb == `-1:-1:-1`) {
                return 2
            }

            // Write new file
            // Convert filename to a arrary of hex values
            let hex_name = this.hexOfString(file_name)
            // Fill the remaning block with 00's
            for (let i = 0; hex_name.length < (_DISK.blockSize); i++) {
                hex_name.push(`00`)
            }
            // Write the data to the session
            let fcb = new FCB(block_tsb, `0:0:0`, `1`, hex_name);
            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
            // Since TS is strict delete fcb will throw an error Instead, free
            // the contents of a variable so it can be garbage collected  
            fcb = null;
            return 0;
        }

        public readFile(file_name:string): [number, string] { // yes i am returning a tuple, tuples are the best
            // check if the file even exists
            let results = this.checkFileName(file_name)
            if (results[0] == 1){
                return [1, `file not found`] 
            }

            // build the pointer and get the block
            let file_block = JSON.parse(sessionStorage.getItem(results[1]));
            let hex_string = file_block.data

            // theres more blocks
            if (file_block.pointer != `0:0:0`) {
                let search = true;
                let next_block = file_block.pointer;
                while(search) {
                    let new_block = JSON.parse(sessionStorage.getItem(next_block));
                    hex_string += new_block.data

                    if (file_block.pointer == `0:0:0`) {
                        search = false;
                    }
                }
            }

            // finally wether 1 or n blocks long, make the data readable
            let decoded = ``
            hex_string.forEach(char => {
                decoded += String.fromCharCode(parseInt(char, 16))
            });
            return [0, decoded]
        }
    }
}