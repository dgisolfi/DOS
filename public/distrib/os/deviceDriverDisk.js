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
            var _this = 
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this) || this;
            _this.files = [];
            _this.driverEntry = _this.krnDiskDriverEntry;
            return _this;
        }
        DeviceDriverDisk.prototype.krnDiskDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            // More?
            this.createFile("fish");
        };
        DeviceDriverDisk.prototype.getBlock = function (TSB) {
            return sessionStorage.getItem(TSB);
        };
        DeviceDriverDisk.prototype.hexOfString = function (file_name) {
            var arr = [];
            file_name.split('').forEach(function (letter) {
                arr.push(letter.charCodeAt(0).toString(16));
            });
            return arr;
        };
        // Create a file, dont put nothin in it yet tho besides FCB stuff
        DeviceDriverDisk.prototype.createFile = function (file_name) {
            // Check if that file is already in use
            // Find a free set of blocks for the file
            // Write new file
            // Convert filename to a arrary of hex values
            var hex_name = this.hexOfString(file_name);
            // Fill the remaning block with 00's
            for (var i = 0; hex_name.length < (_DISK.blockSize); i++) {
                hex_name.push("00");
            }
            // Write the data to the session
            var fcb = new DOS.FCB("0:1:0", "0:1:0", "1", hex_name);
            sessionStorage.setItem(fcb.pointer, JSON.stringify(fcb));
            // Since TS is strict delete fcb will throw an error Instead, free
            // the contents of a variable so it can be garbage collected  
            fcb = null;
            return 0;
            // let str = ``
            // string.forEach(char => {
            //    str +=  String.fromCharCode(parseInt(char, 16))
            // });
        };
        DeviceDriverDisk.prototype.checkFileName = function (file_name) {
            // convert string to hex
            var hex_file = parseInt(file_name, 16);
            for (var track = 0; track < _DISK.tracks; track++) {
                for (var sector = 0; sector < _DISK.sectors; sector++) {
                    for (var block = 0; block < _DISK.blocks; block++) {
                        if (sector == 0 && block == 0) { // skip Master boot record
                            continue;
                        }
                        // build the pointer and get the block
                        var file_block = sessionStorage.getItem(track + ":" + sector + ":" + block);
                        // check blocks in use
                        if (file_block["freeBit"] != "0") {
                            console.log(hex_file, file_block["data"]);
                            // let name_data = 
                            // if (hex_file == ) {
                            //     return true;
                            // }
                        }
                        else {
                            return false;
                        }
                    }
                }
            }
        };
        return DeviceDriverDisk;
    }(DOS.DeviceDriver));
    DOS.DeviceDriverDisk = DeviceDriverDisk;
})(DOS || (DOS = {}));
