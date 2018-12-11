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

        // returns all user code of a block
        public readMemoryBlock(process:DOS.PCB): Array<string> {
            let hex_code = [];
            _MEM.memory.forEach((hex, index) => {
                if (index >= process.base  && index <= process.limit ) {
                    hex_code.push(hex);
                }
            });
            return hex_code
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