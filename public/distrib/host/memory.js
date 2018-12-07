///<reference path="../globals.ts" />
/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */
var DOS;
(function (DOS) {
    var Memory = /** @class */ (function () {
        function Memory(memory, isSeg00Full, isSeg01Full, isSeg02Full
        // public isSeg00Full: boolean = true,
        // public isSeg01Full: boolean = true,
        // public isSeg02Full: boolean = true
        ) {
            if (memory === void 0) { memory = []; }
            if (isSeg00Full === void 0) { isSeg00Full = false; }
            if (isSeg01Full === void 0) { isSeg01Full = false; }
            if (isSeg02Full === void 0) { isSeg02Full = false; }
            this.memory = memory;
            this.isSeg00Full = isSeg00Full;
            this.isSeg01Full = isSeg01Full;
            this.isSeg02Full = isSeg02Full;
        }
        Memory.prototype.init = function () {
            this.memory = new Array();
            for (var i = 0; i <= 767; i++) {
                this.memory.push("00");
            }
        };
        return Memory;
    }());
    DOS.Memory = Memory;
})(DOS || (DOS = {}));
