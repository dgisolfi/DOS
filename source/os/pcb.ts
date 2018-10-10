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
        public turnaroundTime: Number;
        public waitTime:       Number;
        constructor(
            public pid,
            public sRegister,
            public eRegister) {      
        }

        public init() {
            this.state = "ready"
            this.PC    = 0;
            this.Acc   = 0;
            this.IR    = "00";
            this.XReg  = 0;
            this.YReg  = 0;
            this.ZFlag = 0;

            
            // this.PIDcount++;
            
        }

        // public runProccess(pid) {
            
        //     this.state = "running";
        // }

        
    }
}