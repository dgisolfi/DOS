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
            public getVictim(pid:number): number {
                let victim = Math.floor(Math.random() * Object.keys(_PCM.readyQueue).length) + 1
                if (victim == pid) {
                    return this.getVictim(pid);
                }
                return victim
            }

            public swapProcess(diskPID:number): [number] {
                // Move a victim to the Disk...
                let victimPID = this.getVictim(diskPID);
                
                // RollOut the victim
                let victim = _PCM.readyQueue[victimPID];
                console.log(victim)
                // get the victim's user code
                let victimCode = _MemoryAccessor.readMemoryBlock(victim)
                Control.hostLog(`Roll Out on process:${victimPID}`, `os`);
                let outStatus = _krnDiskDriver.rollOut(victimCode);
                console.log(outStatus);
                _PCM.readyQueue[victimPID].location = `disk`;
                _PCM.readyQueue[victimPID].tsb = outStatus[1];


                // get usercode from disk...
                // Call roll in to return userCode
                Control.hostLog(`Roll In on process:${diskPID}`, `os`);
                let status = _krnDiskDriver.rollIn(_PCM.readyQueue[diskPID].tsb);
                if (status[0] == 1) {
                    Control.hostLog(`SWAP ERROR: ${status[2]}`, `os`);
                    return [1]
                }
                let mem_status = _MemoryManager.loadInMem(status[1]);
                if (mem_status[0] = 0) {
                    Control.hostLog(`SWAP ERROR: Memory Full!`, `os`);
                    return [1]
                }

                // update process
                _PCM.readyQueue[diskPID].base = mem_status[1];
                _PCM.readyQueue[diskPID].limit = mem_status[2];
                _PCM.readyQueue[diskPID].location = mem_status[3];
                
                return [0]
            }
        }
    }