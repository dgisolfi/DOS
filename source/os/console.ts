///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module DOS {

    export class Console {
        constructor(
                public currentFont      = _DefaultFontFamily,
                public currentFontSize  = _DefaultFontSize,
                public currentXPosition = 0,
                public currentYPosition = _DefaultFontSize,
                public buffer           = "",
                public cmdHist          = [],       // Keeps array of commands entered
                public cmdIndex         = 0,        // Keeps track of index of command
                public cmdSuggestions   = [],
                public tempIndex        = 0,
                public canvasData       = ""
                ){
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
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
                    this.cmdIndex += 1; //this.cmdHist.length - 1;
                    // ... and reset our buffer.
                    this.buffer = "";
                                        
                // Check if the backpace key was pressed.
                } else if (chr === String.fromCharCode(8)) { // Del  Key
                    // if it was pressed lets remove previous char
                    // this.putText("del");
                    // store char to be deleted, then remove from buffer
                    var lastChar = this.buffer.charAt(this.buffer.length - 1);
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);

                    // measure the length of the chosen prompt
                    var promptStart = _DrawingContext.measureText(this.currentFont, this.currentFontSize, _OsShell.promptStr);
                    // check if the cursor is already at the beginging of line
                    if (this.currentXPosition !<= this.currentFontSize, promptStart){
                        // measure x-length of last entered character
                        var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, lastChar);

                        // move the cursor and  over write the now deleted character
                        this.currentXPosition = this.currentXPosition - offset;
                        this.delChar(offset);
                    }
                
                } else if (chr === String.fromCharCode(9)) {
                    this.cmdCompletion();
                
                } else if (chr === String.fromCharCode(38)) { // Up and down keys
                    this.cmdHistory("up");

                } else if (chr === String.fromCharCode(40)) {
                    this.cmdHistory("down");

                }else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
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
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            
            // Create a temp to store old y val
            var oldYPosition = this.currentYPosition;

            // This is used a few times, lets put it here and make it prettier
            var descent = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize)

            this.currentYPosition += _DefaultFontSize + 
                                     descent +
                                     _FontHeightMargin;

            // Scrolling | Check if it even needs to be called
            if (this.currentYPosition >= _Canvas.height) {
                this.scroll( oldYPosition);
            }
                         
        }

        public updateDateTime(): void {
            // update the display with cur time
            var datetime = _date + " | " + _time;
            document.getElementById("datetime").innerHTML = datetime;
        }

        // delete given character in canvas
        private delChar(offset): void {
            // Measure the descent(do it here cuz its prettier)
            var descent = _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            // Using the current fontsize, offset and descent clear the rectangle
            _DrawingContext.clearRect(
                this.currentXPosition, 
                this.currentYPosition - this.currentFontSize, 
                this.currentXPosition + offset, 
                this.currentYPosition + descent
            );
        }
        private cmdCompletion() {
            // search for common commands in the known list
            _OsShell.commandList.forEach(element => {
                if (element['command'].search(this.buffer) === 0) {
                    // only add if the cmd is not already added
                    if (this.cmdSuggestions.indexOf(element['command']) !== 0){
                        this.cmdSuggestions.push(element['command'])
                    }
                }
            });
            // now re check the results incase there is more than one possible cmd
            this.cmdSuggestions.forEach(element => {
                // if the cmd is no longer a possibility remove it and recall 
                //the function to check again
                if (element.search(this.buffer) !== 0) {
                    var index = this.cmdSuggestions.indexOf(element);
                    this.cmdSuggestions.splice(index,1);
                    this.cmdCompletion();
                }
            });

            if (this.cmdSuggestions.length === 1) {
                // clear line and update buffer
                this.clearLine();
                this.buffer = this.cmdSuggestions[0];
                this.putText(this.buffer);
            }
        }

        private cmdHistory(direc): void {
            //clear the line and the buffer to avoid errors
            this.clearLine();
            this.buffer = "";
            var tempIndex = this.cmdIndex;
            
            if (direc === "up") {
                // check if index out of range then 
                if (this.cmdIndex >= 0) {
                    this.cmdIndex--;
                    this.buffer += this.cmdHist[this.cmdIndex];
                    this.putText(this.cmdHist[this.cmdIndex]);
                } else {
                    // put nothing if out of range
                    this.putText("");
                }

            } else if (direc === "down") {
                // check if index out of range then 
                if (this.cmdIndex <= this.cmdHistory.length - 1) {
                    this.cmdIndex++;
                    this.buffer += this.cmdHist[this.cmdIndex];
                    this.putText(this.cmdHist[this.cmdIndex]);
                } else {
                    // put nothing if out of range
                    this.putText("");
                }
            }
            // Restore index after looking through history
           
        }
        
        private clearLine(): void {
            // Measure the descent(do it here cuz its prettier)
            var descent =  _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            // Clear the entire line
            _DrawingContext.clearRect(
                0, 
                this.currentYPosition - this.currentFontSize, 
                this.currentXPosition + this.buffer.length, 
                this.currentYPosition + descent
            );
            
            // Whoops the prompt is gone....lets just put that back
            this.buffer = ""; 
            this.currentXPosition = 0;
            _OsShell.putPrompt();
        }

        public scroll(oldYPosition): void {
            // store height of canvas for image
            var height = _DefaultFontSize +
                        _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                        _FontHeightMargin;
                     
            // take a snapshot of the canvas use this -> https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
            this.canvasData = _DrawingContext.getImageData(0, height, _Canvas.width, this.currentYPosition);
            //clear the canvas
            this.clearScreen()
            //Redraw image
            _DrawingContext.putImageData(this.canvasData, 0, 0);
            // Move the cursur loc...otherwise youll bad things happen
            this.currentYPosition = oldYPosition; 
        }
    }
 }
