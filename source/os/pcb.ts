///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

module DOS {

    export class PCB {
        public state:  string;
        public PC:     number;
        public Acc:    number;
        public IR:     string;
        public XReg:   number;
        public YReg:   number;
        public ZFlag:  number;
        public turnaroundTime: number;
        public waitTime: number;
        constructor(
            public pid,
            public sRegister,
            public eRegister) {      
        }

        public init() {
            this.state = "new"
            this.PC    = 0;
            this.Acc   = 0;
            this.IR    = "00";
            this.XReg  = 0;
            this.YReg  = 0;
            this.ZFlag = 0;
            this.turnaroundTime = 0;
            this.waitTime = 0;
            
        }

        // public runProccess(pid) {
            
        //     this.state = "running";
        // }

        
    }
}