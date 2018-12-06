///<reference path="../globals.ts" />
/* ------------
     fcb.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var FCB = /** @class */ (function () {
        function FCB(tsb, pointer, inUse, data) {
            this.tsb = tsb;
            this.pointer = pointer;
            this.inUse = inUse;
            this.data = data;
        }
        return FCB;
    }());
    DOS.FCB = FCB;
})(DOS || (DOS = {}));
