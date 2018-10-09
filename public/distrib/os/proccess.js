///<reference path="../globals.ts" />
/* ------------
     pcs.ts

     Requires global.ts.

    Creates and stores all PCBs.
     ------------ */
var DOS;
(function (DOS) {
    var Proccess = /** @class */ (function () {
        function Proccess(pid, state, startRegister, endRegister, turnaroundTime, waitTime) {
            this.pid = pid;
            this.state = state;
            this.startRegister = startRegister;
            this.endRegister = endRegister;
            this.turnaroundTime = turnaroundTime;
            this.waitTime = waitTime;
        }
        return Proccess;
    }());
    DOS.Proccess = Proccess;
})(DOS || (DOS = {}));
