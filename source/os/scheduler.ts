///<reference path="../globals.ts" />

/* ------------
   scheduler.ts
   ------------ */

module DOS {
    export class Scheduler {
        public scheduleMethod: string;
        public quantum: number;
        public cycle: number;
        public CycleQueue = new Queue();

        public init() {
            this.scheduleMethod = "round robin";
            this.quantum = 6;
            this.cycle = 0;
        }

        public checkCycle():boolean{
            if (this.cycle == this.quantum || _PCM.runningprocess.state == `terminated`) {
                return true
            } else {
                return false
            }
        }
        // 
        public schedule():void {
            // Update Process Stats
            _PCM.calcProcessStats();
            if (this.scheduleMethod == `round robin`){
                // There are still more ready processes, call for context switch
                if (this.checkCycle() == true){
                    // Are there any more ready programs
                    if (Object.keys(_PCM.readyQueue).length != 0) {
                        _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, this.CycleQueue.dequeue()));
                        this.cycle = 0
                    }
                }
            }
            this.cycle++;
        }


        // store the state
        public contextSwitch(pid) {
            Control.hostLog(`context switch on process:${pid}`, `os`);
            // Save the state of the PCB
            _PCM.saveProcessState();

            if (_PCM.runningprocess.state != `terminated`) {
                this.CycleQueue.enqueue(_PCM.runningprocess.pid.toString())
            }
            _PCM.readyQueue[_PCM.runningprocess.pid] = _PCM.runningprocess
            
            // take next process off the ready queue
            _PCM.execProcess(pid);
        }
    }
}