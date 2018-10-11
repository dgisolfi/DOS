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
            var hex_location = _PCM.runningQueue[_PCM.runningPID].sRegister + pc;
            return (_MEM.memory[hex_location]);
        };
        MemoryAccessor.prototype.writeMemory = function (address, data) {
            var hex_location = _PCM.runningQueue[_PCM.runningPID].sRegister + address;
            _MEM.memory[hex_location] = data;
        };
        return MemoryAccessor;
    }());
    DOS.MemoryAccessor = MemoryAccessor;
})(DOS || (DOS = {}));
