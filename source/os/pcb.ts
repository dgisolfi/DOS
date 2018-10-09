///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

module DOS {

    export class PCB {
        public curPID: number;
        public state:  string;
        public PC:     number;
        public Acc:    number;
        public IR:     string;
        public XReg:   number;
        public YReg:   number;
        public ZFlag:  number;
        constructor(
                public PIDcount = 0,
                public pcb = {}) {    
        }

        public init() {
            this.curPID = 1000;
            this.state = "ready"
            this.PC    = 0;
            this.Acc   = 0;
            this.IR    = "00";
            this.XReg  = 0;
            this.YReg  = 0;
            this.ZFlag = 0;
        }

        public addProccess(proccess) {
            this.curPID = proccess.pid.toString();
            this.pcb[this.PIDcount] = proccess;
            this.PIDcount++;
            _StdOut.putText(`Program load successful; <pid> ${proccess.pid} created`);
            
        
        }

        public runProccess(pid) {
            _StdOut.putText(`Running program with <pid> ${pid}`);
            this.state = "running";
        }

        public terminateProcess(pid) {
            this.pcb[_CPU.runningPID].state = `terminated`;
        }
    }
}