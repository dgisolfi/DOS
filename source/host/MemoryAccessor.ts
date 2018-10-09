///<reference path="../globals.ts" />

/* ------------
     memory.ts

     Requires global.ts.

     Stores all segments of main memory
     ------------ */

module DOS {

    export class MemoryAccessor {
        constructor () {}

        public readMemory(pc): string {
            var hex_location = _PCB.pcb[_CPU.runningPID].sRegister + pc
            return(_MEM.memory[hex_location])
        }

        public writeMemory(address, data) {
            var hex_location = _PCB.pcb[_CPU.runningPID].sRegister + address;
            _MEM.memory[hex_location] = data;

        }
       
    }

}