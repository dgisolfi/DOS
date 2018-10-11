///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

     module DOS {

        export class ProccessManager {
            public readyQueue: object;
            public runningQueue: object;
            public terminatedQueue: object;
            public runningPID: number;
            public pidCounter: number;

            constructor() {}
    
            public init() {
                this.readyQueue = {};
                this.runningQueue= {};
                this.terminatedQueue = {};
                this.runningPID = 0;
                this.pidCounter = 0;                
            }

            public createProcces(startIndex, memIndex): number {
                // Create a new proccess and add it to the PCB
                var proccess = new PCB(this.pidCounter, startIndex, memIndex);
                proccess.init();
                
                this.readyQueue[this.pidCounter] = proccess;
                this.pidCounter++;
    
                return proccess.pid;
            }

            public runProcess(pid) {
                // for now turn it on and let it go
                this.runningQueue[pid] = this.readyQueue[pid]
                this.runningPID  = pid;
                _CPU.isExecuting = true;
                delete this.readyQueue[pid];
               
            }
    
            public terminateProcess(pid) {
                _CPU.isExecuting = false;
                _StdOut.putText(`proccess ${pid} finished`);
                _StdOut.advanceLine();
                _StdOut.putText(`Turnaround Time ${this.runningQueue[pid].turnaroundTime} Cycles`);
                _StdOut.advanceLine();
                _StdOut.putText(`Wait Time ${this.runningQueue[pid].turnaroundTime} Cycles`);
                _StdOut.advanceLine();
                delete this.runningQueue[pid];
                
            }
    
            
        }
    }