///<reference path="../globals.ts" />
/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var Proccess = /** @class */ (function () {
        function Proccess(pid, sRegister, eRegister) {
            this.pid = pid;
            this.sRegister = sRegister;
            this.eRegister = eRegister;
            this.state = "new";
            this.turnaroundTime = 0;
            this.waitTime = 0;
        }
        return Proccess;
    }());
    DOS.Proccess = Proccess;
})(DOS || (DOS = {}));
