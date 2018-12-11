///<reference path="../globals.ts" />
/* ------------
     fcb.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var Swapper = /** @class */ (function () {
        function Swapper() {
        }
        Swapper.prototype.init = function () {
            // do stuffff
        };
        Swapper.prototype.getVictim = function (pid) {
            var keys = Object.keys(_PCM.readyQueue);
            var rand_key = keys[Math.floor(Math.random() * keys.length)];
            var victim = parseInt(rand_key, 10);
            return victim;
        };
        Swapper.prototype.swapProcess = function (diskPID) {
            // Move a victim to the Disk...
            var victimPID = this.getVictim(diskPID);
            if (victimPID == diskPID) {
                var getRand = true;
                while (getRand) {
                    victimPID = this.getVictim(diskPID);
                    if (victimPID != diskPID) {
                        getRand = false;
                    }
                }
            }
            // RollOut the victim
            var victim = _PCM.readyQueue[victimPID];
            // console.log(`${victim.pid} => Disk | ${diskPID} => Mem`)
            // console.log(victim.pid, victim.state)
            // get the victim's user code
            var victimCode = _MemoryAccessor.readMemoryBlock(victim);
            DOS.Control.hostLog("Roll Out on process:" + victimPID, "os");
            var outStatus = _krnDiskDriver.rollOut(victim.pid, victimCode);
            _PCM.readyQueue[victimPID].location = "disk";
            _PCM.readyQueue[victimPID].tsb = outStatus[1];
            // Free the memory 
            if (victim.base == 0) {
                _MEM.isSeg00Full = false;
                _MemoryManager.wipeSeg00();
            }
            else if (victim.base == 256) {
                _MEM.isSeg01Full = false;
                _MemoryManager.wipeSeg01();
            }
            else if (victim.base == 512) {
                _MEM.isSeg02Full = false;
                _MemoryManager.wipeSeg02();
            }
            // get usercode from disk...
            // Call roll in to return userCode
            DOS.Control.hostLog("Roll In on process:" + diskPID, "os");
            console.log(diskPID);
            var status = _krnDiskDriver.rollIn(_PCM.readyQueue[diskPID].tsb);
            if (status[0] == 1) {
                DOS.Control.hostLog("SWAP ERROR: " + status[2], "os");
                return [1];
            }
            var mem_status = _MemoryManager.loadInMem(status[1]);
            if (mem_status[0] == 1) {
                DOS.Control.hostLog("SWAP ERROR: Memory Full!", "os");
                return [1];
            }
            // update process
            _PCM.readyQueue[diskPID].base = mem_status[1];
            _PCM.readyQueue[diskPID].limit = mem_status[2];
            _PCM.readyQueue[diskPID].location = mem_status[3];
            // console.log(_PCM.readyQueue[diskPID])
            return [0];
        };
        return Swapper;
    }());
    DOS.Swapper = Swapper;
})(DOS || (DOS = {}));
