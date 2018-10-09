///<reference path="../globals.ts" />
/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */
var DOS;
(function (DOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.loadInMem = function (code) {
            var startIndex = 0;
            var endIndex = 0;
            // Find the first open segment of memory
            if (!_MEM.isSeg00Full) {
                startIndex = 0;
                endIndex = 255;
                _MEM.isSeg00Full = true;
            }
            else if (!_MEM.isSeg01Full) {
                startIndex = 256;
                endIndex = 512;
                _MEM.isSeg01Full = true;
            }
            else if (!_MEM.isSeg02Full) {
                startIndex = 513;
                endIndex = 768;
                _MEM.isSeg02Full = true;
            }
            else {
                // Handle memory swapping
            }
            var memIndex = startIndex;
            code.forEach(function (hex) {
                _MEM.memory[memIndex] = hex;
                memIndex++;
            });
            // Create a new proccess and add it to the PCB
            var proccess = new DOS.Proccess(_PCB.PIDcount, startIndex, memIndex);
            _PCB.addProccess(proccess);
            console.log(_MEM.memory);
        };
        return MemoryManager;
    }());
    DOS.MemoryManager = MemoryManager;
})(DOS || (DOS = {}));
