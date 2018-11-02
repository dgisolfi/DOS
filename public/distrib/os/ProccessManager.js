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
            this.residentQueue = {};
            this.readyQueue = {};
            this.terminatedQueue = {};
            // create a initial instance to avoid errors
            this.runningProccess = new DOS.PCB(-1, 0, 0);
            this.runningProccess.init();
        };
        ProccessManager.prototype.createProcces = function (startIndex, memIndex) {
            // Create a new proccess and add it to the PCB
            var proccess = new DOS.PCB(this.pidCounter, startIndex, memIndex);
            proccess.init();
            this.residentQueue[this.pidCounter] = proccess;
            this.residentQueue[this.pidCounter].state = "resident";
            this.pidCounter++;
            return proccess.pid;
        };
        ProccessManager.prototype.runProcess = function (pid) {
            _CPU.init();
            // for now turn it on and let it go
            // put the resident proccess on the running queue
            this.readyQueue[pid] = this.residentQueue[pid];
            delete this.residentQueue[pid];
            this.readyQueue[pid].state = "ready";
            this.runningProccess = this.readyQueue[pid];
            delete this.readyQueue[pid];
            this.runningProccess.state = "running";
            // start executing
            _CPU.isExecuting = true;
        };
        ProccessManager.prototype.terminateProcess = function (pid) {
            // kill running proccess
            console.log(this.runningProccess.pid);
            if (this.runningProccess.pid == pid) {
                _CPU.isExecuting = false;
            }
            else {
                this.terminatedQueue[pid] = this.readyQueue[pid];
                delete this.readyQueue[pid];
            }
            _StdOut.advanceLine();
            _StdOut.putText("proccess " + pid + " finished");
            _StdOut.advanceLine();
            _StdOut.putText("Turnaround Time " + this.runningProccess.turnaroundTime + " Cycles");
            _StdOut.advanceLine();
            _StdOut.putText("Wait Time " + this.runningProccess.waitTime + " Cycles");
            _StdOut.advanceLine();
            // _OsShell.putPrompt();
            // THERE IS A REALLY ANNOYING ERROR HERE REFER TO ISSUE #
            if (this.runningProccess.base === 0) {
                _MemoryManager.wipeSeg00();
            }
            else if (this.runningProccess.base === 256) {
                _MemoryManager.wipeSeg01();
            }
            else if (this.runningProccess.base === 513) {
                _MemoryManager.wipeSeg02();
            }
            // Move to the the terminated queue
            this.terminatedQueue[pid] = this.runningProccess;
            this.terminatedQueue[pid].state = "terminated";
        };
        return ProccessManager;
    }());
    DOS.ProccessManager = ProccessManager;
})(DOS || (DOS = {}));
