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
            var registers = [];
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
            registers[0] = startIndex;
            registers[1] = memIndex;
            return registers;
        };
        return MemoryManager;
    }());
    DOS.MemoryManager = MemoryManager;
})(DOS || (DOS = {}));
