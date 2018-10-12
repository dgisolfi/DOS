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
            public isSeg00Full: boolean = false,
            public isSeg01Full: boolean = false,
            public isSeg02Full: boolean = false
            ){
        }
        
        public init(): void {
            this.memory = new Array<string>();
            for (let i = 0; i <= 768; i++) {
                this.memory.push(`00`);
            }
        }
    }
}