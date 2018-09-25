///<reference path="../globals.ts" />
/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */
var DOS;
(function (DOS) {
    var Memory = /** @class */ (function () {
        function Memory(memSeg00, memSeg00Full, memSeg01, memSeg01Full, memSeg02, memSeg02Full) {
            if (memSeg00 === void 0) { memSeg00 = []; }
            if (memSeg00Full === void 0) { memSeg00Full = false; }
            if (memSeg01 === void 0) { memSeg01 = []; }
            if (memSeg01Full === void 0) { memSeg01Full = false; }
            if (memSeg02 === void 0) { memSeg02 = []; }
            if (memSeg02Full === void 0) { memSeg02Full = false; }
            this.memSeg00 = memSeg00;
            this.memSeg00Full = memSeg00Full;
            this.memSeg01 = memSeg01;
            this.memSeg01Full = memSeg01Full;
            this.memSeg02 = memSeg02;
            this.memSeg02Full = memSeg02Full;
        }
        Memory.prototype.init = function () {
            this.memSeg00 = [
                "00", "00", "00", "00", "00", "00", "00", "00",
                "00", "00", "00", "00", "00", "00", "00", "00",
                "00", "00", "00", "00", "00", "00", "00", "00",
                "00", "00", "00", "00", "00", "00", "00", "00"
            ];
            this.memSeg01 = [
                "00", "00", "00", "00", "00", "00", "00", "00",
                "00", "00", "00", "00", "00", "00", "00", "00",
                "00", "00", "00", "00", "00", "00", "00", "00",
                "00", "00", "00", "00", "00", "00", "00", "00"
            ];
            this.memSeg02 = [
                "00", "00", "00", "00", "00", "00", "00", "00",
                "00", "00", "00", "00", "00", "00", "00", "00",
                "00", "00", "00", "00", "00", "00", "00", "00",
                "00", "00", "00", "00", "00", "00", "00", "00"
            ];
        };
        Memory.prototype.findFreeMem = function () {
            // Check if there is even room in memory..
            if (!this.memSeg00Full) {
                //Segment one is empty, use it
                return "00";
            }
            else if (!this.memSeg01Full) {
                //Segment two is empty, use it
                return "01";
            }
            else if (!this.memSeg02Full) {
                //Segment three is empty, use it
                return "02";
            }
        };
        return Memory;
    }());
    DOS.Memory = Memory;
})(DOS || (DOS = {}));
