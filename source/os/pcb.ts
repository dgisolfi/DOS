///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

module DOS {

    export class PCB {
        constructor(
            public PIDcount = 0) {
        }

        public init(): void {
            this.PIDcount = _CPU.readyQueue.length
            console.log("Initiate PID", this.PIDcount)

            interface pcb {
                PID: Number;
                state: String;
                startRegister: String;
                endRegister: String;
                turnaroundTime: Number;
                waitTime: Number; //cycles
            }
        }

        public createPCB(sRegister, eRegister) {
            var newPCB = {
                PID: (this.PIDcount + 1),
                state: "loaded",
                startRegister: sRegister,
                endRegister: eRegister,
                turnaroundTime: 0,
                waitTime: 0,
            }
        }
    }
}