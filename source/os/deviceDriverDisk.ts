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
        public files = [];
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
            this.createFile("fish")
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

        // Create a file, dont put nothin in it yet tho besides FCB stuff
        public createFile(file_name:string): number {
            // Check if that file is already in use

            // Find a free set of blocks for the file

            // Write new file
           
            // Convert filename to a arrary of hex values
            let hex_name = this.hexOfString(file_name)
            // Fill the remaning block with 00's
            for (let i = 0; hex_name.length < (_DISK.blockSize); i++) {
                hex_name.push(`00`)
            }
            // Write the data to the session
            let fcb = new FCB(`0:1:0`, `0:1:0`, `1`, hex_name);
            sessionStorage.setItem(fcb.pointer, JSON.stringify(fcb));
            // Since TS is strict delete fcb will throw an error Instead, free
            // the contents of a variable so it can be garbage collected  
            fcb = null;
            return 0;
            
            // let str = ``
            // string.forEach(char => {
            //    str +=  String.fromCharCode(parseInt(char, 16))
            // });

        }

        public checkFileName(file_name:string): boolean {
            // convert string to hex
            var hex_file = parseInt(file_name, 16)
            for (let track = 0; track < _DISK.tracks; track++) {
                for (let sector = 0; sector < _DISK.sectors; sector++) {
                    for (let block = 0; block < _DISK.blocks; block++) {
                        if(sector == 0 && block == 0) { // skip Master boot record
                            continue;
                        }
                        // build the pointer and get the block
                        let file_block = sessionStorage.getItem(`${track}:${sector}:${block}`);
                        // check blocks in use
                        if (file_block[`freeBit`] != `0`) {
                            console.log(hex_file, file_block[`data`])
                            // let name_data = 
                            // if (hex_file == ) {
                            //     return true;
                            // }
                        } else {
                            return false;
                        }
                    
                    }
                    
                }

            }
        }   

    }
}