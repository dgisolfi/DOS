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
            // The code below cannot run because `this` can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this) || this;
            _this.file_names = [];
            _this.driverEntry = _this.krnDiskDriverEntry;
            return _this;
        }
        DeviceDriverDisk.prototype.krnDiskDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Disk Device Driver.
            this.status = "loaded";
            _Console.updateDisk();
            // More?
        };
        DeviceDriverDisk.prototype.getBlock = function (TSB) {
            return JSON.parse(sessionStorage.getItem(TSB));
        };
        DeviceDriverDisk.prototype.listFiles = function () {
            return this.file_names;
        };
        DeviceDriverDisk.prototype.hexOfString = function (str) {
            var arr = [];
            str.split('').forEach(function (letter) {
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
                        if (file_block.inUse != "0") {
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
        DeviceDriverDisk.prototype.getEmptyBlock = function (skip_block) {
            var next_block = true;
            if (skip_block) {
                next_block = false;
            }
            for (var track = 0; track < _DISK.tracks; track++) {
                for (var sector = 0; sector < _DISK.sectors; sector++) {
                    for (var block = 0; block < _DISK.blocks; block++) {
                        if (track == 0 && sector == 0 && block == 0) { // skip Master boot record
                            continue;
                        }
                        // build the pointer and get the block
                        var file_block = this.getBlock(track + ":" + sector + ":" + block);
                        // return the first one
                        if (file_block.inUse == "0") {
                            if (next_block) {
                                return track + ":" + sector + ":" + block;
                            }
                            else {
                                next_block = true;
                                continue;
                            }
                        }
                    }
                }
            }
            // ERROR or full
            return "-1:-1:-1";
        };
        // Take a process and put it on the DISK
        // Autobots ROLL OUT!
        DeviceDriverDisk.prototype.rollOut = function (userCode) {
            var _this = this;
            // Find a free set of blocks for the file
            var initial_block = this.getEmptyBlock(false);
            if (initial_block == "-1:-1:-1") {
                return [1, "-1:-1:-1", "Disk full"];
            }
            // 
            var block_data = [];
            var block = "";
            userCode.forEach(function (hex) {
                block += hex;
                if (block.length / 2 == _DISK.blockSize) {
                    block_data.push(block);
                    block = "";
                }
            });
            for (var i = 0; block.length / 2 < _DISK.blockSize; i++) {
                block += "00";
            }
            block_data.push(block);
            // block_data.reverse();
            var next_block_pointer = "";
            var file_pointer = this.getEmptyBlock(false);
            block_data.forEach(function (block) {
                // for first(or in reality last one block)
                var block_tsb = _this.getEmptyBlock(false);
                if (block_tsb == "-1:-1:-1") {
                    return [1, "Disk full"];
                }
                if (block == block_data[block_data.length - 1]) {
                    next_block_pointer = "0:0:0";
                }
                else {
                    next_block_pointer = _this.getEmptyBlock(true);
                }
                var char = "";
                var new_block_data = [];
                block.split('').forEach(function (ch) {
                    char += ch;
                    if (char.length == 2) {
                        new_block_data.push(char);
                        char = "";
                    }
                });
                // Write the data to the session
                var fcb = new DOS.FCB(block_tsb, next_block_pointer, "1", new_block_data);
                sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
                fcb = null;
            });
            _Console.updateDisk();
            return [0, initial_block, "data written to disk."];
        };
        // Take a process and put it on the DISK
        // Autobots ROLL IN?
        DeviceDriverDisk.prototype.rollIn = function (processTSB) {
            var hex_code = [];
            var file_block = this.getBlock(processTSB);
            if (file_block.inUse == 0) {
                return [0, hex_code, "given block not valid, inUse bit = 0."];
            }
            // theres more blocks
            if (file_block.pointer != "0:0:0") {
                var search = true;
                var hex_blocks = [];
                var next_block = file_block.pointer;
                while (search) {
                    var new_block = this.getBlock(next_block);
                    hex_blocks.push(new_block.data);
                    next_block = new_block.pointer;
                    if (new_block.pointer == "0:0:0") {
                        search = false;
                    }
                }
                hex_blocks.forEach(function (block) {
                    block.forEach(function (hex_char) {
                        hex_code.push(hex_char);
                    });
                });
            }
            else {
                hex_code = file_block.data;
            }
            if (hex_blocks.length == 0) {
                return [0, hex_code, "file empty"];
            }
            // finally wether 1 or n blocks long, make the data readable
            // let decoded = ``
            // let hex_digit = ``
            // hex_string.split('').forEach(char => {
            //     hex_digit += char;
            //     if (hex_digit.length == 2) {
            //         decoded += String.fromCharCode(parseInt(hex_digit, 16));
            //         hex_digit = ``;
            //     }                
            // });
            // return [0, hex_code]
            return [0, hex_code, "data retrieved to disk."];
        };
        // Create a file, dont put nothin in it yet tho besides FCB stuff
        DeviceDriverDisk.prototype.createFile = function (file_name) {
            // Check if that file is already in use
            if (this.checkFileName(file_name)[0] == 0) {
                return [1, "file name already in use."];
            }
            // Find a free set of blocks for the file
            var block_tsb = this.getEmptyBlock(false);
            if (block_tsb == "-1:-1:-1") {
                return [1, "Disk full"];
            }
            // add file name to global list
            this.file_names.push(file_name);
            // Write new file
            // Convert filename to a arrary of hex values
            var hex_name = this.hexOfString(file_name);
            if (hex_name.length >= _DISK.blockSize) {
                return [1, "file name to long. (make it 30 or less chars)"];
            }
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
            _Console.updateDisk();
            return [0, "file written to disk"];
        };
        DeviceDriverDisk.prototype.writeFile = function (file_name, data) {
            var _this = this;
            // check if the file even exists
            var results = this.checkFileName(file_name);
            if (results[0] == 1) {
                return [1, "file not found"];
            }
            // get rid of the quotes
            data = data.split('`').join('');
            // Convert data into ascii then hex and get the array
            var hex_data = this.hexOfString(data);
            var block_data = [];
            var block = "";
            hex_data.forEach(function (hex) {
                block += hex;
                if (block.length == _DISK.blockSize) {
                    block_data.push(block);
                    block = "";
                }
            });
            for (var i = 0; (block.length / 2) < (_DISK.blockSize); i++) {
                block += "00";
            }
            block_data.push(block);
            // block_data.reverse();
            var next_block_pointer = "";
            var file_pointer = this.getEmptyBlock(false);
            block_data.forEach(function (block) {
                // for first(or in reality last one block)
                var block_tsb = _this.getEmptyBlock(false);
                if (block_tsb == "-1:-1:-1") {
                    return [1, "Disk full"];
                }
                if (block == block_data[block_data.length - 1]) {
                    next_block_pointer = "0:0:0";
                }
                else {
                    next_block_pointer = _this.getEmptyBlock(true);
                }
                var char = "";
                var new_block_data = [];
                block.split('').forEach(function (ch) {
                    char += ch;
                    if (char.length == 2) {
                        new_block_data.push(char);
                        char = "";
                    }
                });
                // Write the data to the session
                var fcb = new DOS.FCB(block_tsb, next_block_pointer, "1", new_block_data);
                sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
                // console.log(`block: at ${block_tsb}: ${block}`, next_block_pointer);
                fcb = null;
            });
            // get the file name block to give it a pointer
            var file_block = this.getBlock(results[1]);
            // set the file name block to the next block pointer
            var fcb = new DOS.FCB(results[1], file_pointer, "1", file_block.data);
            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
            fcb = null;
            _Console.updateDisk();
            return [0, "data written to disk."];
        };
        DeviceDriverDisk.prototype.readFile = function (file_name) {
            // check if the file even exists
            var results = this.checkFileName(file_name);
            if (results[0] == 1) {
                return [1, "file not found"];
            }
            // build the pointer and get the block
            var file_block = this.getBlock(results[1]);
            // theres more blocks
            if (file_block.pointer != "0:0:0") {
                var search = true;
                var hex_string = "";
                var next_block = file_block.pointer;
                while (search) {
                    var new_block = this.getBlock(next_block);
                    hex_string += new_block.data;
                    next_block = new_block.pointer;
                    if (new_block.pointer == "0:0:0") {
                        search = false;
                    }
                }
            }
            else {
                return [0, "file empty"];
            }
            if (hex_string.length == 0) {
                return [0, "file empty"];
            }
            // finally wether 1 or n blocks long, make the data readable
            var decoded = "";
            var hex_digit = "";
            hex_string.split('').forEach(function (char) {
                hex_digit += char;
                if (hex_digit.length == 2) {
                    decoded += String.fromCharCode(parseInt(hex_digit, 16));
                    hex_digit = "";
                }
            });
            return [0, decoded];
        };
        DeviceDriverDisk.prototype.delFile = function (file_name) {
            var results = this.checkFileName(file_name);
            if (results[0] == 1) {
                return [1, "file not found"];
            }
            // remove file name from global list
            delete this.file_names[this.file_names.indexOf(file_name)];
            // build the pointer and get the block
            var file_block = JSON.parse(sessionStorage.getItem(results[1]));
            // create a new instance of a file block to re write it all.
            var fcb = new DOS.FCB(results[1], "0:0:0", "0", file_block.data);
            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
            fcb = null;
            _Console.updateDisk();
            return [0, "removed from disk"];
        };
        DeviceDriverDisk.prototype.formatDisk = function (method) {
            if (method == "full") {
                // why make it hard?...codes already there
                _DISK.init();
                return 0;
            }
            else if (method == "quick") {
                for (var track = 0; track < _DISK.tracks; track++) {
                    for (var sector = 0; sector < _DISK.sectors; sector++) {
                        for (var block = 0; block < _DISK.blocks; block++) {
                            if (track == 0 && sector == 0 && block == 0) { // skip Master boot record
                                continue;
                            }
                            var tsb = track + ":" + sector + ":" + block;
                            // build the pointer and get the block
                            var file_block = JSON.parse(sessionStorage.getItem(tsb));
                            // create a new instance of a file block to re write it all.
                            var fcb = new DOS.FCB(tsb, "0:0:0", "0", file_block.data);
                            sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
                            fcb = null;
                        }
                    }
                }
                _Console.updateDisk();
                return 0;
            }
            else {
                return 1;
            }
        };
        return DeviceDriverDisk;
    }(DOS.DeviceDriver));
    DOS.DeviceDriverDisk = DeviceDriverDisk;
})(DOS || (DOS = {}));
