///<reference path="../globals.ts" />

/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */

module DOS {

    export class MemoryAccessor {
        constructor () {}

        public readMemory(address): string {
            var hex_location = (_PCM.runningprocess.base + address);
            this.enforceBoundaries(hex_location);
            return(_MEM.memory[hex_location]);
        }

        public writeMemory(address, data) {
            var hex_location = (_PCM.runningprocess.base + address);
            this.enforceBoundaries(hex_location);
            _MEM.memory[hex_location] = data;
        }

        public enforceBoundaries(hex_location){
            if (hex_location > _PCM.runningprocess.limit) {
                _KernelInterruptQueue.enqueue(new Interrupt(OUT_OF_BOUNDS, _PCM.runningprocess.pid));
            }

            if (hex_location < _PCM.runningprocess.base) {
                _KernelInterruptQueue.enqueue(new Interrupt(OUT_OF_BOUNDS, _PCM.runningprocess.pid));
            }
        }
    }
}