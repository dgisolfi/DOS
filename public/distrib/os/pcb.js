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
        };
        PCB.prototype.addProccess = function (proccess) {
            this.pcb[this.PIDcount] = proccess;
            this.PIDcount++;
            console.log(proccess);
            console.log(this.pcb);
        };
        return PCB;
    }());
    DOS.PCB = PCB;
})(DOS || (DOS = {}));
