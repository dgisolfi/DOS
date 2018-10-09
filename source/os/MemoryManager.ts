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
                var startIndex = 0;
                var endIndex = 0; 
                // Find the first open segment of memory
                if (_MEM.isSeg00Full && _MEM.isSeg01Full && _MEM.isSeg02Full) {
                    // Handle memory swapping
                }else if (!_MEM.isSeg00Full) {
                    startIndex = 0;
                    endIndex = 255;

                } else if (!_MEM.isSeg01Full) {
                    startIndex = 256;
                    endIndex = 512;

                } else if (!_MEM.isSeg02Full) {
                    startIndex = 513;
                    endIndex = 768;
                }

                var memIndex = startIndex;
                code.forEach(hex => {
                    _MEM.memory[memIndex] = hex;
                    memIndex++;
                });

                // Create PCB
                var proccess = new Proccess(_PCB.PIDcount, "new", startIndex, memIndex - 1, 0, 0);
                _PCB.addProccess(proccess);
                
            }
        }
    }