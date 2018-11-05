///<reference path="../globals.ts" />
/* ------------
   scheduler.ts
   ------------ */
var DOS;
(function (DOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
        }
        Scheduler.prototype.init = function () {
            this.scheduleMethod = "round robin";
            this.quantum = 6;
            this.cycle = 0;
        };
        Scheduler.prototype.checkCycle = function () {
            if ((this.cycle % this.quantum) == 0) {
                console.log("switch");
                return true;
            }
            else {
                return false;
            }
        };
        // 
        Scheduler.prototype.schedule = function () {
            if (this.scheduleMethod == "round robin") {
                // There are still more ready processes, call for context switch
                if (this.checkCycle() == true) {
                    // Are there any more ready programs
                    if (Object.keys(_PCM.readyQueue).length != 0) {
                        var pid = Object.keys(_PCM.readyQueue)[0];
                        this.contextSwitch(pid);
                    }
                }
            }
            // Update Process Stats
            _PCM.calcProcessStats();
            this.cycle++;
        };
        // store the state
        Scheduler.prototype.contextSwitch = function (pid) {
            DOS.Control.hostLog("context switch on process:" + pid, "os");
            // Save the state of the PCB
            _PCM.saveProcessState();
            _PCM.readyQueue[_PCM.runningprocess.pid] = _PCM.runningprocess;
            // take next process of the ready queue
            _PCM.execProcess(pid);
        };
        return Scheduler;
    }());
    DOS.Scheduler = Scheduler;
})(DOS || (DOS = {}));
