///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

     module DOS {

        export class processManager {
            public pidCounter: number;
            public residentQueue: object;
            public readyQueue: object;
            public terminatedQueue: object;
            public runningprocess: DOS.PCB;

            constructor() {}
    
            public init() {
                this.pidCounter = 0; 
                this.residentQueue = {};         
                this.readyQueue = {};
                this.terminatedQueue = {};
               
                // create a initial instance to avoid errors
                this.runningprocess =  new PCB(-1,0,0);
                this.runningprocess.init();                    
            }

            public createProcces(startIndex, memIndex): number {
                // Create a new process and add it to the PCB
                let process = new PCB(this.pidCounter, startIndex, memIndex);
                process.init();
                
                this.residentQueue[this.pidCounter] = process;
                this.residentQueue[this.pidCounter].state = `resident`;
                this.pidCounter++;
                return process.pid;
                
            }

            public runProcess():void {
                // move a proccess from the Ready queue onto the CPU
                var pid = Object.keys(this.readyQueue)[0]
                this.runningprocess = this.readyQueue[pid];
                delete this.readyQueue[pid];
                // Load the saved state of the process to the CPU
                this.loadProcessState();
                this.runningprocess.state = `running`;
                _CPU.isExecuting = true;

            }

            public runAll():void {
                Object.keys(this.residentQueue).forEach(pid => {
                    this.readyQueue[pid] = this.residentQueue[pid];
                    delete this.residentQueue[pid];
                    this.readyQueue[pid].state = `ready`;                
                });

            }

            public loadProcessState():void{
                _CPU.PC = this.runningprocess.PC;
                _CPU.IR = this.runningprocess.IR;
                _CPU.Acc = this.runningprocess.Acc;
                _CPU.Xreg = this.runningprocess.XReg;
                _CPU.Yreg = this.runningprocess.YReg;
                _CPU.Zflag = this.runningprocess.ZFlag;
                // _CPU.turnaroundTime = this.runningprocess.turnaroundTime;
                // _CPU.waitTime = this.runningprocess.waitTime;
            }

            public saveProcessState():void{
                this.runningprocess.PC = _CPU.PC;
                this.runningprocess.Acc = _CPU.Acc;
                this.runningprocess.XReg = _CPU.Xreg; 
                this.runningprocess.YReg = _CPU.Yreg;
                this.runningprocess.ZFlag = _CPU.Zflag;
                this.runningprocess.state = "Waiting";
                this.runningprocess.IR = _MemoryAccessor.readMemory(_CPU.PC);
                // this.runningprocess.turnaroundTime = _CPU.turnaroundTime;
                // this.runningprocess.waitTime =  _CPU.waitTime;
            }
    
            public terminateProcess(pid) {
                // kill running process
                console.log(this.runningprocess.pid)
                if (this.runningprocess.pid == pid) {
                    _CPU.isExecuting = false;
                    
                } else {
                    this.terminatedQueue[pid] = this.readyQueue[pid]
                    delete this.readyQueue[pid];
                }

                _StdOut.advanceLine();
                _StdOut.putText(`process ${pid} finished`);
                _StdOut.advanceLine();
                _StdOut.putText(`Turnaround Time ${this.runningprocess.turnaroundTime} Cycles`);
                _StdOut.advanceLine();
                _StdOut.putText(`Wait Time ${this.runningprocess.waitTime} Cycles`);
                _StdOut.advanceLine();
                

               // reset the nessecary memory segment
                if (this.runningprocess.base === 0) {
                    _MemoryManager.wipeSeg00();
                } else if (this.runningprocess.base === 256) {
                    _MemoryManager.wipeSeg01();
                } else if (this.runningprocess.base === 513) {
                    _MemoryManager.wipeSeg02();
                }
                

                // Move to the the terminated queue
                this.terminatedQueue[pid] = this.runningprocess;
                this.terminatedQueue[pid].state = `terminated`;
                this.runningprocess =  new PCB(-1,0,0);
                this.runningprocess.init();  

            }


            // scheduling stuffff
            public getReadyProcess() {
                if (Object.keys(this.readyQueue).length != 0) {

                }
            }
        }
    }