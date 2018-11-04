///<reference path="../globals.ts" />
/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var processManager = /** @class */ (function () {
        function processManager() {
        }
        processManager.prototype.init = function () {
            this.pidCounter = 0;
            this.residentQueue = {};
            this.readyQueue = {};
            this.terminatedQueue = {};
            // create a initial instance to avoid errors
            this.runningprocess = new DOS.PCB(-1, 0, 0);
            this.runningprocess.init();
        };
        processManager.prototype.createProcces = function (startIndex, memIndex) {
            // Create a new process and add it to the PCB
            var process = new DOS.PCB(this.pidCounter, startIndex, memIndex);
            process.init();
            this.residentQueue[this.pidCounter] = process;
            this.residentQueue[this.pidCounter].state = "resident";
            this.pidCounter++;
            return process.pid;
        };
        processManager.prototype.runProcess = function () {
            // move a proccess from the Ready queue onto the CPU
            var pid = Object.keys(this.readyQueue)[0];
            this.runningprocess = this.readyQueue[pid];
            delete this.readyQueue[pid];
            // Load the saved state of the process to the CPU
            this.loadProcessState();
            this.runningprocess.state = "running";
            _CPU.isExecuting = true;
        };
        processManager.prototype.runAll = function () {
            var _this = this;
            Object.keys(this.residentQueue).forEach(function (pid) {
                _this.readyQueue[pid] = _this.residentQueue[pid];
                delete _this.residentQueue[pid];
                _this.readyQueue[pid].state = "ready";
            });
        };
        processManager.prototype.loadProcessState = function () {
            _CPU.PC = this.runningprocess.PC;
            _CPU.IR = this.runningprocess.IR;
            _CPU.Acc = this.runningprocess.Acc;
            _CPU.Xreg = this.runningprocess.XReg;
            _CPU.Yreg = this.runningprocess.YReg;
            _CPU.Zflag = this.runningprocess.ZFlag;
            // _CPU.turnaroundTime = this.runningprocess.turnaroundTime;
            // _CPU.waitTime = this.runningprocess.waitTime;
        };
        processManager.prototype.saveProcessState = function () {
            this.runningprocess.PC = _CPU.PC;
            this.runningprocess.Acc = _CPU.Acc;
            this.runningprocess.XReg = _CPU.Xreg;
            this.runningprocess.YReg = _CPU.Yreg;
            this.runningprocess.ZFlag = _CPU.Zflag;
            this.runningprocess.state = "Waiting";
            this.runningprocess.IR = _MemoryAccessor.readMemory(_CPU.PC);
            // this.runningprocess.turnaroundTime = _CPU.turnaroundTime;
            // this.runningprocess.waitTime =  _CPU.waitTime;
        };
        processManager.prototype.terminateProcess = function (pid) {
            // kill running process
            console.log(this.runningprocess.pid);
            if (this.runningprocess.pid == pid) {
                _CPU.isExecuting = false;
            }
            else {
                this.terminatedQueue[pid] = this.readyQueue[pid];
                delete this.readyQueue[pid];
            }
            _StdOut.advanceLine();
            _StdOut.putText("process " + pid + " finished");
            _StdOut.advanceLine();
            _StdOut.putText("Turnaround Time " + this.runningprocess.turnaroundTime + " Cycles");
            _StdOut.advanceLine();
            _StdOut.putText("Wait Time " + this.runningprocess.waitTime + " Cycles");
            _StdOut.advanceLine();
            // reset the nessecary memory segment
            if (this.runningprocess.base === 0) {
                _MemoryManager.wipeSeg00();
            }
            else if (this.runningprocess.base === 256) {
                _MemoryManager.wipeSeg01();
            }
            else if (this.runningprocess.base === 513) {
                _MemoryManager.wipeSeg02();
            }
            // Move to the the terminated queue
            this.terminatedQueue[pid] = this.runningprocess;
            this.terminatedQueue[pid].state = "terminated";
            this.runningprocess = new DOS.PCB(-1, 0, 0);
            this.runningprocess.init();
        };
        // scheduling stuffff
        processManager.prototype.getReadyProcess = function () {
            if (Object.keys(this.readyQueue).length != 0) {
            }
        };
        return processManager;
    }());
    DOS.processManager = processManager;
})(DOS || (DOS = {}));
