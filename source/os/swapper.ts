///<reference path="../globals.ts" />

/* ------------
     fcb.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

     module DOS {
        export class Swapper {
            constructor() {      
            }

            public init() {
                // do stuffff
            }

            public swapProcess(diskPID:number, memPID?:number): [number] {
                // Move a victim to the Disk...
                
                // get usercode from disk...
                // Call roll in to return userCode
                Control.hostLog(`Roll In on process:${diskPID}`, `os`);
                let status = _krnDiskDriver.rollIn(_PCM.readyQueue[diskPID].tsb);
                console.log(status);

                // if (_MEM.isSeg00Full && _MEM.isSeg01Full && _MEM.isSeg02Full) {

                // }

                
                return [0]
            }
        }
    }