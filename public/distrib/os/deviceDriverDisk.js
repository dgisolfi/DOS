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
            _this.driverEntry = _this.krnDiskDriverEntry;
            return _this;
        }
        DeviceDriverDisk.prototype.krnDiskDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            // More?
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
        DeviceDriverDisk.prototype.checkFileName = function (file_name) {
            // convert string to hex
            for (var track = 0; track < _DISK.tracks; track++) {
                for (var sector = 0; sector < _DISK.sectors; sector++) {
                    var _loop_1 = function (block) {
                        if (track == 0 && sector == 0 && block == 0) { // skip Master boot record
                            return "continue";
                        }
                        // build the pointer and get the block
                        var file_block = JSON.parse(sessionStorage.getItem(track + ":" + sector + ":" + block));
                        // check blocks in use
                        if (file_block.freeBit != "0") {
                            // Build the name from the memory and compare
                            var hex_name_1 = "";
                            file_block.data.forEach(function (char) {
                                if (char != "00") {
                                    hex_name_1 += String.fromCharCode(parseInt(char, 16));
                                }
                            });
                            // Check for duplicate names
                            if (file_name == hex_name_1) {
                                var tsb = track + ":" + sector + ":" + block;
                                return { value: [0, tsb] };
                            }
                        }
                    };
                    for (var block = 0; block < _DISK.blocks; block++) {
                        var state_1 = _loop_1(block);
                        if (typeof state_1 === "object")
                            return state_1.value;
                    }
                }
            }
            return [1, "-1:-1:-1"];
        };
        DeviceDriverDisk.prototype.getEmptyBlock = function () {
            for (var track = 0; track < _DISK.tracks; track++) {
                for (var sector = 0; sector < _DISK.sectors; sector++) {
                    for (var block = 0; block < _DISK.blocks; block++) {
                        if (track == 0 && sector == 0 && block == 0) { // skip Master boot record
                            continue;
                        }
                        // build the pointer and get the block
                        var file_block = JSON.parse(sessionStorage.getItem(track + ":" + sector + ":" + block));
                        // return the first one
                        if (file_block.freeBit == "0") {
                            return track + ":" + sector + ":" + block;
                        }
                    }
                }
            }
            // ERROR or full
            return "-1:-1:-1";
        };
        // Create a file, dont put nothin in it yet tho besides FCB stuff
        DeviceDriverDisk.prototype.createFile = function (file_name) {
            // Check if that file is already in use
            if (this.checkFileName(file_name)[0] == 0) {
                return 1;
            }
            // Find a free set of blocks for the file
            var block_tsb = this.getEmptyBlock();
            if (block_tsb == "-1:-1:-1") {
                return 2;
            }
            // Write new file
            // Convert filename to a arrary of hex values
            var hex_name = this.hexOfString(file_name);
            // Fill the remaning block with 00's
            for (var i = 0; hex_name.length < (_DISK.blockSize); i++) {
                hex_name.push("00");
            }
            // Write the data to the session
            var fcb = new DOS.FCB(block_tsb, "0:0:0", "1", hex_name);
            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
            // Since TS is strict delete fcb will throw an error Instead, free
            // the contents of a variable so it can be garbage collected  
            fcb = null;
            return 0;
        };
        DeviceDriverDisk.prototype.readFile = function (file_name) {
            // check if the file even exists
            var results = this.checkFileName(file_name);
            if (results[0] == 1) {
                return [1, "file not found"];
            }
            // build the pointer and get the block
            var file_block = JSON.parse(sessionStorage.getItem(results[1]));
            var hex_string = file_block.data;
            // theres more blocks
            if (file_block.pointer != "0:0:0") {
                var search = true;
                var next_block = file_block.pointer;
                while (search) {
                    var new_block = JSON.parse(sessionStorage.getItem(next_block));
                    hex_string += new_block.data;
                    if (file_block.pointer == "0:0:0") {
                        search = false;
                    }
                }
            }
            // finally wether 1 or n blocks long, make the data readable
            var decoded = "";
            hex_string.forEach(function (char) {
                decoded += String.fromCharCode(parseInt(char, 16));
            });
            return [0, decoded];
        };
        DeviceDriverDisk.prototype.writeFile = function (file_name, data) {
            // check if the file even exists
            var results = this.checkFileName(file_name);
            if (results[0] == 1) {
                return [1, "file not found"];
            }
            console.log(data);
        };
        DeviceDriverDisk.prototype.delFile = function (file_name) {
            var results = this.checkFileName(file_name);
            if (results[0] == 1) {
                return [1, "file not found"];
            }
            // build the pointer and get the block
            var file_block = JSON.parse(sessionStorage.getItem(results[1]));
            // create a new instance of a file block to re write it all.
            var fcb = new DOS.FCB(results[1], "0:0:0", "0", file_block.data);
            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
            fcb = null;
            return [0, "removed from disk"];
        };
        return DeviceDriverDisk;
    }(DOS.DeviceDriver));
    DOS.DeviceDriverDisk = DeviceDriverDisk;
})(DOS || (DOS = {}));
