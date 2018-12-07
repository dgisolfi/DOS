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
            var victim = Math.floor(Math.random() * Object.keys(_PCM.readyQueue).length) + 1;
            if (victim == pid) {
                return this.getVictim(pid);
            }
            return victim;
        };
        Swapper.prototype.swapProcess = function (diskPID) {
            // Move a victim to the Disk...
            var victimPID = this.getVictim(diskPID);
            // RollOut the victim
            var victim = _PCM.readyQueue[victimPID];
            console.log(victim);
            // get the victim's user code
            var victimCode = _MemoryAccessor.readMemoryBlock(victim);
            DOS.Control.hostLog("Roll Out on process:" + victimPID, "os");
            var outStatus = _krnDiskDriver.rollOut(victimCode);
            console.log(outStatus);
            _PCM.readyQueue[victimPID].location = "disk";
            _PCM.readyQueue[victimPID].tsb = outStatus[1];
            // get usercode from disk...
            // Call roll in to return userCode
            DOS.Control.hostLog("Roll In on process:" + diskPID, "os");
            var status = _krnDiskDriver.rollIn(_PCM.readyQueue[diskPID].tsb);
            if (status[0] == 1) {
                DOS.Control.hostLog("SWAP ERROR: " + status[2], "os");
                return [1];
            }
            var mem_status = _MemoryManager.loadInMem(status[1]);
            if (mem_status[0] = 0) {
                DOS.Control.hostLog("SWAP ERROR: Memory Full!", "os");
                return [1];
            }
            // update process
            _PCM.readyQueue[diskPID].base = mem_status[1];
            _PCM.readyQueue[diskPID].limit = mem_status[2];
            _PCM.readyQueue[diskPID].location = mem_status[3];
            return [0];
        };
        return Swapper;
    }());
    DOS.Swapper = Swapper;
})(DOS || (DOS = {}));
