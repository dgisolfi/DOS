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
const APP_NAME: string    = "DOS";   // 'cause Bob and I were at a loss for a better name.
const APP_VERSION: string = "2.1";   // project 2 

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                              // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
const KEYBOARD_IRQ: number = 1;

// Are these values important???
const PROCESS_EXIT: number = 2

const PRINT_IR: number = 3


//
// Global Variables
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//

var _CPU: DOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

// Memory Class
var _MEM: DOS.Memory;

var _MemoryAccessor: DOS.MemoryAccessor;
var _MemoryManager: DOS.MemoryManager;

//process control blocks
var _PCB: DOS.PCB;
var _PCM: DOS.processManager

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: DOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// API Calls
var _APIReq: DOS.APIrequests;

// UI
var _Console: DOS.Console;
var _OsShell: DOS.Shell;

var _date = new Date().toLocaleDateString();
var _time = new Date().toLocaleTimeString();



// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;

var _hardwareClockID: number = null;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onDocumentLoad = function() {
	DOS.Control.hostInit();
};

// keep track of single stepping
var _SingleStep: boolean = false;
var _Step: boolean = false;

// Run in verbose... yes or no?
var _Verbose: boolean = false;
// TODO Maybe put this somehwere else
let _shiftedSymbols = [ 
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
    { KeyCode: 59, Symbol: ":" },  // Tables also say this is ":" better safe than sorry
    { KeyCode: 61, Symbol: "+" },
    { KeyCode: 173, Symbol: "_" }, // Tables also say this is "_" better safe than sorry
    { KeyCode: 186, Symbol: ":" },
    { KeyCode: 187, Symbol: "+" }, // Tables also say this is "+" better safe than sorry
    { KeyCode: 188, Symbol: "<" },
    { KeyCode: 189, Symbol: "_" },
    { KeyCode: 190, Symbol: ">" },
    { KeyCode: 191, Symbol: "?" },
    { KeyCode: 192, Symbol: "`" },
    { KeyCode: 219, Symbol: "{" },
    { KeyCode: 220, Symbol: "|" },
    { KeyCode: 221, Symbol: "}" },
    { KeyCode: 222, Symbol: "\"" }
]

let _nonShiftedSymbols = [ 
    // Non-Shifted
    { KeyCode: 59, Symbol: ";" },  // Tables also say this is ":" better safe than sorry
    { KeyCode: 61, Symbol: "=" },
    { KeyCode: 173, Symbol: "-" }, // Tables also say this is "_" better safe than sorry
    { KeyCode: 186, Symbol: ";" }, 
    { KeyCode: 187, Symbol: "=" }, // Tables also say this is "=" better safe than sorry
    { KeyCode: 188, Symbol: "," },
    { KeyCode: 189, Symbol: "-" },
    { KeyCode: 190, Symbol: "," },
    { KeyCode: 191, Symbol: "/" },
    { KeyCode: 192, Symbol: "~" },
    { KeyCode: 219, Symbol: "[" },
    { KeyCode: 220, Symbol: "\\" },
    { KeyCode: 221, Symbol: "]" },
    { KeyCode: 222, Symbol: "'" }
]