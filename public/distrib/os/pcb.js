///<reference path="../globals.ts" />
/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var PCB = /** @class */ (function () {
        function PCB(PIDcount, pcb) {
            if (PIDcount === void 0) { PIDcount = 0; }
            if (pcb === void 0) { pcb = {}; }
            this.PIDcount = PIDcount;
            this.pcb = pcb;
        }
        PCB.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.IR = "00";
            this.XReg = 0;
            this.YReg = 0;
            this.ZFlag = 0;
        };
        PCB.prototype.addProccess = function (proccess) {
            this.pcb[this.PIDcount] = proccess;
            this.PIDcount++;
            _StdOut.putText("Program load successful; <pid> " + proccess.pid + " created");
        };
        return PCB;
    }());
    DOS.PCB = PCB;
})(DOS || (DOS = {}));
