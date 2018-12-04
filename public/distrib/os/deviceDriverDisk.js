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
    var DeviceDriverDisk = /** @class */ (function (_super) {
        __extends(DeviceDriverDisk, _super);
        function DeviceDriverDisk() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this) || this;
            _this.driverEntry = _this.krnDiskDriverEntry;
            return _this;
        }
        DeviceDriverDisk.prototype.krnDiskDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            // More?
            this.createFile("test");
        };
        DeviceDriverDisk.prototype.getBlock = function (TSB) {
            return sessionStorage.getItem(TSB);
        };
        DeviceDriverDisk.prototype.createFile = function (file_name) {
            // if (!this.checkFileName()) {
            // }
            var data = [];
            for (var i = 0; i < 60; i++) {
                data[i] = 3;
            }
            sessionStorage.setItem("0:1:0", JSON.stringify(data));
        };
        DeviceDriverDisk.prototype.checkFileName = function (file_name, track_num) {
            for (var sector = 0; sector < _DISK.sectors; sector++) {
                for (var block = 0; block < _DISK.blocks; block++) {
                    if (sector == 0 && block == 0) { // check for Master boot record
                        continue;
                    }
                    // var TSB = `${track_num}:${sector}:${block}`;
                    // let  = JSON.parse(sessionStorage.getItem(TSB));
                }
            }
        };
        return DeviceDriverDisk;
    }(DOS.DeviceDriver));
    DOS.DeviceDriverDisk = DeviceDriverDisk;
})(DOS || (DOS = {}));
