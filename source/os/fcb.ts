///<reference path="../globals.ts" />

/* ------------
     fcb.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */

     module DOS {
        export class FCB {
            constructor(
                public tsb,
                public pointer,
                public freeBit,
                public data
                ) {      
            }
        }
    }