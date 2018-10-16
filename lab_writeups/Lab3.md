# Lab 3

1. Explain the difference between internal and external fragmentation. 

   Internal fragmentation is when fixed memory blocks are allocated to a process without considering the size of the process, and External fragmentation is when the processes is allocated dynamically in memory.

2. Given five (5) memory partitions of 100 KB, 500 KB, 200 KB, 300 KB, and 600 KB (in that order), how would optimal, First-Fit, best-Fit, and worst-Fit algorithms place processes of 212 KB, 417KB, 112 KB, and 426 KB(in that order)?

   **First Fit**

   None => 100KB

   212KB => 500KB

   112KB => 200KB

   None => 300KB

   417 => 600KB

   426KB in that order will not fit

   **Best Fit**

    None => 100KB

    417KB => 500KB

    112KB => 200KB

    212KB => 300KB

   426KB  => 600KB

   **Worst Fit**

   None => 100KB

   417KB => 500KB

   None => 200KB

   112KB => 300KB

   212KB  => 600KB

   426KB in that order will not fit
