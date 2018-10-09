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
var DOS;
(function (DOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting, readyQueue, runningPID) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = "00"; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (readyQueue === void 0) { readyQueue = []; }
            if (runningPID === void 0) { runningPID = 0; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.readyQueue = readyQueue;
            this.runningPID = runningPID;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.readyQueue = [];
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace("CPU cycle");
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var sRegister = _PCB.pcb[_CPU.runningPID].sRegister;
            var eRegister = _PCB.pcb[_CPU.runningPID].eRegister;
            // Get the next OP Code
            this.IR = _MemoryAccessor.readMemory(this.PC);
            this.runOpCode(this.IR);
            // Increment the program counter
            this.PC++;
            // Check wether the program has finished 
            if (this.PC + sRegister >= eRegister) {
                // reset and end the proccess
                this.isExecuting = false;
                this.PC = 0;
                _PCB.terminateProcess(this.runningPID);
                this.runningPID = 0;
            }
            _PCB.PC = this.PC;
            _PCB.IR = this.IR;
            _PCB.Acc = this.Acc;
        };
        Cpu.prototype.schedule = function () {
            // for now turn it on and let it go
            this.isExecuting = true;
            this.runningPID = this.readyQueue[0];
            this.readyQueue.splice(0, 1);
            _PCB.runProccess(this.runningPID);
        };
        Cpu.prototype.passCmd = function (num) {
            this.PC + num;
        };
        Cpu.prototype.runOpCode = function (opCode) {
            switch (opCode) {
                case "A9": // Load the accumulator with a constant
                    this.Acc = parseInt(_MemoryAccessor.readMemory(this.PC + 1), 16);
                    this.passCmd(2);
                    break;
                case "AD": // Load the accumulator from memory 
                    // read in little endian form
                    var val1 = _MemoryAccessor.readMemory(this.PC + 1);
                    var val2 = _MemoryAccessor.readMemory(this.PC + 2);
                    var hex = val2 + val1;
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hex, 16));
                    this.Acc = parseInt(hex_endian, 16);
                    this.passCmd(3);
                    break;
                case "8D": // Store the accumulator in memory 
                    break;
                case "A9": //Load the accumulator with a constant
                    break;
                default:
                    break;
            }
        };
        return Cpu;
    }());
    DOS.Cpu = Cpu;
})(DOS || (DOS = {}));
