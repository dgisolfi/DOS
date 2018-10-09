///<reference path="../globals.ts" />
/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */
var DOS;
(function (DOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.readMemory = function (pc) {
            var hex_location = _PCB.pcb[_CPU.runningPID].sRegister + pc;
            return (_MEM.memory[hex_location]);
        };
        MemoryAccessor.prototype.writeMemory = function () {
        };
        return MemoryAccessor;
    }());
    DOS.MemoryAccessor = MemoryAccessor;
})(DOS || (DOS = {}));
