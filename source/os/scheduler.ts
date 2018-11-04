/* ------------
   scheduler.ts
   ------------ */

module DOS {
    export class Scheduler {
        public scheduleMethod: string;
        public quantum: number;
        public cylce: number;

        public init() {
            this.scheduleMethod = "round robin";
            this.quantum = 6;
            this.cylce = 0;
        }

        public checkCycle(){
            
        }
        // 
        public schedule(){

        }
        // store the state
        public contextSwitch() {

        }
    }
}