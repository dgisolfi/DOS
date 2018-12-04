/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//
var APP_NAME = "DOS"; // 'cause Bob and I were at a loss for a better name.
var APP_VERSION = "2.1"; // project 2 
var CPU_CLOCK_INTERVAL = 100; // This is in ms (milliseconds) so 1000 = 1 second.
var TIMER_IRQ = 0; // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;
// Are these values important???
var PROCESS_EXIT = 2;
var PRINT_IR = 3;
var OUT_OF_BOUNDS = 4;
var CONTEXT_SWITCH = 5;
//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var _CPU; // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
// Memory Class
var _MEM;
var _MemoryAccessor;
var _MemoryManager;
//process control blocks
var _PCB;
var _PCM;
var _FCB;
var _SCHED;
var _DISK;
var _OSclock = 0; // Page 23.
var _Mode = 0; // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.
var _Canvas; // Initialized in Control.hostInit().
var _DrawingContext; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily = "sans"; // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4; // Additional space added to font size when advancing a line.
var _Trace = true; // Default the OS trace to be on.
// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue; // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue = null; // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers = null; // when clearly 'any' is not what we want. There is likely a better way, but what is it?
// Standard input and output
var _StdIn; // Same "to null or not to null" issue as above.
var _StdOut;
// API Calls
var _APIReq;
// UI
var _Console;
var _OsShell;
var _date = new Date().toLocaleDateString();
var _time = new Date().toLocaleTimeString();
// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;
// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _krnDiskDriver;
var _hardwareClockID = null;
// For testing (and enrichment)...
var Glados = null; // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS = null; // If the above is linked in, this is the instantiated instance of Glados.
var onDocumentLoad = function () {
    DOS.Control.hostInit();
};
// keep track of single stepping
var _SingleStep = false;
var _Step = false;
// Run in verbose... yes or no?
var _Verbose = false;
// TODO Maybe put this somehwere else
var _shiftedSymbols = [
    //Shifted
    { KeyCode: 48, Symbol: ")" },
    { KeyCode: 49, Symbol: "!" },
    { KeyCode: 50, Symbol: "@" },
    { KeyCode: 51, Symbol: "#" },
    { KeyCode: 52, Symbol: "$" },
    { KeyCode: 53, Symbol: "%" },
    { KeyCode: 54, Symbol: "^" },
    { KeyCode: 55, Symbol: "&" },
    { KeyCode: 56, Symbol: "*" },
    { KeyCode: 57, Symbol: "(" },
    { KeyCode: 59, Symbol: ":" },
    { KeyCode: 61, Symbol: "+" },
    { KeyCode: 173, Symbol: "_" },
    { KeyCode: 186, Symbol: ":" },
    { KeyCode: 187, Symbol: "+" },
    { KeyCode: 188, Symbol: "<" },
    { KeyCode: 189, Symbol: "_" },
    { KeyCode: 190, Symbol: ">" },
    { KeyCode: 191, Symbol: "?" },
    { KeyCode: 192, Symbol: "`" },
    { KeyCode: 219, Symbol: "{" },
    { KeyCode: 220, Symbol: "|" },
    { KeyCode: 221, Symbol: "}" },
    { KeyCode: 222, Symbol: "\"" }
];
var _nonShiftedSymbols = [
    // Non-Shifted
    { KeyCode: 59, Symbol: ";" },
    { KeyCode: 61, Symbol: "=" },
    { KeyCode: 173, Symbol: "-" },
    { KeyCode: 186, Symbol: ";" },
    { KeyCode: 187, Symbol: "=" },
    { KeyCode: 188, Symbol: "," },
    { KeyCode: 189, Symbol: "-" },
    { KeyCode: 190, Symbol: "," },
    { KeyCode: 191, Symbol: "/" },
    { KeyCode: 192, Symbol: "~" },
    { KeyCode: 219, Symbol: "[" },
    { KeyCode: 220, Symbol: "\\" },
    { KeyCode: 221, Symbol: "]" },
    { KeyCode: 222, Symbol: "'" }
];
