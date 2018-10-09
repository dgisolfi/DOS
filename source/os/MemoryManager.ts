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
                var memIndex = 0;
                var endIndex = 0; 
                // Find the first open segment of memory
                if (_MEM.isSeg00Full && _MEM.isSeg01Full && _MEM.isSeg02Full) {
                    // Handle memory swapping
                }else if (!_MEM.isSeg00Full) {
                    memIndex = 0;
                    endIndex = 255;

                } else if (!_MEM.isSeg01Full) {
                    memIndex = 256;
                    endIndex = 512;

                } else if (!_MEM.isSeg02Full) {
                    memIndex = 513;
                    endIndex = 768;
                }

                code.forEach(hex => {
                    _MEM.memory[memIndex] = hex;
                    console.log(_MEM.memory[memIndex]);
                    memIndex++;
                });
                console.log(_MEM.memory);
            }
        }
    
    }