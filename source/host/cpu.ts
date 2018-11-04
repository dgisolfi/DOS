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
            var base = _PCM.runningprocess.base 
            var limit = _PCM.runningprocess.limit 
            // Get the next OP Code
            this.IR = _MemoryAccessor.readMemory(this.PC);
            
            // console.log(`PC: ${this.PC}`, `IR: ${this.IR}`);
           
            this.runOpCode(this.IR);
            // Increment the program counter
            _PCM.runningprocess.turnaroundTime++;
            _PCM.runningprocess.PC =  this.PC;
            _PCM.runningprocess.IR =  this.IR;
            _PCM.runningprocess.Acc = this.Acc;
            _PCM.runningprocess.XReg = this.Xreg;
            _PCM.runningprocess.YReg = this.Yreg;
            _PCM.runningprocess.ZFlag = this.Zflag;
            
            
            // Check wether the program has finished 
            if (this.PC + base  >= limit) {
                // reset and end the process
                _SingleStep = false;
                _PCM.runningprocess.state = `terminated`;
                _KernelInterruptQueue.enqueue(new Interrupt(PROCESS_EXIT, _PCM.runningprocess.pid));
            }
            
        }

        public passCmd(num): void {
            this.PC += num;
        }

        public runOpCode(opCode){
            switch (opCode) {
                case `A9`: // Load the accumulator with a constant
                    this.Acc = parseInt(_MemoryAccessor.readMemory(this.PC+1), 16);
                    // console.log(`Before: ${this.PC}`)
                    if (_Verbose) {
                        console.log(`Setting the Accumulator to the constant: ${this.PC + 1}`);
                    }
                    this.passCmd(2);
                    // console.log(`After: ${this.PC}`)
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

                    if (_Verbose) {
                        console.log(`Loading the Accumulator from memory to: ${hex_endian}`);
                    }

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

                    if (_Verbose) {
                        console.log(`Storing the Accumulator: ${value} into memory address: ${hexAddress}`);
                    }

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

                    if (_Verbose) {
                        console.log(`Reading from memory location ${hexAddress}, adding ${value} to the Accumulator`);
                    }

                    this.passCmd(3);
                    break;
                
                case `A2`: // load the x register with a given constant
                    this.Xreg = parseInt(_MemoryAccessor.readMemory(this.PC+1), 16);

                    if (_Verbose) {
                        console.log(`Loading the X register with the constant: ${this.Xreg}`);
                    }

                    this.passCmd(2);
                    break;
                
                case `AE`:  // load the x register from mem
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC+1);
                    var val2 = _MemoryAccessor.readMemory(this.PC+2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    // Read from memory with the corected endian format 
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hexAddress, 16))
                    //Finally, parse it from HEX to Decimal and load the Xreg
                    this.Xreg = parseInt(hex_endian, 16);

                    if (_Verbose) {
                        console.log(`Loading the X register from Memory at address: ${hexAddress} with value: ${this.Xreg}`);
                    }

                    this.passCmd(3);
                    break;
                
                case `A0`: // load the y register with a given constant
                    this.Yreg = parseInt(_MemoryAccessor.readMemory(this.PC+1), 16);

                    if (_Verbose) {
                        console.log(`Loading the Y register with the constant: ${this.Yreg}`);
                    }

                    this.passCmd(2);
                    break;

                case `AC`: // load the y register from mem
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC+1);
                    var val2 = _MemoryAccessor.readMemory(this.PC+2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    // Read from memory with the corected endian format 
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hexAddress, 16))
                    //Finally, parse it from HEX to Decimal and load the Xreg
                    this.Yreg = parseInt(hex_endian, 16);

                    if (_Verbose) {
                        console.log(`Loading the Y register from Memory at address: ${hexAddress} with value: ${this.Yreg}`);
                    }

                    this.passCmd(3);
                    break;

                case `EA`: // no op .... just skip it
                    if (_Verbose) {
                        console.log(`No OP, Skipping`);
                    }
                    this.passCmd(1);
                    break;
                case `00`: // break
                    if (_Verbose) {
                        console.log(`Breaking out of process`);
                    }
                    // Execute system call for a process exit by generating software interrupt
                    _KernelInterruptQueue.enqueue(new Interrupt(PROCESS_EXIT, _PCM.runningprocess.pid));
                    break;
                case `EC`: // take a byte from memory and compare it with the x Register...if equal z flag is 0
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC+1);
                    var val2 = _MemoryAccessor.readMemory(this.PC+2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    // Read from memory with the corected endian format 
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hexAddress, 16))
                    //Finally, parse it from HEX to Decimal and load the Xreg
                    if (parseInt(hex_endian, 16) === this.Xreg) {
                        this.Zflag = 1;
                    } else {
                        this.Zflag = 0;
                    }

                    if (_Verbose) {
                        console.log(`Reading from memory ${hex_endian}, comparing read value: ${parseInt(hex_endian, 16)} to X Register: ${this.Xreg}; Z Flag is ${this.Zflag}`);
                    }

                    this.passCmd(3);
                    break;
                
                case `D0`: // if flag is 0, branch x number of bytes
                    // check if the Z flag is zero...otherwise were done here
                    if (this.Zflag === 0) {
                        // get the branch value from memory
                        var branch = _MemoryAccessor.readMemory(this.PC+1);
                        var branchAddress = parseInt(branch, 16) + this.PC;
                        // console.log(`PC > ${this.PC}`, ` Branch > ${branchAddress}`);

                        // if the branch will exceed the memory, go back to 0
                        if (branchAddress > _PCM.runningprocess.limit ) {
                            branchAddress = branchAddress%256;
                        } 
                        // Add 2 to account for the branch op and the location
                        this.PC = branchAddress + 2;

                        if (_Verbose) {
                            console.log(`Z FLag is 0, Branching to ${branchAddress}. New PC is ${this.PC}`);
                        }

                    } else {
                        this.passCmd(2);
                    }
                    
                    break;

                case `EE`: // Increment the value of a byte
                    // Store the values at the first and second postions
                    var val1 = _MemoryAccessor.readMemory(this.PC+1);
                    var val2 = _MemoryAccessor.readMemory(this.PC+2);
                    // Switch the order because we must read/write in little endian
                    var hexAddress = val2 + val1;
                    var hex_endian = _MemoryAccessor.readMemory(parseInt(hexAddress, 16))
                    
                    //translate to decimal....then add 1
                    var hex_val = parseInt(hex_endian, 16);
                    hex_val++;
                    _MemoryAccessor.writeMemory(parseInt(hexAddress,16), hex_val.toString(16));

                    if (_Verbose) {
                        console.log(`Byte ${hex_val} was incremented to ${hex_val + 1}`);
                    }

                    this.passCmd(3);
                    break;
                
                case `FF`: // System Call...print
                    
                    var out = ``;
                    if (this.Xreg === 1) { // #$01 in X reg = print the integer stored
                        out = this.Yreg.toString();
                        if (_Verbose) {
                            console.log(`X Register is 1, Printing the Y Register ${this.Yreg}`);
                        }
                    } else if (this.Xreg === 2) { // #$02 in X reg = print the 00-terminated string stored at the address in the Y register.
                        // find the address in memory and dont print them unless there acutal letters....aka not
                        var byteAddr = parseInt(this.Yreg.toString(16), 16);
                        var byte = _MemoryAccessor.readMemory(byteAddr);
                        var char = String.fromCharCode(parseInt(byte, 16));
                        // keep going till we hit empty or blank memory...build the string as we do
                        while( byte != `00`) {
                            byteAddr++;
                            out += char;
                            // Convert from decimal to ascii
                            var byte = _MemoryAccessor.readMemory(byteAddr);
                            var char = String.fromCharCode(parseInt(byte, 16));
                           
                        }

                        if (_Verbose) {
                            console.log(`X Register is 2, Printing the ascii of the Y Register: ${out}`);
                        }
                       
                    }
                    // print the result
                    _KernelInterruptQueue.enqueue(new Interrupt(PRINT_IR, out));
                    this.passCmd(1);
                    break;
            
                default:
                    if (_Verbose) {
                        console.log(`Unrecognized OPCode; Ending Program. Check your syntax an run again.`);
                    }
                   
                    _KernelInterruptQueue.enqueue(new Interrupt(PROCESS_EXIT, _PCM.runningprocess.pid));
                    break;
            }
        }
    }
}
