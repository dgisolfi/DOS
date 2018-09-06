/* ------------
   Interrupt.ts
   ------------ */
var DOS;
(function (DOS) {
    var Interrupt = /** @class */ (function () {
        function Interrupt(irq, params) {
            this.irq = irq;
            this.params = params;
        }
        return Interrupt;
    }());
    DOS.Interrupt = Interrupt;
})(DOS || (DOS = {}));
