///<reference path="../globals.ts" />
/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */
var DOS;
(function (DOS) {
    var MemoryAccesor = /** @class */ (function () {
        function MemoryAccesor() {
        }
        MemoryAccesor.prototype.writeMem = function (code) {
            console.log(code);
        };
        return MemoryAccesor;
    }());
    DOS.MemoryAccesor = MemoryAccesor;
})(DOS || (DOS = {}));
