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
            // The code below cannot run because `this` can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnDiskDriverEntry;
        }

        public krnDiskDriverEntry() {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = `loaded`;
            _Console.updateDisk();
            // More?
        }

        public getBlock(TSB:string):DOS.FCB {
            return JSON.parse(sessionStorage.getItem(TSB));
        }

        public listFiles(): Array<String> {
            return this.file_names;
        }

        private hexOfString(str: string):Array<string> {
            let arr = [];

            str.split('').forEach(letter => {
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
                        if (file_block.inUse != `0`) {
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

        public getEmptyBlock(skip_block:boolean):string {
            let next_block = true;
            if (skip_block) {
                next_block = false;
            }
            for (let track = 0; track < _DISK.tracks; track++) {
                for (let sector = 0; sector < _DISK.sectors; sector++) {
                    for (let block = 0; block < _DISK.blocks; block++) {
                        if(track == 0 && sector == 0 && block == 0) { // skip Master boot record
                            continue;
                        }
                        // build the pointer and get the block
                        let file_block = this.getBlock(`${track}:${sector}:${block}`);
                        // return the first one
                        if (file_block.inUse == `0`) {
                            if (next_block) {
                                return `${track}:${sector}:${block}`;
                            } else {
                                next_block = true;
                                continue
                            }
                        }
                    }
                }
            }
            // ERROR or full
            return `-1:-1:-1`
        }

        // Take a process and put it on the DISK
        // Autobots ROLL OUT!
        public rollOut(userCode:Array<String>): [number, string, string] {
            // Find a free set of blocks for the file
            let initial_block = this.getEmptyBlock(false)
            if (initial_block == `-1:-1:-1`) {
                return [1,`-1:-1:-1`, `Disk full`]
            }
           
            // 
            let block_data = [];
            let block = ``;
            userCode.forEach(hex => {
                block += hex
                if (block.length/2 == _DISK.blockSize) {
                    block_data.push(block)
                    block = ``;
                }
            });

            for (let i = 0; block.length/2 < _DISK.blockSize; i++) {
                block += `00`;
            }

            block_data.push(block)
            // block_data.reverse();
            let next_block_pointer = ``
            let file_pointer = this.getEmptyBlock(false);
            block_data.forEach(block => {
                // for first(or in reality last one block)
                let block_tsb = this.getEmptyBlock(false)
                if (block_tsb == `-1:-1:-1`) {
                    return [1, `Disk full`]
                }

                if (block == block_data[block_data.length-1]) {
                    next_block_pointer = `0:0:0`;
                } else {
                    next_block_pointer = this.getEmptyBlock(true)
                }

                let char = ``
                let new_block_data = [];
                block.split('').forEach(ch => {
                    char += ch;
                    if (char.length == 2) {
                        new_block_data.push(char)
                        char = ``;
                    }                
                });
                 
                // Write the data to the session
                let fcb = new FCB(block_tsb, next_block_pointer, `1`, new_block_data);
                sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));             
                fcb = null;                
            });
                        
            _Console.updateDisk();
            return [0, initial_block, `data written to disk.`]

        }

         // Take a process and put it on the DISK
        // Autobots ROLL IN?
        public rollIn(processTSB:string): [number, Array<String>, string] {
            let hex_code = [];

            let file_block = this.getBlock(processTSB)
            if (file_block.inUse == 0) {
                return [0, hex_code, `given block not valid, inUse bit = 0.`]
            }

            // theres more blocks
            if (file_block.pointer != `0:0:0`) {
                let search = true;
                var hex_blocks = [];
                let next_block = file_block.pointer;
                while(search) {
                    let new_block = this.getBlock(next_block);
                    hex_blocks.push(new_block.data);
                    next_block = new_block.pointer;

                    if (new_block.pointer == `0:0:0`) {
                        search = false;
                    }
                }

                hex_blocks.forEach(block => {
                    block.forEach(hex_char => {
                        hex_code.push(hex_char);
                    });
                });

            } else {
                hex_code = file_block.data;
            }

            if (hex_blocks.length == 0) {
                return [0, hex_code, `file empty`];
            }

            return [0, hex_code, `data retrieved to disk.`]
        }

        // Create a file, dont put nothin in it yet tho besides FCB stuff
        public createFile(file_name:string): [number, string] {
            // Check if that file is already in use
            if (this.checkFileName(file_name)[0] == 0) {
                return [1, `file name already in use.`];
            }
            // Find a free set of blocks for the file
            let block_tsb = this.getEmptyBlock(false)
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
            _Console.updateDisk();
            return [0, `file written to disk`];
        }

        public writeFile(file_name:string, data: string): [number, string] {
            // check if the file even exists
            let results = this.checkFileName(file_name)
            if (results[0] == 1){
                return [1, `file not found`] 
            }

            // get rid of the quotes
            data = data.split('`').join('');
            // Convert data into ascii then hex and get the array
            let hex_data = this.hexOfString(data);

            let block_data = [];
            let block = ``;
            hex_data.forEach(hex => {
                block += hex
                if (block.length == _DISK.blockSize) {
                    block_data.push(block)
                    block = ``;
                }
            });

            for (let i = 0; (block.length/2) < (_DISK.blockSize); i++) {
                block += `00`
            }

            block_data.push(block)
            // block_data.reverse();
            let next_block_pointer = ``
            let file_pointer = this.getEmptyBlock(false);
            block_data.forEach(block => {
                // for first(or in reality last one block)
                let block_tsb = this.getEmptyBlock(false)
                if (block_tsb == `-1:-1:-1`) {
                    return [1, `Disk full`]
                }

                if (block == block_data[block_data.length-1]) {
                    next_block_pointer = `0:0:0`;
                } else {
                    next_block_pointer = this.getEmptyBlock(true)
                }


                let char = ``
                let new_block_data = [];
                block.split('').forEach(ch => {
                    char += ch;
                    if (char.length == 2) {
                        new_block_data.push(char)
                        char = ``;
                    }                
                });
                 
                // Write the data to the session
                let fcb = new FCB(block_tsb, next_block_pointer, `1`, new_block_data);
                sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));             
                // console.log(`block: at ${block_tsb}: ${block}`, next_block_pointer);
                fcb = null;                
            });

            // get the file name block to give it a pointer
            let file_block = this.getBlock(results[1]);
            // set the file name block to the next block pointer
            let fcb = new FCB(results[1], file_pointer, `1`, file_block.data);
            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));             
            fcb = null;
            _Console.updateDisk();
            return [0, `data written to disk.`]
        }

        public readFile(file_name:string): [number, string] { // yes i am returning a tuple, tuples are the best
            // check if the file even exists
            let results = this.checkFileName(file_name)
            if (results[0] == 1){
                return [1, `file not found`] 
            }

            // build the pointer and get the block
            let file_block = this.getBlock(results[1]);
           
            // theres more blocks
            if (file_block.pointer != `0:0:0`) {
                let search = true;
                var hex_string = ``;
                let next_block = file_block.pointer;
                while(search) {
                    let new_block = this.getBlock(next_block);
                    hex_string += new_block.data;
                    next_block = new_block.pointer;

                    if (new_block.pointer == `0:0:0`) {
                        search = false;
                    }
                }
            } else{
                return [0, `file empty`];
            }

            if (hex_string.length == 0) {
                return [0, `file empty`];
            }

            // finally wether 1 or n blocks long, make the data readable
            let decoded = ``
            let hex_digit = ``
            hex_string.split('').forEach(char => {
                hex_digit += char;
                if (hex_digit.length == 2) {
                    decoded += String.fromCharCode(parseInt(hex_digit, 16));
                    hex_digit = ``;
                }                
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
            _Console.updateDisk();
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
                _Console.updateDisk();
                return 0;
            } else {
                return 1;
            }
        }
    }
}


