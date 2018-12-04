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
            this.createFile(`test`);
        }

        public getBlock(TSB:string):string {
            return sessionStorage.getItem(TSB)
        }

        public createFile(file_name:String) {
            // if (!this.checkFileName()) {

            // }
            var data = [];
            for(var i=0; i< 60; i++){
               data[i] = 3;
            }

            sessionStorage.setItem(`0:1:0`, JSON.stringify(data));


        }


        public checkFileName(file_name:String, track_num: Number) {
            for (let sector = 0; sector < _DISK.sectors; sector++) {
                for (let block = 0; block < _DISK.blocks; block++) {
                    if(sector == 0 && block == 0) { // check for Master boot record
                        continue;
                    }

                    // var TSB = `${track_num}:${sector}:${block}`;
                    // let  = JSON.parse(sessionStorage.getItem(TSB));
                
                }
                
            }

        }

    }
}