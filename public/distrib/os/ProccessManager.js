///<reference path="../globals.ts" />
/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var ProccessManager = /** @class */ (function () {
        function ProccessManager() {
        }
        ProccessManager.prototype.init = function () {
            this.readyQueue = {};
            this.runningQueue = {};
            this.terminatedQueue = {};
            this.runningPID = 0;
            this.pidCounter = 0;
        };
        ProccessManager.prototype.createProcces = function (startIndex, memIndex) {
            // Create a new proccess and add it to the PCB
            var proccess = new DOS.PCB(this.pidCounter, startIndex, memIndex);
            proccess.init();
            this.readyQueue[this.pidCounter] = proccess;
            this.pidCounter++;
            return proccess.pid;
        };
        ProccessManager.prototype.runProcess = function (pid) {
            // for now turn it on and let it go
            this.runningQueue[pid] = this.readyQueue[pid];
            this.runningPID = pid;
            _CPU.isExecuting = true;
            delete this.readyQueue[pid];
        };
        ProccessManager.prototype.terminateProcess = function (pid) {
            _CPU.isExecuting = false;
            _StdOut.putText("proccess " + pid + " finished");
            _StdOut.advanceLine();
            _StdOut.putText("Turnaround Time " + this.runningQueue[pid].turnaroundTime + " Cycles");
            _StdOut.advanceLine();
            _StdOut.putText("Wait Time " + this.runningQueue[pid].turnaroundTime + " Cycles");
            _StdOut.advanceLine();
            delete this.runningQueue[pid];
        };
        return ProccessManager;
    }());
    DOS.ProccessManager = ProccessManager;
})(DOS || (DOS = {}));
