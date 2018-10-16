///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var DOS;
(function (DOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = /** @class */ (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this) || this;
            _this.driverEntry = _this.krnKbdDriverEntry;
            _this.isr = _this.krnKbdDispatchKeyPress;
            return _this;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdGetSymbol = function (keyCode, isShifted) {
            var requested_symbol = "";
            if (isShifted) {
                console.log(keyCode);
                _shiftedSymbols.forEach(function (key) {
                    if (keyCode === key.KeyCode) {
                        requested_symbol = key.Symbol;
                    }
                });
            }
            else if (!isShifted) {
                _nonShiftedSymbols.forEach(function (key) {
                    if (keyCode === key.KeyCode) {
                        requested_symbol = key.Symbol;
                    }
                });
            }
            return requested_symbol;
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) || // A..Z
                ((keyCode >= 97) && (keyCode <= 123)) // a..z
            ) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode === 38) {
                _KernelInputQueue.enqueue("KeyUp");
            }
            else if (keyCode === 40) {
                _KernelInputQueue.enqueue("KeyDown");
            }
            else if (((keyCode >= 48) && (keyCode <= 57) && isShifted) || // digit symbols
                ((keyCode >= 186) && (keyCode <= 192)) || // punctuation
                ((keyCode >= 219) && (keyCode <= 222)) ||
                (keyCode === 59) || // somtimes the : and ; key
                (keyCode === 61) || // somtimes the = and + key
                (keyCode === 173) // somtimes the - and _ key
            ) {
                chr = this.krnKbdGetSymbol(keyCode, isShifted);
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57) && !isShifted) || // digits
                (keyCode == 32) || // space
                (keyCode == 13) || // enter
                (keyCode == 8) || // Delete
                (keyCode == 9) || // Tab
                (keyCode == 38) || // Up key
                (keyCode == 40)) { // Down key
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    }(DOS.DeviceDriver));
    DOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(DOS || (DOS = {}));
