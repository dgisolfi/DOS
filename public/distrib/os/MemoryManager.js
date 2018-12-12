///<reference path="../globals.ts" />
/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */
var DOS;
(function (DOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.loadInMem = function (code) {
            var startIndex = 0;
            var endIndex = 0;
            // Find the first open segment of memory
            if (!_MEM.isSeg00Full) {
                startIndex = 0;
                endIndex = 255;
                _MEM.isSeg00Full = true;
            }
            else if (!_MEM.isSeg01Full) {
                startIndex = 256;
                endIndex = 511;
                _MEM.isSeg01Full = true;
            }
            else if (!_MEM.isSeg02Full) {
                startIndex = 512;
                endIndex = 767;
                _MEM.isSeg02Full = true;
            }
            else {
                // Load into Disk
                return [1, startIndex, endIndex, "memory"];
            }
            var memIndex = startIndex;
            code.forEach(function (hex) {
                _MEM.memory[memIndex] = hex;
                memIndex++;
            });
            return [0, startIndex, endIndex, "memory"];
        };
        //                                      success? strReg  endReg   loc     tsb
        MemoryManager.prototype.loadOnDisk = function (pid, code) {
            var status = _krnDiskDriver.rollOut(pid, code);
            if (status[0] == 1) {
                return [1, 0, 0, "disk", "0:0:0"];
            }
            return [0, 0, 0, "disk", status[1]];
        };
        MemoryManager.prototype.wipeSeg00 = function () {
            for (var i = 0; i <= 255; i++) {
                _MEM.memory[i] = "00";
                _MEM.isSeg00Full = false;
            }
        };
        MemoryManager.prototype.wipeSeg01 = function () {
            for (var i = 256; i <= 511; i++) {
                _MEM.memory[i] = "00";
                _MEM.isSeg01Full = false;
            }
        };
        MemoryManager.prototype.wipeSeg02 = function () {
            for (var i = 512; i <= 767; i++) {
                _MEM.memory[i] = "00";
                _MEM.isSeg02Full = false;
            }
        };
        return MemoryManager;
    }());
    DOS.MemoryManager = MemoryManager;
})(DOS || (DOS = {}));
