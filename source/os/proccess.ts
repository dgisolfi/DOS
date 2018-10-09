///<reference path="../globals.ts" />

/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

     module DOS {

        export class Proccess {
            public state:          String;      
            public turnaroundTime: Number;
            public waitTime:       Number;
           
            constructor( public pid,
                         public sRegister,
                         public eRegister) {

                this.state = "new";
                this.turnaroundTime = 0;
                this.waitTime = 0;
            }
        }
    }