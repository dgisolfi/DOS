/* ------------
   scheduler.ts
   ------------ */
var DOS;
(function (DOS) {
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
        }
        Scheduler.prototype.init = function () {
            this.scheduleMethod = "round robin";
            this.quantum = 6;
            this.cylce = 0;
        };
        Scheduler.prototype.checkCycle = function () {
        };
        // 
        Scheduler.prototype.schedule = function () {
        };
        // store the state
        Scheduler.prototype.contextSwitch = function () {
        };
        return Scheduler;
    }());
    DOS.Scheduler = Scheduler;
})(DOS || (DOS = {}));
