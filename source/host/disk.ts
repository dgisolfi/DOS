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

            // for (var track = 0, sector = 1, block = 2; track < this.tracks, sector < this.sectors; i = i + 3, j = j + 3, n = n + 3){
            //     console.log("variable i: " + i);
            //     console.log("variable j: " + j);
            //     console.log("variable n: " + n);
            // }
            // This is crazy innifecient, TODO: find a better way to do this
            for (let track = 0; track < this.tracks; track++) { // Tracks
                for (let sector = 0; sector < this.sectors; sector++) {
                    for (let block = 0; block < this.blocks; block++) {
                       let row = [];
                       for (let index = 0; index < this.blockSize; index++) {
                            row.push(`00`);
                       }
                       let newBlock: Object = {};
                       newBlock[`label`] = `0:0:0`;
                       newBlock[`available`] = `0`;
                       newBlock[`data`] = row;
                       sessionStorage.setItem(`${track}:${sector}:${block}`, JSON.stringify(newBlock));
                    }
                }
            }
        }
    }
} 