///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

     module DOS {

        export class Proccess {
           
            constructor(
                public pid: Number,
                public state: String,
                public startRegister: Number,
                public endRegister: Number,
                public turnaroundTime: Number,
                public waitTime: Number) {
            }
        }
    }