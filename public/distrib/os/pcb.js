///<reference path="../globals.ts" />
/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var PCB = /** @class */ (function () {
        function PCB(pid, base, limit, priority, location) {
            this.pid = pid;
            this.base = base;
            this.limit = limit;
            this.priority = priority;
            this.location = location;
        }
        PCB.prototype.init = function () {
            this.state = "resident";
            this.PC = 0;
            this.Acc = 0;
            this.IR = "00";
            this.XReg = 0;
            this.YReg = 0;
            this.ZFlag = 0;
            this.turnaroundTime = 0;
            this.waitTime = 0;
            this.tsb = "-1:-1:-1"; // location on disk
        };
        return PCB;
    }());
    DOS.PCB = PCB;
})(DOS || (DOS = {}));
