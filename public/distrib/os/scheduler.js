///<reference path="../globals.ts" />
/* ------------
   scheduler.ts
   ------------ */
var DOS;
(function (DOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
            this.CycleQueue = new DOS.Queue();
        }
        Scheduler.prototype.init = function () {
            this.scheduleMethod = "rr";
            this.quantum = 6;
            this.cycle = 0;
        };
        Scheduler.prototype.checkCycle = function () {
            if (this.cycle == this.quantum || _PCM.runningprocess.state == "terminated") {
                return true;
            }
            else {
                return false;
            }
        };
        // 
        Scheduler.prototype.schedule = function () {
            // Update Process Stats
            _PCM.calcProcessStats();
            if (this.scheduleMethod == "rr" || this.scheduleMethod == "fcfs") {
                // There are still more ready processes, call for context switch
                if (this.checkCycle() == true) {
                    // Are there any more ready programs
                    if (Object.keys(_PCM.readyQueue).length != 0) {
                        _KernelInterruptQueue.enqueue(new DOS.Interrupt(CONTEXT_SWITCH, this.CycleQueue.dequeue()));
                        this.cycle = 0;
                    }
                }
            }
            else if (this.scheduleMethod == "priority") {
            }
            this.cycle++;
        };
        // store the state
        Scheduler.prototype.contextSwitch = function (pid) {
            DOS.Control.hostLog("context switch on process:" + pid, "os");
            // Save the state of the PCB
            _PCM.saveProcessState();
            if (_PCM.runningprocess.state != "terminated") {
                this.CycleQueue.enqueue(_PCM.runningprocess.pid.toString());
            }
            // add running back to ready queue
            _PCM.readyQueue[_PCM.runningprocess.pid] = _PCM.runningprocess;
            // SWAPPING
            // check the location of the process
            if (_PCM.readyQueue[pid].location == "disk") {
                // AUTOBOTS ROLL OUT THIS PROCESS!
                _SWAP.swapProcess(pid);
            }
            // take next process off the ready queue
            _PCM.execProcess(pid);
        };
        return Scheduler;
    }());
    DOS.Scheduler = Scheduler;
})(DOS || (DOS = {}));
