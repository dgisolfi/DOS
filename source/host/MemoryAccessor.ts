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
            console.log(_MEM.memory[hex_location])
            return(_MEM.memory[hex_location])
        }

        public writeMemory() {

        }
       
    }

}