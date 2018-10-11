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
            this.pidCounter = 0;
            this.readyQueue = {};
            this.terminatedQueue = {};
            // create a initial instance to avoid errors
            this.runningProccess = new DOS.PCB(10000, 0, 0);
            this.runningProccess.init();
        };
        ProccessManager.prototype.createProcces = function (startIndex, memIndex) {
            // Create a new proccess and add it to the PCB
            var proccess = new DOS.PCB(this.pidCounter, startIndex, memIndex);
            proccess.init();
            this.readyQueue[this.pidCounter] = proccess;
            this.readyQueue[this.pidCounter].state = "ready";
            this.pidCounter++;
            return proccess.pid;
        };
        ProccessManager.prototype.runProcess = function (pid) {
            // for now turn it on and let it go
            this.runningProccess = this.readyQueue[pid];
            this.runningProccess.state = "running";
            _CPU.isExecuting = true;
            delete this.readyQueue[pid];
        };
        ProccessManager.prototype.terminateProcess = function (pid) {
            _CPU.isExecuting = false;
            _StdOut.advanceLine();
            _StdOut.putText("proccess " + pid + " finished");
            _StdOut.advanceLine();
            _StdOut.putText("Turnaround Time " + this.runningProccess.turnaroundTime + " Cycles");
            _StdOut.advanceLine();
            _StdOut.putText("Wait Time " + this.runningProccess.waitTime + " Cycles");
            _StdOut.advanceLine();
            _OsShell.putPrompt();
            if (this.runningProccess.sRegister === 0) {
                _MEM.wipeSeg00();
            }
            else if (this.runningProccess.sRegister === 256) {
                _MEM.wipeSeg01();
            }
            else if (this.runningProccess.sRegister === 513) {
                _MEM.wipeSeg02();
            }
            // Move to the the terminated queue
            this.terminatedQueue[pid] = this.runningProccess;
            this.runningProccess.state = "terminated";
            console.log(this.runningProccess);
        };
        return ProccessManager;
    }());
    DOS.ProccessManager = ProccessManager;
})(DOS || (DOS = {}));
