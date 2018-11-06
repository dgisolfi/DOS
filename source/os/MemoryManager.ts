///<reference path="../globals.ts" />

/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */

     module DOS {

        export class MemoryManager {
            constructor() {}
    
            public loadInMem(code) {
                var registers = [];
                var startIndex = 0;
                var endIndex = 0; 
                // Find the first open segment of memory
                 if (!_MEM.isSeg00Full) {
                    startIndex = 0;
                    endIndex = 255;
                    _MEM.isSeg00Full = true;

                } else if (!_MEM.isSeg01Full) {
                    startIndex = 256;
                    endIndex = 511;
                    _MEM.isSeg01Full = true;

                } else if (!_MEM.isSeg02Full) {
                    startIndex = 512;
                    endIndex = 767;
                    _MEM.isSeg02Full = true;

                } else {
                    // Handle memory swapping
                }

                var memIndex = startIndex;
                code.forEach(hex => {
                    _MEM.memory[memIndex] = hex;
                    memIndex++;
                });
                registers[0] = startIndex;
                registers[1] = endIndex; //memIndex;

                return registers;
                
            }

            public wipeSeg00() {
                for (let i = 0; i <= 255; i++) {
                    _MEM.memory[i] = `00`;
                    _MEM.isSeg00Full = false; 
                }
            }
    
            public wipeSeg01() {
                for (let i = 256; i <= 512; i++) {
                    _MEM.memory[i] = `00`;
                    _MEM.isSeg01Full = false;
                }
            }
    
            public wipeSeg02() {
                for (let i = 513; i <= 768; i++) {
                    _MEM.memory[i] = `00`;
                    _MEM.isSeg02Full = false;
                }
            }
        }
    }