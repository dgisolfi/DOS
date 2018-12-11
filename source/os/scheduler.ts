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
            this.scheduleMethod = `rr`;
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
            if (this.scheduleMethod == `rr` || this.scheduleMethod == `fcfs`){
                // There are still more ready processes, call for context switch
                if (this.checkCycle() == true){
                    // Are there any more ready programs
                    if (Object.keys(_PCM.readyQueue).length != 0) {
                        _KernelInterruptQueue.enqueue(new Interrupt(CONTEXT_SWITCH, this.CycleQueue.dequeue()));
                        this.cycle = 0
                    }
                }
            } else if (this.scheduleMethod == `priority`) {
                Object.keys(_PCM.readyQueue).forEach(element => {
                    
                });

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
            // add running back to ready queue
            _PCM.readyQueue[_PCM.runningprocess.pid] = _PCM.runningprocess

            // SWAPPING
            // check the location of the process
            if (_PCM.readyQueue[pid].location == `disk`) {
                // AUTOBOTS ROLL OUT THIS PROCESS!
                _SWAP.swapProcess(pid);
            }
            
            // take next process off the ready queue
            _PCM.execProcess(pid);
        }
    }
}