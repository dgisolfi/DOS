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
            var hex_location = (_PCM.runningProccess.sRegister + address);
            // console.log(_MEM.memory[3])
            return(_MEM.memory[hex_location]);
        }

        public writeMemory(address, data) {
            var hex_location = (_PCM.runningProccess.sRegister + address);
            _MEM.memory[hex_location] = data;
        }
    }
}