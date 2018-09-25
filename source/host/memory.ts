///<reference path="../globals.ts" />

/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */

module DOS {

    export class Memory {
        constructor(
            public memSeg00 = [],
            public memSeg00Full = false,
            public memSeg01 = [],
            public memSeg01Full = false,
            public memSeg02 = [],
            public memSeg02Full = false
            ) {
        }

        public init(): void {
            this.memSeg00 = [
                "00","00","00","00","00","00","00","00",
                "00","00","00","00","00","00","00","00",
                "00","00","00","00","00","00","00","00",
                "00","00","00","00","00","00","00","00"
            ]
            this.memSeg01 = [
                "00","00","00","00","00","00","00","00",
                "00","00","00","00","00","00","00","00",
                "00","00","00","00","00","00","00","00",
                "00","00","00","00","00","00","00","00"
            ]
            this.memSeg02 = [
                "00","00","00","00","00","00","00","00",
                "00","00","00","00","00","00","00","00",
                "00","00","00","00","00","00","00","00",
                "00","00","00","00","00","00","00","00"
            ]
        }

        public findFreeMem() {
            // Check if there is even room in memory..
            if (!this.memSeg00Full) {
                //Segment one is empty, use it
                return "00"
            } else if (!this.memSeg01Full) {
                //Segment two is empty, use it
                return "01"
            } else if (!this.memSeg02Full){
                //Segment three is empty, use it
                return "02"
                
            }
        }
    }
    
}