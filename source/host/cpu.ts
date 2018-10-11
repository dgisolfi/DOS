///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the `bare metal` (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module DOS {

    export class Cpu {

        constructor(
            public PC: number = 0,
            public IR: string = `00`,
            public Acc: number = 0,
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public isExecuting: boolean = false,
          ) {
        }

        public init(): void {
            this.PC = 0;
            this.IR = `00`;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace(`CPU cycle`);
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var sRegister = _PCM.runningProccess.sRegister 
            var eRegister = _PCM.runningProccess.eRegister 
            // Get the next OP Code
            this.IR = _MemoryAccessor.readMemory(this.PC);
           
            this.runOpCode(this.IR);
            // Increment the program counter
            this.PC++;
            _PCM.runningProccess.turnaroundTime++;
            _PCM.runningProccess.PC =  this.PC;
            _PCM.runningProccess.IR =  this.IR;
            _PCM.runningProccess.Acc = this.Acc;
            // Check wether the program has finished 
            if (this.PC + sRegister  >= eRegister) {
                // reset and end the proccess
                _PCM.runningProccess.state = `terminated`;
                _KernelInterruptQueue.enqueue(new Interrupt(PROCESS_EXIT, _PCM.runningProccess.pid));
            }
            
        }

        

        public passCmd(num): void {
            this.PC + num;
        }

        public runOpCode(opCode){
            switch (opCode) {
                case `A9`: // Load the accumulator with a constant
                    this.Acc = parseInt(_MemoryAccessor.readMemory(this.PC+1), 16);
                    this.passCmd(2);
                    break;

                case `AD`: // Load the accumulator from memory 
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC+1);
                    var val2 = _MemoryAccessor.readMemory(this.PC+2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    // Read from memory with the corected endian format 
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hexAddress, 16))
                    //Finally, parse it from HEX to Decimal and load the Accumulator
                    this.Acc = parseInt(hex_endian, 16);
                    this.passCmd(3);
                    break;
                
                case `8D`: // Store the accumulator in memory
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC+1);
                    var val2 = _MemoryAccessor.readMemory(this.PC+2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;

                    var value = this.Acc.toString(16).toLocaleUpperCase();
                    _MemoryAccessor.writeMemory(parseInt(hexAddress,16), value);
                    this.passCmd(3);
                    break;

                case `6D`: //Read from memory and add to the accumulator
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC+1);
                    var val2 = _MemoryAccessor.readMemory(this.PC+2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    // Read from memory with the corected endian format 
                    var value = _MemoryAccessor.readMemory(parseInt(hexAddress, 16));

                    //Finally, parse it from HEX to Decimal and add it to the Accumulator
                    this.Acc += parseInt(value, 16);
                    this.passCmd(3);
                    break;
                
                case "AHHHH": // break (system call)
                    // Execute system call for a process exit by generating software interrupt
                    _KernelInterruptQueue.enqueue(new Interrupt(PROCESS_EXIT, _PCM.runningProccess.pid));
                    break;
            
                default:
                    // _KernelInterruptQueue.enqueue(new Interrupt(OP_NOT_FOUND, opCode));
                    // _KernelInterruptQueue.enqueue(new Interrupt(PROCESS_EXIT, _PCM.runningProccess.pid));
                    break;
                    
            }

        }
    }
}
