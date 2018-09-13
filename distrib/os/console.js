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
        cmdIndex // Keeps track of index of command
        ) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (cmdHist === void 0) { cmdHist = []; }
            if (cmdIndex === void 0) { cmdIndex = 0; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.cmdHist = cmdHist;
            this.cmdIndex = cmdIndex;
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
                    this.cmdIndex += 1;
                    // ... and reset our buffer.
                    this.buffer = "";
                    // Check if the backpace key was pressed.
                }
                else if (chr === String.fromCharCode(8)) { // Del  Key
                    //if it was pressed let remove previous char
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
                    this.cmdCompletion(chr);
                }
                else if (chr === String.fromCharCode(38)) { // Up and down keys
                    this.cmdHistory("up");
                }
                else if (chr === String.fromCharCode(40)) {
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
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
                // put current character into cmd list
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            // TODO: Handle scrolling. (iProject 1)
        };
        Console.prototype.updateDateTime = function () {
            var datetime = _date + " | " + _time;
            document.getElementById("datetime").innerHTML = datetime;
        };
        // delete given character in canvas
        Console.prototype.delChar = function (offset) {
            // Measure the descent(do it here cuz its prettier)
            var descent = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            // Using the current fontsize, offset and descent clear the rectangle
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - this.currentFontSize, this.currentXPosition + offset, this.currentYPosition + descent);
        };
        Console.prototype.cmdCompletion = function (cmd) {
            this.clearLine();
            console.log(_OsShell.commandList);
        };
        Console.prototype.cmdHistory = function (direc) {
            this.clearLine();
            if (direc === "up") {
                // check if index out of range then 
                if (this.cmdIndex >= 0) {
                    this.cmdIndex -= 1;
                    this.putText(this.cmdHist[this.cmdIndex]);
                }
                else {
                    // put nothing if out of range
                    this.putText("");
                }
            }
            else if (direc === "down") {
                // check if index out of range then 
                if (this.cmdIndex <= this.cmdHistory.length) {
                    this.cmdIndex += 1;
                    this.putText(this.cmdHist[this.cmdIndex]);
                }
                else {
                    // put nothing if out of range
                    this.putText("");
                }
            }
        };
        Console.prototype.clearLine = function () {
            // Measure the descent(do it here cuz its prettier)
            var descent = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            // Clear the entire line
            _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize, this.currentXPosition + this.buffer.length, this.currentYPosition + descent);
            // Whoops the prompt is gone....lets just put that back
            this.currentXPosition = 0;
            _OsShell.putPrompt();
        };
        return Console;
    }());
    DOS.Console = Console;
})(DOS || (DOS = {}));
