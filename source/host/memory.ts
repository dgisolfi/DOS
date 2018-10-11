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

        public wipeSeg00() {
            for (let i = 0; i <= 255; i++) {
                this.memory.splice(i, 0, `00`);
            }
        }

        public wipeSeg01() {
            for (let i = 256; i <= 512; i++) {
                this.memory.splice(i, 0, `00`);
            }
        }

        public wipeSeg02() {
            for (let i = 513; i <= 768; i++) {
                this.memory.splice(i, 0, `00`);
            }
        }
    }
}