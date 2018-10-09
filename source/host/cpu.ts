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
            public IR: string = "00",
            public Acc: number = 0,
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public isExecuting: boolean = false,
            public readyQueue: Array<number> = [],
            public runningPID: number = 0) {
        }

        public init(): void {
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.readyQueue = [];
        }

        public cycle(): void {
            _Kernel.krnTrace(`CPU cycle`);
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var sRegister = _PCB.pcb[_CPU.runningPID].sRegister
            var eRegister = _PCB.pcb[_CPU.runningPID].eRegister
            // Get the next OP Code
            this.IR = _MemoryAccessor.readMemory(this.PC)
           
            this.runOpCode(this.IR);
            // Increment the program counter
            this.PC++;
            // Check wether the program has finished 
            if (this.PC +sRegister  >= eRegister) {
                // reset and end the proccess
                this.isExecuting = false;
                this.PC = 0;
               _PCB.terminateProcess(this.runningPID);
               this.runningPID = 0;
            }
            _PCB.PC = this.PC;
            _PCB.IR =  this.IR;
            _PCB.Acc =  this.Acc;

        }

        public schedule() {
            // for now turn it on and let it go
            this.isExecuting = true;
            this.runningPID  = this.readyQueue[0];
            this.readyQueue.splice(0, 1)
            _PCB.runProccess(this.runningPID);
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
                    // read in little endian form
                    var val1 = _MemoryAccessor.readMemory(this.PC+1);
                    var val2 = _MemoryAccessor.readMemory(this.PC+2);
                    var hex = val2 + val1;
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hex, 16))
                    this.Acc = parseInt(hex_endian, 16);
                    this.passCmd(3);
                    break;
                
                case `8D`: // Store the accumulator in memory 
                    
                    break;

                case `A9`: //Load the accumulator with a constant
                    
                    break;
            
                default:
                    break;
            }

        }
    }
}
