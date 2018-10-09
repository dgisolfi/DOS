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
        MemoryAccessor.prototype.writeMem = function (code) {
            console.log(code);
        };
        return MemoryAccessor;
    }());
    DOS.MemoryAccessor = MemoryAccessor;
})(DOS || (DOS = {}));
