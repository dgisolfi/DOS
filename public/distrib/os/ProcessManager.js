///<reference path="../globals.ts" />
/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var ProcessManager = /** @class */ (function () {
        function ProcessManager() {
        }
        ProcessManager.prototype.init = function () {
            this.pidCounter = 0;
            this.residentQueue = {};
            this.readyQueue = {};
            this.terminatedQueue = {};
            // create a initial instance to avoid errors
            this.runningprocess = new DOS.PCB(-1, 0, 0);
            this.runningprocess.init();
        };
        ProcessManager.prototype.createProcces = function (startIndex, memIndex) {
            // Create a new process and add it to the PCB
            var process = new DOS.PCB(this.pidCounter, startIndex, memIndex);
            process.init();
            this.residentQueue[this.pidCounter] = process;
            this.residentQueue[this.pidCounter].state = "resident";
            this.pidCounter++;
            DOS.Control.hostLog("Process:" + process.pid + " created", "os");
            return process.pid;
        };
        ProcessManager.prototype.execProcess = function (pid) {
            if (pid == undefined) {
                pid = _SCHED.CycleQueue.dequeue();
            }
            // move a proccess from the Ready queue onto the CPU
            this.runningprocess = this.readyQueue[pid];
            delete this.readyQueue[pid];
            // Load the saved state of the process to the CPU
            this.loadProcessState();
            DOS.Control.hostLog("Running Process:" + pid, "os");
            this.runningprocess.state = "running";
            _CPU.isExecuting = true;
        };
        ProcessManager.prototype.runAll = function () {
            var _this = this;
            // iterate through all resident processes and move them to the ready queue
            Object.keys(this.residentQueue).forEach(function (pid) {
                _this.readyQueue[pid] = _this.residentQueue[pid];
                delete _this.residentQueue[pid];
                _this.readyQueue[pid].state = "ready";
                _SCHED.CycleQueue.enqueue(pid);
            });
            // Pull a ready process and begin running
            this.execProcess();
        };
        // Load the old process state onto the CPU
        ProcessManager.prototype.loadProcessState = function () {
            _CPU.PC = this.runningprocess.PC;
            _CPU.IR = this.runningprocess.IR;
            _CPU.Acc = this.runningprocess.Acc;
            _CPU.Xreg = this.runningprocess.XReg;
            _CPU.Yreg = this.runningprocess.YReg;
            _CPU.Zflag = this.runningprocess.ZFlag;
        };
        // save the old process state into the PCB
        ProcessManager.prototype.saveProcessState = function () {
            this.runningprocess.PC = _CPU.PC;
            this.runningprocess.Acc = _CPU.Acc;
            this.runningprocess.XReg = _CPU.Xreg;
            this.runningprocess.YReg = _CPU.Yreg;
            this.runningprocess.ZFlag = _CPU.Zflag;
            if (this.runningprocess.state != "terminated") {
                this.runningprocess.state = "ready";
            }
            this.runningprocess.IR = _MemoryAccessor.readMemory(_CPU.PC);
        };
        ProcessManager.prototype.calcProcessStats = function () {
            var _this = this;
            // update waittime
            Object.keys(this.readyQueue).forEach(function (process) {
                _this.readyQueue[process].waitTime++;
                _this.readyQueue[process].turnaroundTime++;
            });
            // update turnaround time
            this.runningprocess.turnaroundTime++;
        };
        ProcessManager.prototype.terminateProcess = function (pid) {
            var _this = this;
            // kill running process
            DOS.Control.hostLog("Process:" + pid + " terminated", "os");
            _StdOut.advanceLine();
            _StdOut.putText("process " + pid + " finished");
            _StdOut.advanceLine();
            _StdOut.putText("Turnaround Time " + this.runningprocess.turnaroundTime + " Cycles");
            _StdOut.advanceLine();
            _StdOut.putText("Wait Time " + this.runningprocess.waitTime + " Cycles");
            _StdOut.advanceLine();
            _OsShell.putPrompt();
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
            var processFound = false;
            Object.keys(this.residentQueue).forEach(function (curPid) {
                if (curPid == pid) {
                    processFound = true;
                    _this.terminatedQueue[pid] = _this.residentQueue[pid];
                    _this.terminatedQueue[pid].state = "terminated";
                    delete _this.residentQueue[pid];
                }
            });
            if (!processFound) {
                Object.keys(this.readyQueue).forEach(function (curPid) {
                    if (curPid == pid) {
                        processFound = true;
                        _this.terminatedQueue[pid] = _this.readyQueue[pid];
                        _this.terminatedQueue[pid].state = "terminated";
                        delete _this.readyQueue[pid];
                    }
                });
            }
            if (!processFound) {
                Object.keys(this.terminatedQueue).forEach(function (curPid) {
                    if (curPid == pid) {
                        // its already terminated
                        processFound = true;
                    }
                });
            }
            this.runningprocess.state = "terminated";
            this.terminatedQueue[pid] = this.runningprocess;
            if (this.runningprocess.pid == pid && Object.keys(_PCM.readyQueue).length != 0) {
                this.execProcess();
            }
            else if (Object.keys(_PCM.readyQueue).length == 0) {
                _CPU.isExecuting = false;
                this.runningprocess = new DOS.PCB(-1, 0, 0);
                this.runningprocess.init();
            }
            if (processFound) {
                DOS.Control.hostLog("PID " + pid + " terminated", "os");
            }
            else {
                DOS.Control.hostLog("ERROR " + pid + " NOT FOUND", "os");
            }
        };
        return ProcessManager;
    }());
    DOS.ProcessManager = ProcessManager;
})(DOS || (DOS = {}));
