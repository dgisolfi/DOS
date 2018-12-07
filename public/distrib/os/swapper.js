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
        Swapper.prototype.swapProcess = function (diskPID, memPID) {
            // Move a victim to the Disk...
            // get usercode from disk...
            // Call roll in to return userCode
            DOS.Control.hostLog("Roll In on process:" + diskPID, "os");
            var status = _krnDiskDriver.rollIn(_PCM.readyQueue[diskPID].tsb);
            console.log(status);
            // if (_MEM.isSeg00Full && _MEM.isSeg01Full && _MEM.isSeg02Full) {
            // }
            return [0];
        };
        return Swapper;
    }());
    DOS.Swapper = Swapper;
})(DOS || (DOS = {}));
