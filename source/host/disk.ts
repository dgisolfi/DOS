///<reference path="../globals.ts" />

// Disk.ts
// Is meant to replicate a physical Disk, will use T,S,B to find locations in storage

module DOS {
    export class Disk {
        public tracks;
        public sectors;
        public blocks;
        public blockSize;
        constructor() {
            this.tracks = 4;
            this.sectors = 8;
            this.blocks = 8;
            this.blockSize = 60;
        }

        public init() {
            // initialize and set storage to 0's
            // This is crazy innifecient, TODO: find a better way to do this
            for (let track = 0; track < this.tracks; track++) { // Tracks
                for (let sector = 0; sector < this.sectors; sector++) { // Sectors
                    for (let block = 0; block < this.blocks; block++) { // Blocks
                        let row = [];
                        for (let index = 0; index < this.blockSize; index++) {
                            row.push(`00`);
                        }

                        let fcb = new FCB(`${track}:${sector}:${block}`,`0:0:0`, `0`, row);
                        sessionStorage.setItem(fcb.tsb, JSON.stringify(fcb));
                        // Since TS is strict delete fcb will throw an error Instead, free
                        // the contents of a variable so it can be garbage collected  
                        // fcb = null;
                    }
                }
            }
        }
    }
} 