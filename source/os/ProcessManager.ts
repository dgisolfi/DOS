///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

     module DOS {

        export class ProcessManager {
            public pidCounter: number;
            public residentQueue: object;
            public readyQueue: object;
            public terminatedQueue: object;
            public runningprocess: DOS.PCB;

            public init() {
                this.pidCounter = 0; 
                this.residentQueue = {};         
                this.readyQueue = {};
                this.terminatedQueue = {};
               
                // create a initial instance to avoid errors
                this.runningprocess =  new PCB(-1,0,0, 0, `memory`);
                this.runningprocess.init();                    
            }

            public createProcces(startIndex, memIndex, priority, location, tsb): number {
                if (priority == undefined) {
                    priority = 0;
                }
                // Create a new process and add it to the PCB
                let process = new PCB(this.pidCounter, startIndex, memIndex, priority, location);
                process.init();

                if (process.location == `disk`) {
                    process.tsb = tsb;
                }
                
                this.residentQueue[this.pidCounter] = process;
                this.residentQueue[this.pidCounter].state = `resident`;
                this.pidCounter++;
                Control.hostLog(`Process:${process.pid} created`, `os`);
                return process.pid;
                
            }

            public execProcess(pid?:number):void {
                if (pid == undefined) {
                    pid = _SCHED.CycleQueue.dequeue()
                }

                // move a proccess from the Ready queue onto the CPU
                this.runningprocess = this.readyQueue[pid];
                delete this.readyQueue[pid];
                // Load the saved state of the process to the CPU
                this.loadProcessState();
                Control.hostLog(`Running Process:${pid}`, `os`);
                this.runningprocess.state = `running`;

                _CPU.isExecuting = true;
            }

            public runAll():void {
                // iterate through all resident processes and move them to the ready queue
                Object.keys(this.residentQueue).forEach(pid => {
                    this.readyQueue[pid] = this.residentQueue[pid];
                    delete this.residentQueue[pid];
                    this.readyQueue[pid].state = `ready`;   
                    _SCHED.CycleQueue.enqueue(pid);             
                });
                // Pull a ready process and begin running
                this.execProcess();
            }

            // Load the old process state onto the CPU
            public loadProcessState():void{
                _CPU.PC = this.runningprocess.PC;
                _CPU.IR = this.runningprocess.IR;
                _CPU.Acc = this.runningprocess.Acc;
                _CPU.Xreg = this.runningprocess.XReg;
                _CPU.Yreg = this.runningprocess.YReg;
                _CPU.Zflag = this.runningprocess.ZFlag;
            }

            // save the old process state into the PCB
            public saveProcessState():void {
                this.runningprocess.PC = _CPU.PC;
                this.runningprocess.Acc = _CPU.Acc;
                this.runningprocess.XReg = _CPU.Xreg; 
                this.runningprocess.YReg = _CPU.Yreg;
                this.runningprocess.ZFlag = _CPU.Zflag;
                if (this.runningprocess.state != `terminated`){
                    this.runningprocess.state = `ready`;
                }
                this.runningprocess.IR = _MemoryAccessor.readMemory(_CPU.PC);
            }

            public calcProcessStats():void {
                // update waittime
                Object.keys(this.readyQueue).forEach(process => {
                    this.readyQueue[process].waitTime++;
                    this.readyQueue[process].turnaroundTime++;
                });
                // update turnaround time
                this.runningprocess.turnaroundTime++;
            }
    
            public terminateProcess(pid) {
                // kill running process
                Control.hostLog(`Process:${pid} terminated`, `os`);

                _StdOut.advanceLine();
                _StdOut.putText(`process ${pid} finished`);
                _StdOut.advanceLine();
                _StdOut.putText(`Turnaround Time ${this.runningprocess.turnaroundTime} Cycles`);
                _StdOut.advanceLine();
                _StdOut.putText(`Wait Time ${this.runningprocess.waitTime} Cycles`);
                _StdOut.advanceLine();
                _OsShell.putPrompt();

               // reset the nessecary memory segment
                if (this.runningprocess.base === 0) {
                    _MemoryManager.wipeSeg00();
                } else if (this.runningprocess.base === 256) {
                    _MemoryManager.wipeSeg01();
                } else if (this.runningprocess.base === 513) {
                    _MemoryManager.wipeSeg02();
                }

                var processFound = false;

                Object.keys(this.residentQueue).forEach(curPid => {
                    if(curPid == pid) {
                        processFound = true;
                        this.terminatedQueue[pid] = this.residentQueue[pid]
                        this.terminatedQueue[pid].state = `terminated`;
                        delete this.residentQueue[pid];
                    }
                });
                if (!processFound){
                    Object.keys(this.readyQueue).forEach(curPid => {
                        if(curPid == pid) {
                            processFound = true;
                            this.terminatedQueue[pid] = this.readyQueue[pid]
                            this.terminatedQueue[pid].state = `terminated`;
                            delete this.readyQueue[pid];
                        }
                    });
                }

                if (!processFound){
                    Object.keys(this.terminatedQueue).forEach(curPid => {
                        if(curPid == pid) {
                            // its already terminated
                            processFound = true;

                        }
                    });
                }

                this.runningprocess.state = `terminated`;
                this.terminatedQueue[pid] = this.runningprocess;

                if (this.runningprocess.pid == pid && Object.keys(_PCM.readyQueue).length != 0){
                    this.execProcess();
                    
                } else if (Object.keys(_PCM.readyQueue).length == 0) {
                    _CPU.isExecuting = false;
                    this.runningprocess = new PCB(-1,0,0, 0,`memory`);
                    this.runningprocess.init();
                }
                
                if (processFound) {
                    Control.hostLog(`PID ${pid} terminated`,`os`)
                } else {
                    Control.hostLog(`ERROR ${pid} NOT FOUND`,`os`)
                }
            }
        }
    }