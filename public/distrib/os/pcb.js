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
            this.curPID = 1000;
            this.state = "ready";
            this.PC = 0;
            this.Acc = 0;
            this.IR = "00";
            this.XReg = 0;
            this.YReg = 0;
            this.ZFlag = 0;
        };
        PCB.prototype.addProccess = function (proccess) {
            this.curPID = proccess.pid.toString();
            this.pcb[this.PIDcount] = proccess;
            this.PIDcount++;
            _StdOut.putText("Program load successful; <pid> " + proccess.pid + " created");
        };
        PCB.prototype.runProccess = function (pid) {
            _StdOut.putText("Running program with <pid> " + pid);
            this.state = "running";
        };
        PCB.prototype.terminateProcess = function (pid) {
            this.pcb[_CPU.runningPID].state = "terminated";
        };
        return PCB;
    }());
    DOS.PCB = PCB;
})(DOS || (DOS = {}));
