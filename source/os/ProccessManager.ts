///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

     module DOS {

        export class ProccessManager {
            public pidCounter: number;
            public readyQueue: object;
            public terminatedQueue: object;
            public runningProccess: DOS.PCB;

            constructor() {}
    
            public init() {
                this.pidCounter = 0;          
                this.readyQueue = {};
                this.terminatedQueue = {};
                // create a initial instance to avoid errors
                this.runningProccess =  new PCB(10000,0,0);
                this.runningProccess.init();                    
            }

            public createProcces(startIndex, memIndex): number {
                // Create a new proccess and add it to the PCB
                let proccess = new PCB(this.pidCounter, startIndex, memIndex);
                proccess.init();
                
                this.readyQueue[this.pidCounter] = proccess;
                this.readyQueue[this.pidCounter].state = `ready`;
                this.pidCounter++;
                return proccess.pid;
            }

            public runProcess(pid) {
                _CPU.init();
                // for now turn it on and let it go
                this.runningProccess = this.readyQueue[pid]
                this.runningProccess.state = `running`
                _CPU.isExecuting = true;
                delete this.readyQueue[pid];
            }
    
            public terminateProcess(pid) {
                _CPU.isExecuting = false;
                _StdOut.advanceLine();
                _StdOut.putText(`proccess ${pid} finished`);
                _StdOut.advanceLine();
                _StdOut.putText(`Turnaround Time ${this.runningProccess.turnaroundTime} Cycles`);
                _StdOut.advanceLine();
                _StdOut.putText(`Wait Time ${this.runningProccess.waitTime} Cycles`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();

                if (this.runningProccess.sRegister === 0) {
                    _MemoryManager.wipeSeg00();
                } else if (this.runningProccess.sRegister === 256) {
                    _MemoryManager.wipeSeg01();
                } else if (this.runningProccess.sRegister === 513) {
                    _MemoryManager.wipeSeg02();
                }
                

                // Move to the the terminated queue
                this.terminatedQueue[pid] = this.runningProccess;
                this.runningProccess.state = `terminated`;
            } 
        }
    }