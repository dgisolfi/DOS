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
            if (hex_location > _PCM.runningprocess.limit) {
                // console.log(`Attempted access over limit ${hex_location} limit: ${_PCM.runningprocess.limit} `)
                hex_location = -256;
            }
            if (hex_location < _PCM.runningprocess.base) {
                hex_location = +256;
            }
            return (_MEM.memory[hex_location]);
        };
        MemoryAccessor.prototype.writeMemory = function (address, data) {
            var hex_location = (_PCM.runningprocess.base + address);
            if (hex_location > _PCM.runningprocess.limit) {
                hex_location = -256;
            }
            _MEM.memory[hex_location] = data;
        };
        return MemoryAccessor;
    }());
    DOS.MemoryAccessor = MemoryAccessor;
})(DOS || (DOS = {}));
