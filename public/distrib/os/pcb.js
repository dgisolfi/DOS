///<reference path="../globals.ts" />
/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var PCB = /** @class */ (function () {
        function PCB(pid, sRegister, eRegister) {
            this.pid = pid;
            this.sRegister = sRegister;
            this.eRegister = eRegister;
        }
        PCB.prototype.init = function () {
            this.state = "ready";
            this.PC = 0;
            this.Acc = 0;
            this.IR = "00";
            this.XReg = 0;
            this.YReg = 0;
            this.ZFlag = 0;
            // this.PIDcount++;
        };
        return PCB;
    }());
    DOS.PCB = PCB;
})(DOS || (DOS = {}));
