///<reference path="../globals.ts" />
// Disk.ts
// Is meant to replicate a physical Disk, will use T,S,B to find locations in storage
var DOS;
(function (DOS) {
    var Disk = /** @class */ (function () {
        function Disk() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.blockSize = 60;
        }
        Disk.prototype.init = function () {
            // initialize and set storage to 0's
            // This is crazy innifecient, TODO: find a better way to do this
            for (var track = 0; track < this.tracks; track++) { // Tracks
                for (var sector = 0; sector < this.sectors; sector++) { // Sectors
                    for (var block = 0; block < this.blocks; block++) { // Blocks
                        var row = [];
                        for (var index = 0; index < this.blockSize; index++) {
                            row.push("00");
                        }
                        var fcb = new DOS.FCB(track + ":" + sector + ":" + block, "0:0:0", "0", row);
                        sessionStorage.setItem(fcb.pointer, JSON.stringify(fcb));
                        // Since TS is strict delete fcb will throw an error Instead, free
                        // the contents of a variable so it can be garbage collected  
                        fcb = null;
                    }
                }
            }
        };
        return Disk;
    }());
    DOS.Disk = Disk;
})(DOS || (DOS = {}));
