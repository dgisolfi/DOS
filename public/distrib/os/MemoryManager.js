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
            var memIndex = 0;
            var endIndex = 0;
            // Find the first open segment of memory
            if (_MEM.isSeg00Full && _MEM.isSeg01Full && _MEM.isSeg02Full) {
                // Handle memory swapping
            }
            else if (!_MEM.isSeg00Full) {
                memIndex = 0;
                endIndex = 255;
            }
            else if (!_MEM.isSeg01Full) {
                memIndex = 256;
                endIndex = 512;
            }
            else if (!_MEM.isSeg02Full) {
                memIndex = 513;
                endIndex = 768;
            }
            code.forEach(function (hex) {
                _MEM.memory[memIndex] = hex;
                console.log(_MEM.memory[memIndex]);
                memIndex++;
            });
            console.log(_MEM.memory);
        };
        return MemoryManager;
    }());
    DOS.MemoryManager = MemoryManager;
})(DOS || (DOS = {}));
