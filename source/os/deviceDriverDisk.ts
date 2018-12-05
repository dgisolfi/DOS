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
        public file_names = [];
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

        public getBlock(TSB:string):DOS.FCB {
            return JSON.parse(sessionStorage.getItem(TSB));
        }

        public listFiles(): Array<String> {
            return this.file_names;
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
                        let file_block = this.getBlock(`${track}:${sector}:${block}`);
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
        public createFile(file_name:string): [number, string] {
            // Check if that file is already in use
            if (this.checkFileName(file_name)[0] == 0) {
                return [1, `file name already in use.`];
            }
            // Find a free set of blocks for the file
            let block_tsb = this.getEmptyBlock()
            if (block_tsb == `-1:-1:-1`) {
                return [1, `Disk full`]
            }

            // add file name to global list
            this.file_names.push(file_name);

            // Write new file
            // Convert filename to a arrary of hex values
            let hex_name = this.hexOfString(file_name)
            if (hex_name.length >= _DISK.blockSize) {
                return [1, `file name to long. (make it 30 or less chars)`]
            }
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
            return [0, `file written to disk`];
        }

        public writeFile(file_name:string, data: string): [number, string] {
            // check if the file even exists
            let results = this.checkFileName(file_name)
            if (results[0] == 1){
                return [1, `file not found`] 
            }
            // get rid of the quotes
            data = data.replace('\"','');
            // get a new block
            let block_tsb = this.getEmptyBlock()
            if (block_tsb == `-1:-1:-1`) {
                return [1, `Disk full`];
            }
            // get the file name block to give it a pointer
            let file_block = this.getBlock(results[1]);
            // set the file name block to the next block pointer
            let fcb = new FCB(results[1], block_tsb, `1`, file_block.data);
            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));             
            fcb = null;

            // Convert data into ascii then hex and get the array
            let hex_data = this.hexOfString(data);
         
            if (hex_data.length >= _DISK.blockSize) {
                let write = true;
                while(write) {

                }
            } else {
                // Fill the remaning block with 00's
                for (let i = 0; hex_data.length < (_DISK.blockSize); i++) {
                    hex_data.push(`00`)
                }
                // Write the data to the session
                let fcb = new FCB(block_tsb, `0:0:0`, `1`, hex_data);
                sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));             
                fcb = null;
            }

            return [0, "data written to disk."]
        }

        public readFile(file_name:string): [number, string] { // yes i am returning a tuple, tuples are the best
            // check if the file even exists
            let results = this.checkFileName(file_name)
            if (results[0] == 1){
                return [1, `file not found`] 
            }

            // build the pointer and get the block
            let file_block = this.getBlock(results[1]);
            let hex_string = file_block.data

            // theres more blocks
            if (file_block.pointer != `0:0:0`) {
                let search = true;
                let next_block = file_block.pointer;
                while(search) {
                    let new_block = this.getBlock(next_block);
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

        public delFile(file_name:string): [number, string] {
            let results = this.checkFileName(file_name)
            if (results[0] == 1){
                return [1, `file not found`] 
            }
            // remove file name from global list
            delete this.file_names[this.file_names.indexOf(file_name)]; 


            // build the pointer and get the block
            let file_block = JSON.parse(sessionStorage.getItem(results[1]));

            // create a new instance of a file block to re write it all.
            let fcb = new FCB(results[1], `0:0:0`, `0`, file_block.data);
            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
            fcb = null;
            return [0, `removed from disk`]
        }

        public formatDisk(method:string): number {
            if (method == `full`) {
                // why make it hard?...codes already there
                _DISK.init();
                return 0;
            } else if (method == `quick`) {
                for (let track = 0; track < _DISK.tracks; track++) {
                    for (let sector = 0; sector < _DISK.sectors; sector++) {
                        for (let block = 0; block < _DISK.blocks; block++) {
                            if(track == 0 && sector == 0 && block == 0) { // skip Master boot record
                                continue;
                            }
                            let tsb = `${track}:${sector}:${block}`
                            // build the pointer and get the block
                            let file_block = JSON.parse(sessionStorage.getItem(tsb));
                            // create a new instance of a file block to re write it all.
                            let fcb = new FCB(tsb, `0:0:0`, `0`, file_block.data);
                            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
                            fcb = null;
                        }
                    }
                }
                return 0;
            } else {
                return 1;
            }
        }
    }
}