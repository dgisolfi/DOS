///<reference path="../globals.ts" />
/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var PCB = /** @class */ (function () {
        function PCB(PIDcount) {
            if (PIDcount === void 0) { PIDcount = 0; }
            this.PIDcount = PIDcount;
        }
        PCB.prototype.init = function () {
            this.PIDcount = _CPU.readyQueue.length;
            console.log("Initiate PID", this.PIDcount);
        };
        PCB.prototype.createPCB = function (sRegister, eRegister) {
            var newPCB = {
                PID: (this.PIDcount + 1),
                state: "loaded",
                startRegister: sRegister,
                endRegister: eRegister,
                turnaroundTime: 0,
                waitTime: 0
            };
        };
        return PCB;
    }());
    DOS.PCB = PCB;
})(DOS || (DOS = {}));
