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
        MemoryAccessor.prototype.readMemory = function (address) {
            var hex_location = (_PCM.runningprocess.base + address);
            this.enforceBoundaries(hex_location);
            return (_MEM.memory[hex_location]);
        };
        // returns all user code of a block
        MemoryAccessor.prototype.readMemoryBlock = function (process) {
            console.log(process);
            var hex_code = [];
            for (var i = process.base; i < process.limit; i++) {
                var num = (process.base + i);
                console.log(num);
                var hex = _MEM.memory[num];
                console.log(hex);
                hex_code.push(hex);
            }
            return hex_code;
        };
        MemoryAccessor.prototype.writeMemory = function (address, data) {
            var hex_location = (_PCM.runningprocess.base + address);
            this.enforceBoundaries(hex_location);
            _MEM.memory[hex_location] = data;
        };
        MemoryAccessor.prototype.enforceBoundaries = function (hex_location) {
            if (hex_location > _PCM.runningprocess.limit) {
                _KernelInterruptQueue.enqueue(new DOS.Interrupt(OUT_OF_BOUNDS, _PCM.runningprocess.pid));
            }
            if (hex_location < _PCM.runningprocess.base) {
                _KernelInterruptQueue.enqueue(new DOS.Interrupt(OUT_OF_BOUNDS, _PCM.runningprocess.pid));
            }
        };
        return MemoryAccessor;
    }());
    DOS.MemoryAccessor = MemoryAccessor;
})(DOS || (DOS = {}));
