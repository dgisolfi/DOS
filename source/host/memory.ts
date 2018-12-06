///<reference path="../globals.ts" />

/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */

module DOS {

    export class Memory {

        constructor(
            public memory: string[] = [],
            // public isSeg00Full: boolean = false,
            // public isSeg01Full: boolean = false,
            // public isSeg02Full: boolean = false
            public isSeg00Full: boolean = true,
            public isSeg01Full: boolean = true,
            public isSeg02Full: boolean = true
            ){
        }
        
        public init(): void {
            this.memory = new Array<string>();
            for (let i = 0; i <= 767; i++) {
                this.memory.push(`00`);
            }
        }
    }
}