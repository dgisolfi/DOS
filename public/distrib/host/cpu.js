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
        function Cpu(PC, IR, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (IR === void 0) { IR = "00"; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.IR = "00";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace("CPU cycle");
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var sRegister = _PCM.runningProccess.sRegister;
            var eRegister = _PCM.runningProccess.eRegister;
            // Get the next OP Code
            this.IR = _MemoryAccessor.readMemory(this.PC);
            this.runOpCode(this.IR);
            // Increment the program counter
            this.PC++;
            _PCM.runningProccess.turnaroundTime++;
            _PCM.runningProccess.PC = this.PC;
            _PCM.runningProccess.IR = this.IR;
            _PCM.runningProccess.Acc = this.Acc;
            _PCM.runningProccess.XReg = this.Xreg;
            _PCM.runningProccess.YReg = this.Yreg;
            _PCM.runningProccess.ZFlag = this.Acc;
            // Check wether the program has finished 
            if (this.PC + sRegister >= eRegister) {
                // reset and end the proccess
                _SingleStep = false;
                _PCM.runningProccess.state = "terminated";
                _KernelInterruptQueue.enqueue(new DOS.Interrupt(PROCESS_EXIT, _PCM.runningProccess.pid));
            }
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
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC + 1);
                    var val2 = _MemoryAccessor.readMemory(this.PC + 2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    // Read from memory with the corected endian format 
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hexAddress, 16));
                    //Finally, parse it from HEX to Decimal and load the Accumulator
                    this.Acc = parseInt(hex_endian, 16);
                    this.passCmd(3);
                    break;
                case "8D": // Store the accumulator in memory
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC + 1);
                    var val2 = _MemoryAccessor.readMemory(this.PC + 2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    var value = this.Acc.toString(16).toLocaleUpperCase();
                    _MemoryAccessor.writeMemory(parseInt(hexAddress, 16), value);
                    this.passCmd(3);
                    break;
                case "6D": //Read from memory and add to the accumulator
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC + 1);
                    var val2 = _MemoryAccessor.readMemory(this.PC + 2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    // Read from memory with the corected endian format 
                    var value = _MemoryAccessor.readMemory(parseInt(hexAddress, 16));
                    //Finally, parse it from HEX to Decimal and add it to the Accumulator
                    this.Acc += parseInt(value, 16);
                    this.passCmd(3);
                    break;
                case "A2": // load the x register with a given constant
                    this.Xreg = parseInt(_MemoryAccessor.readMemory(this.PC + 1), 16);
                    this.passCmd(2);
                    break;
                case "AE": // load the x register from mem
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC + 1);
                    var val2 = _MemoryAccessor.readMemory(this.PC + 2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    // Read from memory with the corected endian format 
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hexAddress, 16));
                    //Finally, parse it from HEX to Decimal and load the Xreg
                    this.Xreg = parseInt(hex_endian, 16);
                    this.passCmd(3);
                    break;
                case "A0": // load the y register with a given constant
                    this.Yreg = parseInt(_MemoryAccessor.readMemory(this.PC + 1), 16);
                    this.passCmd(2);
                    break;
                case "AC": // load the y register from mem
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC + 1);
                    var val2 = _MemoryAccessor.readMemory(this.PC + 2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    // Read from memory with the corected endian format 
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hexAddress, 16));
                    //Finally, parse it from HEX to Decimal and load the Xreg
                    this.Yreg = parseInt(hex_endian, 16);
                    this.passCmd(3);
                    break;
                case "AHHHH": // break (system call)
                    // Execute system call for a process exit by generating software interrupt
                    _KernelInterruptQueue.enqueue(new DOS.Interrupt(PROCESS_EXIT, _PCM.runningProccess.pid));
                    break;
                default:
                    // _KernelInterruptQueue.enqueue(new Interrupt(OP_NOT_FOUND, opCode));
                    // _KernelInterruptQueue.enqueue(new Interrupt(PROCESS_EXIT, _PCM.runningProccess.pid));
                    break;
            }
        };
        return Cpu;
    }());
    DOS.Cpu = Cpu;
})(DOS || (DOS = {}));
