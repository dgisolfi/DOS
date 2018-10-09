///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

module DOS {

    export class PCB {
        constructor(
                public PIDcount = 0,
                public pcb = {}
            ) {
                
                
        }

        public init(): void {

        }

        public addProccess(proccess) {
            this.pcb[this.PIDcount] = proccess;
            this.PIDcount++;
            console.log(proccess);
            console.log(this.pcb);


        }

        // public createPCB(sRegister, eRegister) {
        //     var newPCB = {
        //         PID: (this.PIDcount + 1),
        //         state: "loaded",
        //         startRegister: sRegister,
        //         endRegister: eRegister,
        //         turnaroundTime: 0,
        //         waitTime: 0,
        //     } as pcb;
        //     console.log(newPCB)
        // }
    }
}