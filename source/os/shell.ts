///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="MemoryManager.ts" />


/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module DOS {
    export class Shell {
        // Properties
        public promptStr = `=>`;
        public commandList = [];
        public curses = `[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]`;
        public apologies = `[sorry]`;
        public status  = ``;

        constructor() {}

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                `ver`,
                `- Displays the current version data.`);
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                `help`,
                `- This is the help command. Seek help.`);
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                `shutdown`,
                `- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.`);
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                `cls`,
                `- Clears the screen and resets the cursor position.`);
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                `man`,
                `<topic> - Displays the MANual page for <topic>.`);
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                `trace`,
                `<on | off> - Turns the OS trace on or off.`);
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                `rot13`,
                `<string> - Does rot13 obfuscation on <string>.`);
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                `prompt`,
                `<string> - Sets the prompt.`);
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
                `date`,
                ` - Returns the current date and time`);
            this.commandList[this.commandList.length] = sc;

            //whereami
            sc = new ShellCommand(this.shellWhereAmI,
                `whereami`,
                ` - Returns user location`);
            this.commandList[this.commandList.length] = sc;

            //sarcasm
            sc = new ShellCommand(this.shellSarcasm,
                `sarcasm`,
                `<on | off> - Turns the OS sarcasm mode on or off.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellStatus,
                `status`,
                ` <string> - Updates the status.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellBSOD,
                `bsod`,
                `- Force break the OS.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellDarkMode,
                `darktheme`,
                `<on | off> - enables or disables the dark theme for the UI.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                `load`,
                `- Validates user code.`);
            this.commandList[this.commandList.length] = sc;
            
            sc = new ShellCommand(this.shellRun,
                `run`,
                `<int> - executes a loaded program given a PID.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.verboseMode,
                `verbose`,
                `<on | off> - enables or disables verbose mode for running processses.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.clearMem,
                `clearmem`,
                `resets all memory segments`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.ps,
                `ps`,
                `- list the running processes and their IDs`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.kill,
                `kill`,
                `<pid> - kills the specified process id.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.runAll,
                `runall`,
                `- runs all resident programs.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.setQuantum,
                `quantum`,
                `<int> — let the user set the Round Robin quantum.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.setSchedule,
                `setschedule`,
                `<algorithim> — given a valid algorithim the scheduler will start using the desired one on the next cycle.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.getSchedule,
                `getschedule`,
                `<int> — returns the scheduling algorithim currently in use.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.createFile,
                `create`,
                `<string> — given a string a new file will be created and given that name.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.readFile,
                `read`,
                `<string> — given a string a file will be read from the disk.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.writeFile,
                `write`,
                `<string> <data> — given a filename and data inside of "<data>" the data will be written to file.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.deleteFile,
                `delete`,
                `<string> — given a filename, will remove the fie from disk.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.format,
                `format`,
                `<tag> — given a tag either quick or full, will format the tsb's of the disk.`);
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.ls,
                `ls`,
                `will list all files stored on the disk.`);
            this.commandList[this.commandList.length] = sc;
            
            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace(`Shell Command~` + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf(`[ ${Utils.rot13(cmd)}]`) >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf(`[` + cmd + `]`) >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(` `);

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != ``) {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText(`Invalid Command. `);
            if (_SarcasticMode) {
                _StdOut.putText(`Unbelievable. You, [subject name here],`);
                _StdOut.advanceLine();
                _StdOut.putText(`must be the pride of [subject hometown here].`);
            } else {
                _StdOut.putText(`Type 'help' for, well... help.`);
            }
        }

        public shellCurse() {
            _StdOut.putText(`Oh, so that's how it's going to be, eh? Fine.`);
            _StdOut.advanceLine();
            _StdOut.putText(`Bitch.`);
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText(`I think we can put our differences behind us.`);
              _StdOut.advanceLine();
              _StdOut.putText(`For science . . . You monster.`);
              _SarcasticMode = false;
           } else {
              _StdOut.putText(`For what?`);
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + ` version ` + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText(`Commands:`);
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText(`  ` + _OsShell.commandList[i].command + ` ` + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText(`Shutting down...`);
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case `ver`:
                        _StdOut.putText(`Ver displays the current version and name of the OS.`);
                        break;

                    case `help`:
                        if (_SarcasticMode) {
                            _StdOut.putText(`Shouldn't you know the commands by now?`);
                        } else {
                            _StdOut.putText(`Help displays a list of (hopefully) valid commands.`);
                        } 
                        break;

                    case `shutdown`:
                        _StdOut.putText(`Shutdown manually ends the current session of ` + APP_NAME + `.`);
                        break;
                    
                    case `cls`:
                        _StdOut.putText(`Cls(Clear Screen) manually resets the console display removing all previous output.`);
                        break;
                    
                    case `man`:
                        _StdOut.putText(`Man will display the Manuel for a command given a string.`);
                        break;

                    case `trace`:
                        _StdOut.putText(`When activated trace will record the host logs.`);
                        break;
                    
                    case `rot13`:
                        _StdOut.putText(`rot13 will execute a letter substitution cipher on a given string.`);
                        break;
                    
                    case `prompt`:
                        _StdOut.putText(`Prompt gives the user the ability to change the defualt promp symbol.`);
                        break;
                    
                    case `date`:
                        _StdOut.putText(`Date displays the current Date and Time for the user.`);
                        break;
                    
                    case `whereami`:
                        _StdOut.putText(`Displays the users relative location...kinda.`);
                        break;
                
                    case `sarcasm`:
                        if (_SarcasticMode) {
                            _StdOut.putText(`Allows you to turn me off. I apologize but I cannot allow that.`);
                        } else {
                            _StdOut.putText(`Allows the user to enable or disable sarcasm mode.`);
                        } 
                        break;

                    case `status`:
                        _StdOut.putText(`Given a <string> the status will be assigned.`);
                        break;

                    case `bsod`:
                        _StdOut.putText(`Force breaks everything :).`);
                        break;

                    case `darktheme`:
                        _StdOut.putText(`Enables or Disables the dark theme skin for the DOS UI.`);
                        break;

                    case `load`:
                        _StdOut.putText(`Validates the user code in the HTML5 text area, and loads into memory`);
                        break;

                    case `run`:
                        _StdOut.putText(`executes the process specified with <int> PID.`);
                        break;

                    case `verbose`:
                        _StdOut.putText(`Enables verbose mode for running programs, will alert you in the Browser Console with each step.`);
                        break;
                        
                        
                    default:
                        _StdOut.putText(`No manual entry for ` + args[0] + `.`);
                }
            } else {
                _StdOut.putText(`Usage: man <topic>  Please supply a topic.`);
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case `on`:
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText(`Trace is already on, doofus.`);
                        } else {
                            _Trace = true;
                            _StdOut.putText(`Trace ON`);
                        }
                        break;
                    case `off`:
                        _Trace = false;
                        _StdOut.putText(`Trace OFF`);
                        break;
                    default:
                        _StdOut.putText(`Invalid arguement.  Usage: trace <on | off>.`);
                }
            } else {
                _StdOut.putText(`Usage: trace <on | off>`);
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + ` = '` + Utils.rot13(args.join(' ')) +`'`);
            } else {
                _StdOut.putText(`Usage: rot13 <string>  Please supply a string.`);
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText(`Usage: prompt <string>  Please supply a string.`);
            }
        }

        public shellDate(args) {
            _date = new Date().toLocaleDateString();
            _time = new Date().toLocaleTimeString();
            _StdOut.putText(`Current Date: ` + _date + ` Current Time: ` + _time );
        }

        public shellWhereAmI(args) {  
            //TODO: Make this do something far more clever, maybe returns the users country
            // orrrrr use a geo-locater and return the exact location.   
            _StdOut.putText(
                `You are in an instance of ` 
                + APP_NAME 
                + ` written in TypeScript...Python would have been better for the job`
            );
        }

        // A reliable way to enable Sarcasm mode.....wasn't aware cursing would do the trick at the time
        public shellSarcasm(args) {     
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case `on`:
                        if (_SarcasticMode) {
                            _StdOut.putText(`I'm unsure how much more sarcasm you can handle, its already on.`);
                        } else {
                            _SarcasticMode = true;
                            _StdOut.putText(`Sarcasm ON...big mistake.`);
                        }
                        break;
                    case `off`:
                        _SarcasticMode = false;
                        _StdOut.putText(`Sarcasm OFF...what am I to much for you?`);
                        break;
                    default:
                        _StdOut.putText(`Invalid arguement.  Usage: sarcasm <on | off>.`);
                }
            } else {
                _StdOut.putText(`Usage: sarcasm <on | off>`);
            }
        }

        public shellGetIP(args) {
            // _APIReq.GetIP();
            _StdOut.putText(`Client IP Address: `);
        }

        public shellStatus(args) {
            this.status = `Status: `
            args.forEach(function (value) {
                this.status += value;
                if (args.length > 1) {
                    this.status += ` `;
                }
            });
            document.getElementById(`status`).innerHTML = this.status;
            _StdOut.putText(`Status Updated to: ` + this.status);
        }

        public shellBSOD() {
            _Kernel.krnTrapError(`Forced by user`);
        }

        public shellDarkMode(args) {
            // CSS links.....CSS is not my thing
            var darkThemelink = 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.3/slate/bootstrap.min.css';
            var defaultThemelink = 'https://stackpath.bootstrapcdn.com/bootswatch/4.1.3/flatly/bootstrap.min.css';

            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case `on`:
                        //enable dark mode
                        document.getElementById(`theme`).setAttribute(`href`, darkThemelink);
                        _StdOut.putText(`Dark Mode Enabled.`);
                        break;
                    case `off`:
                        //disable dark mode
                        document.getElementById(`theme`).setAttribute(`href`, defaultThemelink);
                        _StdOut.putText(`Dark Mode Disabled.`);
                        break;
                    default:
                        _StdOut.putText(`Invalid arguement.  Usage: darktheme <on | off>.`);
                }
            } else {
                _StdOut.putText(`Usage: darktheme <on | off>.`);
            }
        }

        public shellLoad(args) {
            try {
                var userCode = (<HTMLInputElement> document.getElementById('taProgramInput')).value;

                // initial validation
                if (userCode === `` || userCode === ` `){
                    _StdOut.putText(`No user code found.`);
                    throw new Error(`No user code found.`);
                } else if (userCode.toUpperCase() != userCode) {
                    _StdOut.putText(`Invalid Syntax: Lower case character detected.`);
                    throw new Error(`Invalid Syntax: Lower case character detected.`);
                }

                // Begin splitting and validating individual chars
                var userCodeArr = userCode.split(' ');
                // Define valid hex characters
                var validInt = ['0','1','2','3','4','5','6','7','8','9'];
                var validChar = ['A','B', 'C', 'D', 'E', 'F'];
               
                // Iterate through each hex pair
                userCodeArr.forEach(char => {
                    // Make sure the hex is the correct length before even bothering to go deeper
                    if (char.length > 2) {
                        // Provide help to the user if the hex is detected as longer than 2 digits
                        _StdOut.putText(`Syntax Error: '${char}' is greater than 2 in length`);
                        _Console.advanceLine();
                        _StdOut.putText(`To resolve this issue please seperate digits by a space`);
                        throw new Error(`Syntax Error: '${char}' is greater than 2 in length`);
                    } else if (char.length < 2) {
                        // Provide help to the user if the hex is detected as less than 2 digits
                        _StdOut.putText(`Syntax Error: '${char}' is less than 2 in length`);
                        _Console.advanceLine();
                        _StdOut.putText(`To resolve this issue please create hex digits with a length of 2`);
                        throw new Error(`Syntax Error: '${char}' is less than 2 in length`);
                    }
                    // Go deeper into the user code, iterate through each char of each digit
                    var digits = char.split('');
                    digits.forEach(element => {
                        // If not a character... 
                        if (validChar.indexOf(element) === -1){
                            // then it must be a Integer...
                            if (validInt.indexOf(element)  === -1){
                                // if not, then alert the user
                                _StdOut.putText(`Syntax Error: '${element}' is not a valid Hex Character`);
                                _Console.advanceLine();
                                _StdOut.putText(`Valid Hex: A-F, 0-9`);
                                throw new Error(`Syntax Error: '${element}' is not a valid Hex Character`);
                            }
                        }

                        // If not a Integer... 
                        if (validInt.indexOf(element)  === -1){
                            // then it must be a Character...
                            if (validChar.indexOf(element)  === -1){
                                // if not, then alert the user
                                _StdOut.putText(`Syntax Error: '${element}' is not a valid Hex Character`);
                                _Console.advanceLine();
                                _StdOut.putText(`Valid Hex: A-F, 0-9`);
                                throw new Error(`Syntax Error: '${element}' is not a valid Hex Character`);
                            }
                        } 
                    });
                });

                
                // Ensure that the program does not exceed 256 bytes
                if (userCodeArr.length > 256) {
                    _StdOut.putText(`Program to Large, program is ${userCodeArr.length} bytes. Max is 256 per program.`);
                    throw new Error(`Program to Large, program is ${userCodeArr.length} bytes.`);
                }

                // If the check passes load the program to memory or disk
                var results = _MemoryManager.loadInMem(userCodeArr);
                if (results[0] == 1) { // memory full load into disk
                    var status = _MemoryManager.loadOnDisk(_PCM.pidCounter ,userCodeArr);
                    if (status[0] == 1) {
                        _StdOut.putText(`Program not loaded, Disk and Memory Full!`);
                        throw new Error(`Program not loaded, Disk and Memory Full!`);
                    } else {
                        //Create a new PCB
                        var pid = _PCM.createProcces(status[0], status[1], 0, status[3], status[4]);
                        _StdOut.putText(`Program load successful; <pid> ${pid} created`);
                    }
                } else {
                    let priority = 0;
                    if (args.length > 0) {
                        if (isNaN(Number(args[0]))) {
                            _StdOut.putText(`Program load unsuccessful; priority must be a numeric variable`);
                            throw new Error(`Program load unsuccessful; priority must be a numeric variable`);
                        } else {
                            priority = Number(args[0]);
                        }
                    }
                    //Create a new PCB
                    var pid = _PCM.createProcces(results[1], results[2], 0, results[3], `0:0:0`);
                   
                    _PCM.residentQueue[pid].priority = priority;
                    _StdOut.putText(`Program load successful; <pid> ${pid} created`);
                }
               
                
            } catch(e) {
                // Log the detailed error message
                console.log(e);
            }
        }
        
        public shellRun(args){
            // take only the very first PID and execute it
            if (args.length > 1){
                _StdOut.putText(`Run takes only 1 PID, running first found, ${args[0]}.`);
            } else if (args.length == 0) {
                _StdOut.putText(`Please specify the PID to execute.`);
            } else{
                // look to see if the PID is valid
                var pidFound = false;
                Object.keys(_PCM.residentQueue).forEach(pid => {
                    if (pid == args[0]) {
                        pidFound = true;
                    }  
                });
                // not found, check if its running already
                if (!pidFound){
                    Object.keys(_PCM.readyQueue).forEach(pid => {
                        if (pid == args[0]) {
                            pidFound = true;
                        }  
                    });
                    if(pidFound){
                        _StdOut.putText(`PID ${args[0]} is already loaded and in the Ready Queue`);
                        // finally check if it ded
                    } else {
                        Object.keys(_PCM.terminatedQueue).forEach(pid => {
                            if (pid == args[0]) {
                                pidFound = true;
                            }  
                        });
                        if(pidFound){
                            _StdOut.putText(`PID ${args[0]} is terminated and cannot be rerun.`);
                        } else {
                            _StdOut.putText(`PID "${args[0]}" not a valid program ID.`);
                        }
                    }

                } else {
                 
                    var pid = args[0];
                    _PCM.readyQueue[pid] = _PCM.residentQueue[pid];
                    delete _PCM.residentQueue[pid];
                    _PCM.readyQueue[pid].state = `ready`;
                    _SCHED.CycleQueue.enqueue(pid);
                    if (_CPU.isExecuting != true){
                        _PCM.execProcess();
                    }
                    _StdOut.putText(`Running program with <pid> ${pid}`);
                    _StdOut.advanceLine();
                }
                
            }
        }

        public verboseMode(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case `on`:  
                        _Verbose = true;
                        _StdOut.putText(`Verbose mode enabled.`);
                        (<HTMLButtonElement>document.getElementById(`btnSingleStep`)).setAttribute(`style`, ``);

                        break;
                    case `off`:
                        _Verbose = false;
                        _StdOut.putText(`Verbose mode disabled.`);
                        break;
                    default:
                        _StdOut.putText(`Invalid arguement.  Usage: verbose <on | off>.`);
                }
            } else {
                _StdOut.putText(`Usage: verbose <on | off>`);
            }
        }

        public clearMem() {
            if (_CPU.isExecuting){
                _StdOut.putText(`Error: process ${_PCM.runningprocess} is still executing, wait until the process has finished executing`);
            } else {
                _MemoryManager.wipeSeg00();
                _MemoryManager.wipeSeg01();
                _MemoryManager.wipeSeg02();
                _StdOut.putText(`Memory Cleared`);

            }
           
        }

        public isEmptyObject(obj) {
            for(var prop in obj) {
               if (obj.hasOwnProperty(prop)) {
                  return false;
               }
            }
            return true;
        }

        public ps() {
            if (_PCM.runningprocess.pid == -1 && Object.keys(_PCM.residentQueue).length == 0 && Object.keys(_PCM.readyQueue).length == 0){
                _StdOut.putText(`There are currently no process running, ready or resident`);
            } else {
                var outMsg = []
                if (_PCM.runningprocess.pid != -1 && _PCM.runningprocess.state != `terminated`){
                    outMsg.push(`[PID]:${_PCM.runningprocess.pid} ${_PCM.runningprocess.state}`)
                }
                // resident PIDS
                if (Object.keys(_PCM.residentQueue).length > 0){
                    Object.keys(_PCM.residentQueue).forEach(process => {
                        outMsg.push(`[PID]:${_PCM.residentQueue[process].pid} ${_PCM.residentQueue[process].state}`)
                    });
                }
                
                // ready PIDS
                if (Object.keys(_PCM.readyQueue).length > 0){
                    Object.keys(_PCM.readyQueue).forEach(process => {
                        outMsg.push(`[PID]:${_PCM.readyQueue[process].pid} ${_PCM.readyQueue[process].state}`)
                    });
                }
                
                // terminated PIDS
                if (Object.keys(_PCM.terminatedQueue).length > 0){
                    Object.keys(_PCM.terminatedQueue).forEach(process => {
                        outMsg.push(`[PID]:${_PCM.terminatedQueue[process].pid} ${_PCM.terminatedQueue[process].state}`)
                    });
                }
                // _StdOut.advanceLine();
                outMsg.forEach(msg => {
                    _StdOut.putText(msg);
                    _StdOut.advanceLine();
                });
            } 
        }

        public kill(args) {
            var pid = args[0];
            if (isNaN(Number(pid))) {
                _StdOut.putText(`not a valid PID, must be of type <int>`);
            } else {
                Object.keys(_PCM.terminatedQueue).forEach(currPid => {
                    if(currPid == pid){
                        _StdOut.putText(`Error: process ${pid} already terminated`);
                    }
                });
                _PCM.terminateProcess(pid);

            }
        }

        // load all resident processes into ready queue
        public runAll() {
            // load all resident processes into ready queue
            _PCM.runAll();
        }

        public setQuantum(args) {
            var q = args[0]
            if (q === parseInt(q, 10)){
                _StdOut.putText(`not a valid quantum, must be of type <int>`);
                _Console.advanceLine();
                _StdOut.putText(`quantum => ${_SCHED.quantum}`);
            } else {
                _SCHED.quantum = q
                _StdOut.putText(`quantum updated`);
                _Console.advanceLine();
                _StdOut.putText(`quantum => ${_SCHED.quantum}`);
            }
        }
        public setSchedule(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case `rr`:
                        _SCHED.scheduleMethod = setting;
                        _SCHED.quantum = 6;
                        _SCHED.cycle = 0;
                        _StdOut.putText(`Scheduling algorithm updated; now using ${_SCHED.scheduleMethod}`);
                        break;
                    case `fcfs`:
                        _SCHED.scheduleMethod = setting;
                        _SCHED.quantum = 10000;
                        _StdOut.putText(`Scheduling algorithm updated; now using ${_SCHED.scheduleMethod}`);
                        break;
                    case `priority`:
                        _SCHED.scheduleMethod = setting;
                        _StdOut.putText(`Scheduling algorithm updated; now using ${_SCHED.scheduleMethod}`);
                        break;
                    default:
                        _StdOut.putText(`Invalid arguement.  Usage: setschedule <algorithim>`);
                        _StdOut.putText(`Valid algorithims: [rr, fcfs, priority]`);
                }
            } else {
                _StdOut.putText(`Usage: setschedule <algorithim>`);
            }
        }

        public getSchedule(args) {
            _StdOut.putText(`scheduling algorithim in use: ${_SCHED.scheduleMethod}`);
        }


        public createFile(args) {
            let params = ``
            if (args.length == 0) {
                _StdOut.putText(`File creation unsuccessful; please provide a file name.`);
            } else {
                args.forEach(arg => {
                    params +=  arg  
                });
                params = params.trim()
                if (!/[^a-zA-Z\s]/.test(params)) {
                    let status = _krnDiskDriver.createFile(params)
                    if (status[0] == 0) {
                        _StdOut.putText(`File creation successful; <file> ${params}, ${status[1]}`);
                    } else {
                        _StdOut.putText(`File creation unsuccessful; <file> ${params}, ${status[1]}`);
                    }
                } else {
                    _StdOut.putText(`File creation unsuccessful; <file> ${params} not a valid file name`);
                }
            }
            
        }

        public readFile(args) {
            let params = ``;
            args.forEach(arg => {
                params +=  arg ;
            });
            params = params.trim()
            if (!/[^a-zA-Z\d*\s]/.test(params)) {
                let status = _krnDiskDriver.readFile(params)
                if (status[0] == 0) {
                    _StdOut.putText(`File read successful; <file> ${params} contents:`);
                    _Console.advanceLine();
                    _StdOut.putText(`${status[1]}`);
                } else if (status[0] == 1) {
                    _StdOut.putText(`File read unsuccessful; <file> ${params}, ${status[1]}`);
                }
            } else {
                _StdOut.putText(`File read unsuccessful; <file> ${params} not a valid file name`);
            }
        }

        public writeFile(args) {
            let file = args[0];
            let data = ``
            if (args.length < 2) {
                _StdOut.putText(`File write unsuccessful; <file> ${file}, no data provided`);

            } else {
                args.forEach((arg, index) => {
                    if (index == 0) {
                        return;
                    }
                    data += arg.replace(/"/g,``) + ` `
    
                });
    
                if (!/[^a-zA-Z\s]/.test(data)) {
                    let status = _krnDiskDriver.writeFile(file, data)
                    if (status[0] == 0) {
                        _StdOut.putText(`File write successful; <file> ${file}`);
                    } else if (status[0] == 1) {
                        _StdOut.putText(`File write unsuccessful; <file> ${file}, ${status[1]}`);
                    }
                } else {
                    _StdOut.putText(`File write unsuccessful; <file> ${file} Data can only contain characters and spaces`);
                }
            }
        }

        public deleteFile(args) {
            let params = ``;
            args.forEach(arg => {
                params +=  arg ;
            });
            params = params.trim()
            if (!/[^a-zA-Z\s]/.test(params)) {
                let status = _krnDiskDriver.delFile(params)
                if (status[0] == 0) {
                    _StdOut.putText(`File deletion successful; <file> ${params} ${status[1]}`);
                } else if (status[0] == 1) {
                    _StdOut.putText(`File deletion unsuccessful; <file> ${params}, ${status[1]}`);
                }
            } else {
                _StdOut.putText(`File deletion unsuccessful; <file> ${params} not a valid file name`);
            }
        }

        public format(args) {
            var setting = args[0];
            switch (setting) {
                case `-quick`:
                    var status = _krnDiskDriver.formatDisk(`quick`)
                    if (status == 0) {
                        _StdOut.putText(`quick format successful.`);
                    } else {
                        _StdOut.putText(`quick format unsuccessful.`);
                    }
                    break;
                case `-full`:
                    var status = _krnDiskDriver.formatDisk(`full`)
                    if (status == 0) {
                        _StdOut.putText(`full format successful.`);
                    } else {
                        _StdOut.putText(`full format unsuccessful.`);
                    }
                    break;
                default:
                    var status = _krnDiskDriver.formatDisk(`full`)
                    if (status == 0) {
                        _StdOut.putText(`full format successful.`);
                    } else {
                        _StdOut.putText(`full format unsuccessful.`);
                    }
            } 
        }

        public ls() {
            let files = _krnDiskDriver.listFiles();
            files.forEach(file => {
                _StdOut.putText(file);
                _Console.advanceLine();
            });
        }
    }
}
