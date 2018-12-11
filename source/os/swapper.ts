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
                let keys = Object.keys(_PCM.readyQueue)
                let rand_key = keys[Math.floor(Math.random()*keys.length)];
                let victim = parseInt(rand_key, 10);
                return victim
            }

            public swapProcess(diskPID:number): [number] {
                // Move a victim to the Disk...
                let victimPID = this.getVictim(diskPID);
                if (victimPID == diskPID) {
                    let getRand = true;
                    while(getRand) {
                        victimPID = this.getVictim(diskPID);
                        if (victimPID != diskPID) {
                            getRand = false;
                        }
                    }
                }
               
                
                // RollOut the victim
                let victim = _PCM.readyQueue[victimPID];
                // console.log(`${victim.pid} => Disk | ${diskPID} => Mem`)
                // console.log(victim.pid, victim.state)
                // get the victim's user code
                let base = 0
                let lim = 0
                switch (victim.base) {
                    case 0:
                        base = 0;
                        lim = 255; 
                        break;
                    case 256:
                        base = 256;
                        lim = 511; 
                        break;
                    case 512:
                        base = 512;
                        lim = 767; 
                        break;
                }

                let victimCode = _MemoryAccessor.readMemoryBlock(victim, base, lim)
                Control.hostLog(`Roll Out on process:${victimPID}`, `os`);
                let outStatus = _krnDiskDriver.rollOut(victim.pid, victimCode);
                _PCM.readyQueue[victimPID].location = `disk`;
                _PCM.readyQueue[victimPID].tsb = outStatus[1];
                // Free the memory 
                if (victim.base == 0) {
                    _MEM.isSeg00Full = false
                    _MemoryManager.wipeSeg00();
                } else if (victim.base == 256) {
                    _MEM.isSeg01Full = false
                    _MemoryManager.wipeSeg01();
                } else if (victim.base == 512) {
                    _MEM.isSeg02Full = false
                    _MemoryManager.wipeSeg02();
                }

                // get usercode from disk...
                // Call roll in to return userCode
                Control.hostLog(`Roll In on process:${diskPID}`, `os`);
                console.log(diskPID)
                let status = _krnDiskDriver.rollIn(_PCM.readyQueue[diskPID].tsb);
                if (status[0] == 1) {
                    Control.hostLog(`SWAP ERROR: ${status[2]}`, `os`);
                    return [1]
                }
                console.log(`TESTIT`, status[1])
                let mem_status = _MemoryManager.loadInMem(status[1]);
                if (mem_status[0] == 1) {
                    Control.hostLog(`SWAP ERROR: Memory Full!`, `os`);
                    return [1]
                }

                // update process
                _PCM.readyQueue[diskPID].base = mem_status[1];
                _PCM.readyQueue[diskPID].limit = mem_status[2];
                _PCM.readyQueue[diskPID].location = mem_status[3];
                // console.log(_PCM.readyQueue[diskPID])
                
                return [0]
            }
        }
    }