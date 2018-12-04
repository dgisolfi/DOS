///<reference path="../globals.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var DOS;
(function (DOS) {
    var Console = /** @class */ (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, cmdHist, // Keeps array of commands entered
        cmdIndex, // Keeps track of index of command
        cmdSuggestions, tempIndex, canvasData) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (cmdHist === void 0) { cmdHist = []; }
            if (cmdIndex === void 0) { cmdIndex = 0; }
            if (cmdSuggestions === void 0) { cmdSuggestions = []; }
            if (tempIndex === void 0) { tempIndex = 0; }
            if (canvasData === void 0) { canvasData = ""; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.cmdHist = cmdHist;
            this.cmdIndex = cmdIndex;
            this.cmdSuggestions = cmdSuggestions;
            this.tempIndex = tempIndex;
            this.canvasData = canvasData;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    //... add the cmd to the history ...
                    this.cmdHist.push(this.buffer);
                    if (this.cmdHist.length <= 0) {
                        this.cmdIndex = 0;
                    }
                    else {
                        this.cmdIndex = this.cmdHist.length - 1;
                    }
                    // ... and reset our buffer.
                    this.buffer = "";
                    // Check if the backpace key was pressed.
                }
                else if (chr === String.fromCharCode(8)) { // Del  Key
                    // if it was pressed lets remove previous char
                    // this.putText("del");
                    // store char to be deleted, then remove from buffer
                    var lastChar = this.buffer.charAt(this.buffer.length - 1);
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                    // measure the length of the chosen prompt
                    var promptStart = _DrawingContext.measureText(this.currentFont, this.currentFontSize, _OsShell.promptStr);
                    // check if the cursor is already at the beginging of line
                    if (this.currentXPosition <= this.currentFontSize, promptStart) {
                        // measure x-length of last entered character
                        var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, lastChar);
                        // move the cursor and  over write the now deleted character
                        this.currentXPosition = this.currentXPosition - offset;
                        this.delChar(offset);
                    }
                }
                else if (chr === String.fromCharCode(9)) {
                    this.cmdCompletion();
                }
                else if (chr === "KeyUp") { // Up and down keys
                    this.cmdHistory("up");
                }
                else if (chr === "KeyDown") {
                    this.cmdHistory("down");
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            var _this = this;
            if (text !== "") {
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                // check if the lines exceeds the canvas
                if ((this.currentXPosition + offset) >= _Canvas.width) {
                    var chars = text.split('');
                    chars.forEach(function (char) {
                        //measure each char if it can fit on the line, put it there
                        var charLength = _DrawingContext.measureText(_this.currentFont, _this.currentFontSize, char);
                        if ((_this.currentXPosition + charLength) >= _Canvas.width) {
                            // go to next line
                            _this.advanceLine();
                        }
                        // no matter what write the character
                        _DrawingContext.drawText(_this.currentFont, _this.currentFontSize, _this.currentXPosition, _this.currentYPosition, char);
                        _this.currentXPosition = _this.currentXPosition + charLength;
                    });
                }
                else {
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    this.currentXPosition = this.currentXPosition + offset;
                }
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            // Create a temp to store old y val
            var oldYPosition = this.currentYPosition;
            // This is used a few times, lets put it here and make it prettier
            var descent = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            this.currentYPosition += _DefaultFontSize +
                descent +
                _FontHeightMargin;
            // Scrolling | Check if it even needs to be called
            if (this.currentYPosition >= _Canvas.height) {
                this.scroll(oldYPosition);
            }
        };
        // delete given character in canvas
        Console.prototype.delChar = function (offset) {
            // Measure the descent(do it here cuz its prettier)
            var descent = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            // Using the current fontsize, offset and descent clear the rectangle
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize, this.currentXPosition + offset, this.currentYPosition + descent);
        };
        Console.prototype.cmdCompletion = function () {
            var _this = this;
            // search for common commands in the known list
            _OsShell.commandList.forEach(function (element) {
                if (element.command.search(_this.buffer) === 0) {
                    // only add if the cmd is not already added
                    if (_this.cmdSuggestions.indexOf(element.command) !== 0) {
                        _this.cmdSuggestions.push(element.command);
                    }
                }
            });
            // now re check the results incase there is more than one possible cmd
            this.cmdSuggestions.forEach(function (element) {
                // if the cmd is no longer a possibility remove it and recall 
                //the function to check again
                if (element.search(_this.buffer) !== 0) {
                    var index = _this.cmdSuggestions.indexOf(element);
                    _this.cmdSuggestions.splice(index, 1);
                    _this.cmdCompletion();
                }
            });
            // remove any possible duplicates and test
            this.cmdSuggestions = this.removeDuplicates(this.cmdSuggestions);
            if (this.cmdSuggestions.length === 1) {
                // clear line and update buffer
                this.clearLine();
                this.buffer = this.cmdSuggestions[0];
                this.putText(this.buffer);
            }
        };
        Console.prototype.removeDuplicates = function (arr) {
            var array = arr.filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            });
            return array;
        };
        Console.prototype.cmdHistory = function (direc) {
            //clear the line and the buffer to avoid errors
            this.clearLine();
            this.buffer = "";
            if (direc === "up") {
                // check if index out of range then...
                if (this.cmdIndex != -1) {
                    // move pointer 
                    this.cmdIndex -= 1;
                    // display cur cmd
                    this.buffer = this.cmdHist[this.cmdIndex];
                    this.putText(this.buffer);
                }
            }
            else if (direc === "down") {
                // check if index out of range then...
                if (!(this.cmdIndex >= this.cmdHist.length - 1)) {
                    // move pointer 
                    this.cmdIndex += 1;
                    // display cur cmd
                    this.buffer = this.cmdHist[this.cmdIndex];
                    this.putText(this.buffer);
                }
            }
        };
        Console.prototype.clearLine = function () {
            // Measure the descent(do it here cuz its prettier)
            var descent = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            // Clear the entire line
            _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize, this.currentXPosition + this.buffer.length, this.currentYPosition + descent);
            // Whoops the prompt is gone....lets just put that back
            this.buffer = "";
            this.currentXPosition = 0;
            _OsShell.putPrompt();
        };
        Console.prototype.scroll = function (oldYPosition) {
            // store height of canvas for image
            var height = _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // take a snapshot of the canvas use this -> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
            this.canvasData = _DrawingContext.getImageData(0, height, _Canvas.width, this.currentYPosition);
            //clear the canvas
            this.clearScreen();
            //Redraw image
            _DrawingContext.putImageData(this.canvasData, 0, 0);
            // Move the cursur loc...otherwise youll bad things happen
            this.currentYPosition = oldYPosition;
        };
        Console.prototype.updateCPU = function () {
            var pc = "00" + _CPU.PC.toString();
            if (_CPU.PC > 99) {
                pc = _CPU.PC.toString();
            }
            else if (_CPU.PC > 9) {
                pc = "0" + _CPU.PC.toString();
            }
            document.getElementById("cpu-PC").innerHTML = pc;
            document.getElementById("cpu-IR").innerHTML = _CPU.IR;
            document.getElementById("cpu-Acc").innerHTML = _CPU.Acc.toString();
            document.getElementById("cpu-X").innerHTML = _CPU.Xreg.toString();
            document.getElementById("cpu-Y").innerHTML = _CPU.Yreg.toString();
            document.getElementById("cpu-Z").innerHTML = _CPU.Zflag.toString();
        };
        Console.prototype.updatePCB = function () {
            var processes = [];
            // resident process
            Object.keys(_PCM.residentQueue).forEach(function (process) {
                processes.push(_PCM.residentQueue[process]);
            });
            // ready process
            Object.keys(_PCM.readyQueue).forEach(function (process) {
                processes.push(_PCM.readyQueue[process]);
            });
            // runnning process
            if (_PCM.runningprocess.pid != -1) {
                processes.push(_PCM.runningprocess);
            }
            // terminated process
            Object.keys(_PCM.terminatedQueue).forEach(function (process) {
                processes.push(_PCM.terminatedQueue[process]);
            });
            if (processes.length == 0) {
                var out = "<tr class=\"table\">"
                    + "<td id=\"PID\">-</td>"
                    + "<td id=\"State\">-</td>"
                    + "<td id=\"PC\">-</td>"
                    + "<td id=\"IR\">-</td>"
                    + "<td id=\"Acc\">-</td>"
                    + "<td id=\"X\">-</td>"
                    + "<td id=\"Y\">-</td>"
                    + "<td id=\"Z\">-</td>"
                    + "</tr>";
                document.getElementById("process-table").innerHTML = out;
            }
            else {
                var out = "";
                processes.forEach(function (process) {
                    out += "<tr class=\"table\" id=\"" + process.pid + "\">"
                        + ("<td id=\"" + process.pid + "-PID\">" + process.pid + "</td>")
                        + ("<td id=\"" + process.pid + "-State\">" + process.state + "</td>")
                        + ("<td id=\"" + process.pid + "-PC\">" + process.PC + "</td>")
                        + ("<td id=\"" + process.pid + "-IR\">" + process.IR + "</td>")
                        + ("<td id=\"" + process.pid + "-Acc\">" + process.Acc + "</td>")
                        + ("<td id=\"" + process.pid + "-X\">" + process.XReg + "</td>")
                        + ("<td id=\"" + process.pid + "-Y\">" + process.YReg + "</td>")
                        + ("<td id=\"" + process.pid + "-Z\">" + process.ZFlag + "</td>")
                        + "</tr>";
                });
                document.getElementById("process-table").innerHTML = out;
            }
        };
        Console.prototype.updateMemory = function () {
            var rowCount = 0;
            var table = "";
            var rowData = [];
            _MEM.memory.forEach(function (hex) {
                //Build a row
                rowData.push(hex);
                if (rowData.length === 8) {
                    var row = "<tr class=\"table\">" +
                        ("<td id=\"mem-head\">" + ("0x" + rowCount.toString(16).toUpperCase()) + "</td>") +
                        ("<td id=\"mem-\">" + rowData[0] + "</td>") +
                        ("<td id=\"mem-IR\">" + rowData[1] + "</td>") +
                        ("<td id=\"mem-Acc\">" + rowData[2] + "</td>") +
                        ("<td id=\"mem-X\">" + rowData[3] + "</td>") +
                        ("<td id=\"mem-Y\">" + rowData[4] + "</td>") +
                        ("<td id=\"mem-Z\">" + rowData[5] + "</td>") +
                        ("<td id=\"mem-Z\">" + rowData[6] + "</td>") +
                        ("<td id=\"mem-Z\">" + rowData[7] + "</td>") +
                        "</tr>";
                    table += row;
                    rowData = [];
                    rowCount += 8;
                }
            });
            document.getElementById("mem").innerHTML = table;
        };
        Console.prototype.updateDateTime = function () {
            // update the display with cur time
            var datetime = _date + " | " + _time;
            document.getElementById("datetime").innerHTML = datetime;
        };
        Console.prototype.updateDisk = function () {
            var data = "";
            for (var track = 0; track < _DISK.tracks; track++) {
                for (var sector = 0; sector < _DISK.sectors; sector++) {
                    for (var block = 0; block < _DISK.blocks; block++) {
                        var tsb = track + ":" + sector + ":" + block;
                        var bits = _krnDiskDriver.getBlock(tsb);
                        var arr = bits['data'];
                        var row = "";
                        console.log(bits);
                        console.log(bits['data']);
                        // arr.forEach(val => {
                        //     row += val;
                        // });
                        // console.log(row);
                        // data += 
                        // `<tr>
                        //     <td>${tsb}</td>
                        //     <td>${row}</td>
                        // </tr>`
                    }
                }
            }
            // document.getElementById(`disk_data`).innerHTML = data;
        };
        return Console;
    }());
    DOS.Console = Console;
})(DOS || (DOS = {}));
